Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var BuildView = (function (_View) {
  _inherits(BuildView, _View);

  _createClass(BuildView, null, [{
    key: 'initialTimerText',
    value: function initialTimerText() {
      return '0.0 s';
    }
  }, {
    key: 'initialHeadingText',
    value: function initialHeadingText() {
      return '¯\\_(ツ)_/¯';
    }
  }, {
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ tabIndex: -1, 'class': 'build tool-panel native-key-bindings' }, function () {
        _this.div({ 'class': 'heading', outlet: 'panelHeading' }, function () {
          _this.div({ 'class': 'control-container opaque-hover' }, function () {
            _this.button({ 'class': 'btn btn-default icon icon-zap', click: 'build', title: 'Build current project' });
            _this.button({ 'class': 'btn btn-default icon icon-trashcan', click: 'clearOutput' });
            _this.button({ 'class': 'btn btn-default icon icon-x', click: 'close' });
            _this.div({ 'class': 'title', outlet: 'title' }, function () {
              _this.span({ 'class': 'build-timer', outlet: 'buildTimer' }, _this.initialTimerText());
            });
          });
          _this.div({ 'class': 'heading-text', outlet: 'heading' }, _this.initialHeadingText());
        });

        _this.div({ 'class': 'output panel-body', outlet: 'output' });
        _this.div({ 'class': 'resizer', outlet: 'resizer' });
      });
    }
  }]);

  function BuildView() {
    var _context,
        _this2 = this;

    _classCallCheck(this, BuildView);

    var Terminal = require('term.js');

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(BuildView.prototype), 'constructor', this).apply(this, args);
    this.starttime = new Date();
    this.terminal = new Terminal({
      cursorBlink: false,
      convertEol: true,
      useFocus: false,
      termName: 'xterm-256color',
      scrollback: atom.config.get('build.terminalScrollback')
    });

    this.terminal.getContent = function () {
      return this.lines.reduce(function (m1, line) {
        return m1 + line.reduce(function (m2, col) {
          return m2 + col[1];
        }, '') + '\n';
      }, '');
    };

    this.fontGeometry = { w: 15, h: 15 };
    this.terminal.open(this.output[0]);
    this.destroyTerminal = (_context = this.terminal).destroy.bind(_context);
    this.terminal.destroy = this.terminal.destroySoon = function () {}; // This terminal will be open forever and reset when necessary
    this.terminalEl = (0, _atomSpacePenViews.$)(this.terminal.element);
    this.terminalEl[0].terminal = this.terminal; // For testing purposes

    this.resizeStarted = this.resizeStarted.bind(this);
    this.resizeMoved = this.resizeMoved.bind(this);
    this.resizeEnded = this.resizeEnded.bind(this);

    atom.config.observe('build.panelVisibility', this.visibleFromConfig.bind(this));
    atom.config.observe('build.panelOrientation', this.orientationFromConfig.bind(this));
    atom.config.observe('build.hidePanelHeading', function (hide) {
      hide && _this2.panelHeading.hide() || _this2.panelHeading.show();
    });
    atom.config.observe('build.overrideThemeColors', function (override) {
      _this2.output.removeClass('override-theme');
      override && _this2.output.addClass('override-theme');
    });
    atom.config.observe('editor.fontSize', this.fontSizeFromConfig.bind(this));
    atom.config.observe('editor.fontFamily', this.fontFamilyFromConfig.bind(this));
    atom.commands.add('atom-workspace', 'build:toggle-panel', this.toggle.bind(this));
  }

  _createClass(BuildView, [{
    key: 'destroy',
    value: function destroy() {
      this.destroyTerminal();
      clearInterval(this.detectResizeInterval);
    }
  }, {
    key: 'resizeStarted',
    value: function resizeStarted() {
      document.body.style['-webkit-user-select'] = 'none';
      document.addEventListener('mousemove', this.resizeMoved);
      document.addEventListener('mouseup', this.resizeEnded);
    }
  }, {
    key: 'resizeMoved',
    value: function resizeMoved(ev) {
      var h = this.fontGeometry.h;

      switch (atom.config.get('build.panelOrientation')) {
        case 'Bottom':
          {
            var delta = this.resizer.get(0).getBoundingClientRect().top - ev.y;
            if (Math.abs(delta) < h * 5 / 6) return;

            var nearestRowHeight = Math.round((this.terminalEl.height() + delta) / h) * h;
            var maxHeight = (0, _atomSpacePenViews.$)('.item-views').height() + (0, _atomSpacePenViews.$)('.build .output').height();
            this.terminalEl.css('height', Math.min(maxHeight, nearestRowHeight) + 'px');
            break;
          }

        case 'Top':
          {
            var delta = this.resizer.get(0).getBoundingClientRect().top - ev.y;
            if (Math.abs(delta) < h * 5 / 6) return;

            var nearestRowHeight = Math.round((this.terminalEl.height() - delta) / h) * h;
            var maxHeight = (0, _atomSpacePenViews.$)('.item-views').height() + (0, _atomSpacePenViews.$)('.build .output').height();
            this.terminalEl.css('height', Math.min(maxHeight, nearestRowHeight) + 'px');
            break;
          }

        case 'Left':
          {
            var delta = this.resizer.get(0).getBoundingClientRect().right - ev.x;
            this.css('width', this.width() - delta - this.resizer.outerWidth() + 'px');
            break;
          }

        case 'Right':
          {
            var delta = this.resizer.get(0).getBoundingClientRect().left - ev.x;
            this.css('width', this.width() + delta + 'px');
            break;
          }
      }

      this.resizeTerminal();
    }
  }, {
    key: 'resizeEnded',
    value: function resizeEnded() {
      document.body.style['-webkit-user-select'] = 'all';
      document.removeEventListener('mousemove', this.resizeMoved);
      document.removeEventListener('mouseup', this.resizeEnded);
    }
  }, {
    key: 'resizeToNearestRow',
    value: function resizeToNearestRow() {
      if (-1 !== ['Top', 'Bottom'].indexOf(atom.config.get('build.panelOrientation'))) {
        this.fixTerminalElHeight();
      }
      this.resizeTerminal();
    }
  }, {
    key: 'getFontGeometry',
    value: function getFontGeometry() {
      var o = (0, _atomSpacePenViews.$)('<div>A</div>').addClass('terminal').addClass('terminal-test').appendTo(this.output);
      var w = o[0].getBoundingClientRect().width;
      var h = o[0].getBoundingClientRect().height;
      o.remove();
      return { w: w, h: h };
    }
  }, {
    key: 'resizeTerminal',
    value: function resizeTerminal() {
      this.fontGeometry = this.getFontGeometry();
      var _fontGeometry = this.fontGeometry;
      var w = _fontGeometry.w;
      var h = _fontGeometry.h;

      if (0 === w || 0 === h) {
        return;
      }

      var terminalWidth = Math.floor(this.terminalEl.width() / w);
      var terminalHeight = Math.floor(this.terminalEl.height() / h);

      this.terminal.resize(terminalWidth, terminalHeight);
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      return this.terminal.getContent();
    }
  }, {
    key: 'attach',
    value: function attach() {
      var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (!force) {
        switch (atom.config.get('build.panelVisibility')) {
          case 'Hidden':
          case 'Show on Error':
            return;
        }
      }

      if (this.panel) {
        this.panel.destroy();
      }

      var addfn = {
        Top: atom.workspace.addTopPanel,
        Bottom: atom.workspace.addBottomPanel,
        Left: atom.workspace.addLeftPanel,
        Right: atom.workspace.addRightPanel
      };
      var orientation = atom.config.get('build.panelOrientation') || 'Bottom';
      this.panel = addfn[orientation].call(atom.workspace, { item: this });
      this.fixTerminalElHeight();
      this.resizeToNearestRow();
    }
  }, {
    key: 'fixTerminalElHeight',
    value: function fixTerminalElHeight() {
      var nearestRowHeight = (0, _atomSpacePenViews.$)('.build .output').height();
      this.terminalEl.css('height', nearestRowHeight + 'px');
    }
  }, {
    key: 'detach',
    value: function detach(force) {
      force = force || false;
      if (atom.views.getView(atom.workspace) && document.activeElement === this[0]) {
        atom.views.getView(atom.workspace).focus();
      }
      if (this.panel && (force || 'Keep Visible' !== atom.config.get('build.panelVisibility'))) {
        this.panel.destroy();
        this.panel = null;
      }
    }
  }, {
    key: 'isAttached',
    value: function isAttached() {
      return !!this.panel;
    }
  }, {
    key: 'visibleFromConfig',
    value: function visibleFromConfig(val) {
      switch (val) {
        case 'Toggle':
        case 'Show on Error':
          if (!this.terminalEl.hasClass('error')) {
            this.detach();
          }
          return;
      }

      this.attach();
    }
  }, {
    key: 'orientationFromConfig',
    value: function orientationFromConfig(orientation) {
      var isVisible = this.isVisible();
      this.detach(true);
      if (isVisible) {
        this.attach();
      }

      this.resizer.get(0).removeEventListener('mousedown', this.resizeStarted);

      switch (orientation) {
        case 'Top':
        case 'Bottom':
          this.get(0).style.width = null;
          this.resizer.get(0).addEventListener('mousedown', this.resizeStarted);
          break;

        case 'Left':
        case 'Right':
          this.terminalEl.get(0).style.height = null;
          this.resizer.get(0).addEventListener('mousedown', this.resizeStarted);
          break;
      }

      this.resizeTerminal();
    }
  }, {
    key: 'fontSizeFromConfig',
    value: function fontSizeFromConfig(size) {
      this.css({ 'font-size': size });
      this.resizeToNearestRow();
    }
  }, {
    key: 'fontFamilyFromConfig',
    value: function fontFamilyFromConfig(family) {
      this.css({ 'font-family': family });
      this.resizeToNearestRow();
    }
  }, {
    key: 'reset',
    value: function reset() {
      clearTimeout(this.titleTimer);
      this.buildTimer.text(BuildView.initialTimerText());
      this.titleTimer = 0;
      this.terminal.reset();

      this.panelHeading.removeClass('success error');
      this.title.removeClass('success error');

      this.detach();
    }
  }, {
    key: 'updateTitle',
    value: function updateTitle() {
      this.buildTimer.text(((new Date() - this.starttime) / 1000).toFixed(1) + ' s');
      this.titleTimer = setTimeout(this.updateTitle.bind(this), 100);
    }
  }, {
    key: 'close',
    value: function close() {
      this.detach(true);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      require('./google-analytics').sendEvent('view', 'panel toggled');
      this.isAttached() ? this.detach(true) : this.attach(true);
    }
  }, {
    key: 'clearOutput',
    value: function clearOutput() {
      this.terminal.reset();
    }
  }, {
    key: 'build',
    value: function build() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'build:trigger');
    }
  }, {
    key: 'setHeading',
    value: function setHeading(heading) {
      this.heading.text(heading);
    }
  }, {
    key: 'buildStarted',
    value: function buildStarted() {
      this.starttime = new Date();
      this.reset();
      this.attach();
      if (atom.config.get('build.stealFocus')) {
        this.focus();
      }
      this.updateTitle();
    }
  }, {
    key: 'buildFinished',
    value: function buildFinished(success) {
      if (!success && !this.isAttached()) {
        this.attach(atom.config.get('build.panelVisibility') === 'Show on Error');
      }
      this.finalizeBuild(success);
    }
  }, {
    key: 'buildAbortInitiated',
    value: function buildAbortInitiated() {}
  }, {
    key: 'buildAborted',
    value: function buildAborted() {
      this.finalizeBuild(false);
    }
  }, {
    key: 'finalizeBuild',
    value: function finalizeBuild(success) {
      this.title.addClass(success ? 'success' : 'error');
      this.panelHeading.addClass(success ? 'success' : 'error');
      clearTimeout(this.titleTimer);
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo(text) {
      var content = this.getContent();
      var endPos = -1;
      var curPos = text.length;
      // We need to decrease the size of `text` until we find a match. This is because
      // terminal will insert line breaks ('\r\n') when width of terminal is reached.
      // It may have been that the middle of a matched error is on a line break.
      while (-1 === endPos && curPos > 0) {
        endPos = content.indexOf(text.substring(0, curPos--));
      }

      if (curPos === 0) {
        // No match - which is weird. Oh well - rather be defensive
        return;
      }

      var row = content.slice(0, endPos).split('\n').length;
      this.terminal.ydisp = 0;
      this.terminal.scrollDisp(row - 1);
    }
  }]);

  return BuildView;
})(_atomSpacePenViews.View);

exports['default'] = BuildView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvYnVpbGQtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7aUNBRXdCLHNCQUFzQjs7QUFGOUMsV0FBVyxDQUFDOztJQUlTLFNBQVM7WUFBVCxTQUFTOztlQUFULFNBQVM7O1dBRUwsNEJBQUc7QUFDeEIsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUV3Qiw4QkFBRztBQUMxQixhQUFPLFlBQVksQ0FBQztLQUNyQjs7O1dBRWEsbUJBQUc7OztBQUNmLFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBTyxzQ0FBc0MsRUFBRSxFQUFFLFlBQU07QUFDOUUsY0FBSyxHQUFHLENBQUMsRUFBRSxTQUFPLFNBQVMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQUUsWUFBTTtBQUMzRCxnQkFBSyxHQUFHLENBQUMsRUFBRSxTQUFPLGdDQUFnQyxFQUFFLEVBQUUsWUFBTTtBQUMxRCxrQkFBSyxNQUFNLENBQUMsRUFBRSxTQUFPLCtCQUErQixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztBQUN4RyxrQkFBSyxNQUFNLENBQUMsRUFBRSxTQUFPLG9DQUFvQyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0FBQ25GLGtCQUFLLE1BQU0sQ0FBQyxFQUFFLFNBQU8sNkJBQTZCLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDdEUsa0JBQUssR0FBRyxDQUFDLEVBQUUsU0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFLFlBQU07QUFDbEQsb0JBQUssSUFBSSxDQUFDLEVBQUUsU0FBTyxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLE1BQUssZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO2FBQ3BGLENBQUMs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QUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDbkM7OztTQXpWa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9idWlsZC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFZpZXcsICQgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkVmlldyBleHRlbmRzIFZpZXcge1xuXG4gIHN0YXRpYyBpbml0aWFsVGltZXJUZXh0KCkge1xuICAgIHJldHVybiAnMC4wIHMnO1xuICB9XG5cbiAgc3RhdGljIGluaXRpYWxIZWFkaW5nVGV4dCgpIHtcbiAgICByZXR1cm4gJ8KvXFxcXF8o44OEKV8vwq8nO1xuICB9XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgdGhpcy5kaXYoeyB0YWJJbmRleDogLTEsIGNsYXNzOiAnYnVpbGQgdG9vbC1wYW5lbCBuYXRpdmUta2V5LWJpbmRpbmdzJyB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmRpdih7IGNsYXNzOiAnaGVhZGluZycsIG91dGxldDogJ3BhbmVsSGVhZGluZycgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnY29udHJvbC1jb250YWluZXIgb3BhcXVlLWhvdmVyJyB9LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0biBidG4tZGVmYXVsdCBpY29uIGljb24temFwJywgY2xpY2s6ICdidWlsZCcsIHRpdGxlOiAnQnVpbGQgY3VycmVudCBwcm9qZWN0JyB9KTtcbiAgICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiAnYnRuIGJ0bi1kZWZhdWx0IGljb24gaWNvbi10cmFzaGNhbicsIGNsaWNrOiAnY2xlYXJPdXRwdXQnIH0pO1xuICAgICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gYnRuLWRlZmF1bHQgaWNvbiBpY29uLXgnLCBjbGljazogJ2Nsb3NlJyB9KTtcbiAgICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAndGl0bGUnLCBvdXRsZXQ6ICd0aXRsZScgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdidWlsZC10aW1lcicsIG91dGxldDogJ2J1aWxkVGltZXInIH0sIHRoaXMuaW5pdGlhbFRpbWVyVGV4dCgpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdoZWFkaW5nLXRleHQnLCBvdXRsZXQ6ICdoZWFkaW5nJyB9LCB0aGlzLmluaXRpYWxIZWFkaW5nVGV4dCgpKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRpdih7IGNsYXNzOiAnb3V0cHV0IHBhbmVsLWJvZHknLCBvdXRsZXQ6ICdvdXRwdXQnIH0pO1xuICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ3Jlc2l6ZXInLCBvdXRsZXQ6ICdyZXNpemVyJyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBjb25zdCBUZXJtaW5hbCA9IHJlcXVpcmUoJ3Rlcm0uanMnKTtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgICB0aGlzLnN0YXJ0dGltZSA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy50ZXJtaW5hbCA9IG5ldyBUZXJtaW5hbCh7XG4gICAgICBjdXJzb3JCbGluazogZmFsc2UsXG4gICAgICBjb252ZXJ0RW9sOiB0cnVlLFxuICAgICAgdXNlRm9jdXM6IGZhbHNlLFxuICAgICAgdGVybU5hbWU6ICd4dGVybS0yNTZjb2xvcicsXG4gICAgICBzY3JvbGxiYWNrOiBhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnRlcm1pbmFsU2Nyb2xsYmFjaycpXG4gICAgfSk7XG5cbiAgICB0aGlzLnRlcm1pbmFsLmdldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5saW5lcy5yZWR1Y2UoKG0xLCBsaW5lKSA9PiB7XG4gICAgICAgIHJldHVybiBtMSArIGxpbmUucmVkdWNlKChtMiwgY29sKSA9PiBtMiArIGNvbFsxXSwgJycpICsgJ1xcbic7XG4gICAgICB9LCAnJyk7XG4gICAgfTtcblxuICAgIHRoaXMuZm9udEdlb21ldHJ5ID0geyB3OiAxNSwgaDogMTUgfTtcbiAgICB0aGlzLnRlcm1pbmFsLm9wZW4odGhpcy5vdXRwdXRbMF0pO1xuICAgIHRoaXMuZGVzdHJveVRlcm1pbmFsID0gOjoodGhpcy50ZXJtaW5hbCkuZGVzdHJveTtcbiAgICB0aGlzLnRlcm1pbmFsLmRlc3Ryb3kgPSB0aGlzLnRlcm1pbmFsLmRlc3Ryb3lTb29uID0gKCkgPT4ge307IC8vIFRoaXMgdGVybWluYWwgd2lsbCBiZSBvcGVuIGZvcmV2ZXIgYW5kIHJlc2V0IHdoZW4gbmVjZXNzYXJ5XG4gICAgdGhpcy50ZXJtaW5hbEVsID0gJCh0aGlzLnRlcm1pbmFsLmVsZW1lbnQpO1xuICAgIHRoaXMudGVybWluYWxFbFswXS50ZXJtaW5hbCA9IHRoaXMudGVybWluYWw7IC8vIEZvciB0ZXN0aW5nIHB1cnBvc2VzXG5cbiAgICB0aGlzLnJlc2l6ZVN0YXJ0ZWQgPSA6OnRoaXMucmVzaXplU3RhcnRlZDtcbiAgICB0aGlzLnJlc2l6ZU1vdmVkID0gOjp0aGlzLnJlc2l6ZU1vdmVkO1xuICAgIHRoaXMucmVzaXplRW5kZWQgPSA6OnRoaXMucmVzaXplRW5kZWQ7XG5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdidWlsZC5wYW5lbFZpc2liaWxpdHknLCA6OnRoaXMudmlzaWJsZUZyb21Db25maWcpO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2J1aWxkLnBhbmVsT3JpZW50YXRpb24nLCA6OnRoaXMub3JpZW50YXRpb25Gcm9tQ29uZmlnKTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdidWlsZC5oaWRlUGFuZWxIZWFkaW5nJywgKGhpZGUpID0+IHtcbiAgICAgIGhpZGUgJiYgdGhpcy5wYW5lbEhlYWRpbmcuaGlkZSgpIHx8IHRoaXMucGFuZWxIZWFkaW5nLnNob3coKTtcbiAgICB9KTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdidWlsZC5vdmVycmlkZVRoZW1lQ29sb3JzJywgKG92ZXJyaWRlKSA9PiB7XG4gICAgICB0aGlzLm91dHB1dC5yZW1vdmVDbGFzcygnb3ZlcnJpZGUtdGhlbWUnKTtcbiAgICAgIG92ZXJyaWRlICYmIHRoaXMub3V0cHV0LmFkZENsYXNzKCdvdmVycmlkZS10aGVtZScpO1xuICAgIH0pO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5mb250U2l6ZScsIDo6dGhpcy5mb250U2l6ZUZyb21Db25maWcpO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5mb250RmFtaWx5JywgOjp0aGlzLmZvbnRGYW1pbHlGcm9tQ29uZmlnKTtcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6dG9nZ2xlLXBhbmVsJywgOjp0aGlzLnRvZ2dsZSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveVRlcm1pbmFsKCk7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmRldGVjdFJlc2l6ZUludGVydmFsKTtcbiAgfVxuXG4gIHJlc2l6ZVN0YXJ0ZWQoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZVsnLXdlYmtpdC11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplTW92ZWQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUVuZGVkKTtcbiAgfVxuXG4gIHJlc2l6ZU1vdmVkKGV2KSB7XG4gICAgY29uc3QgeyBoIH0gPSB0aGlzLmZvbnRHZW9tZXRyeTtcblxuICAgIHN3aXRjaCAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5wYW5lbE9yaWVudGF0aW9uJykpIHtcbiAgICAgIGNhc2UgJ0JvdHRvbSc6IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnJlc2l6ZXIuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGV2Lnk7XG4gICAgICAgIGlmIChNYXRoLmFicyhkZWx0YSkgPCAoaCAqIDUgLyA2KSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG5lYXJlc3RSb3dIZWlnaHQgPSBNYXRoLnJvdW5kKCh0aGlzLnRlcm1pbmFsRWwuaGVpZ2h0KCkgKyBkZWx0YSkgLyBoKSAqIGg7XG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9ICQoJy5pdGVtLXZpZXdzJykuaGVpZ2h0KCkgKyAkKCcuYnVpbGQgLm91dHB1dCcpLmhlaWdodCgpO1xuICAgICAgICB0aGlzLnRlcm1pbmFsRWwuY3NzKCdoZWlnaHQnLCBgJHtNYXRoLm1pbihtYXhIZWlnaHQsIG5lYXJlc3RSb3dIZWlnaHQpfXB4YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdUb3AnOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5yZXNpemVyLmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBldi55O1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGVsdGEpIDwgKGggKiA1IC8gNikpIHJldHVybjtcblxuICAgICAgICBjb25zdCBuZWFyZXN0Um93SGVpZ2h0ID0gTWF0aC5yb3VuZCgodGhpcy50ZXJtaW5hbEVsLmhlaWdodCgpIC0gZGVsdGEpIC8gaCkgKiBoO1xuICAgICAgICBjb25zdCBtYXhIZWlnaHQgPSAkKCcuaXRlbS12aWV3cycpLmhlaWdodCgpICsgJCgnLmJ1aWxkIC5vdXRwdXQnKS5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy50ZXJtaW5hbEVsLmNzcygnaGVpZ2h0JywgYCR7TWF0aC5taW4obWF4SGVpZ2h0LCBuZWFyZXN0Um93SGVpZ2h0KX1weGApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnTGVmdCc6IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnJlc2l6ZXIuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0IC0gZXYueDtcbiAgICAgICAgdGhpcy5jc3MoJ3dpZHRoJywgYCR7dGhpcy53aWR0aCgpIC0gZGVsdGEgLSB0aGlzLnJlc2l6ZXIub3V0ZXJXaWR0aCgpfXB4YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdSaWdodCc6IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnJlc2l6ZXIuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBldi54O1xuICAgICAgICB0aGlzLmNzcygnd2lkdGgnLCBgJHt0aGlzLndpZHRoKCkgKyBkZWx0YX1weGApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJlc2l6ZVRlcm1pbmFsKCk7XG4gIH1cblxuICByZXNpemVFbmRlZCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlWyctd2Via2l0LXVzZXItc2VsZWN0J10gPSAnYWxsJztcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZU1vdmVkKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5yZXNpemVFbmRlZCk7XG4gIH1cblxuICByZXNpemVUb05lYXJlc3RSb3coKSB7XG4gICAgaWYgKC0xICE9PSBbICdUb3AnLCAnQm90dG9tJyBdLmluZGV4T2YoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5wYW5lbE9yaWVudGF0aW9uJykpKSB7XG4gICAgICB0aGlzLmZpeFRlcm1pbmFsRWxIZWlnaHQoKTtcbiAgICB9XG4gICAgdGhpcy5yZXNpemVUZXJtaW5hbCgpO1xuICB9XG5cbiAgZ2V0Rm9udEdlb21ldHJ5KCkge1xuICAgIGNvbnN0IG8gPSAkKCc8ZGl2PkE8L2Rpdj4nKVxuICAgICAgLmFkZENsYXNzKCd0ZXJtaW5hbCcpXG4gICAgICAuYWRkQ2xhc3MoJ3Rlcm1pbmFsLXRlc3QnKVxuICAgICAgLmFwcGVuZFRvKHRoaXMub3V0cHV0KTtcbiAgICBjb25zdCB3ID0gb1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICBjb25zdCBoID0gb1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgby5yZW1vdmUoKTtcbiAgICByZXR1cm4geyB3OiB3LCBoOiBofTtcbiAgfVxuXG4gIHJlc2l6ZVRlcm1pbmFsKCkge1xuICAgIHRoaXMuZm9udEdlb21ldHJ5ID0gdGhpcy5nZXRGb250R2VvbWV0cnkoKTtcbiAgICBjb25zdCB7IHcsIGggfSA9IHRoaXMuZm9udEdlb21ldHJ5O1xuICAgIGlmICgwID09PSB3IHx8IDAgPT09IGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXJtaW5hbFdpZHRoID0gTWF0aC5mbG9vcigodGhpcy50ZXJtaW5hbEVsLndpZHRoKCkpIC8gdyk7XG4gICAgY29uc3QgdGVybWluYWxIZWlnaHQgPSBNYXRoLmZsb29yKCh0aGlzLnRlcm1pbmFsRWwuaGVpZ2h0KCkpIC8gaCk7XG5cbiAgICB0aGlzLnRlcm1pbmFsLnJlc2l6ZSh0ZXJtaW5hbFdpZHRoLCB0ZXJtaW5hbEhlaWdodCk7XG4gIH1cblxuICBnZXRDb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLnRlcm1pbmFsLmdldENvbnRlbnQoKTtcbiAgfVxuXG4gIGF0dGFjaChmb3JjZSA9IGZhbHNlKSB7XG4gICAgaWYgKCFmb3JjZSkge1xuICAgICAgc3dpdGNoIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScpKSB7XG4gICAgICAgIGNhc2UgJ0hpZGRlbic6XG4gICAgICAgIGNhc2UgJ1Nob3cgb24gRXJyb3InOlxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgY29uc3QgYWRkZm4gPSB7XG4gICAgICBUb3A6IGF0b20ud29ya3NwYWNlLmFkZFRvcFBhbmVsLFxuICAgICAgQm90dG9tOiBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCxcbiAgICAgIExlZnQ6IGF0b20ud29ya3NwYWNlLmFkZExlZnRQYW5lbCxcbiAgICAgIFJpZ2h0OiBhdG9tLndvcmtzcGFjZS5hZGRSaWdodFBhbmVsXG4gICAgfTtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxPcmllbnRhdGlvbicpIHx8ICdCb3R0b20nO1xuICAgIHRoaXMucGFuZWwgPSBhZGRmbltvcmllbnRhdGlvbl0uY2FsbChhdG9tLndvcmtzcGFjZSwgeyBpdGVtOiB0aGlzIH0pO1xuICAgIHRoaXMuZml4VGVybWluYWxFbEhlaWdodCgpO1xuICAgIHRoaXMucmVzaXplVG9OZWFyZXN0Um93KCk7XG4gIH1cblxuICBmaXhUZXJtaW5hbEVsSGVpZ2h0KCkge1xuICAgIGNvbnN0IG5lYXJlc3RSb3dIZWlnaHQgPSAkKCcuYnVpbGQgLm91dHB1dCcpLmhlaWdodCgpO1xuICAgIHRoaXMudGVybWluYWxFbC5jc3MoJ2hlaWdodCcsIGAke25lYXJlc3RSb3dIZWlnaHR9cHhgKTtcbiAgfVxuXG4gIGRldGFjaChmb3JjZSkge1xuICAgIGZvcmNlID0gZm9yY2UgfHwgZmFsc2U7XG4gICAgaWYgKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpc1swXSkge1xuICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKS5mb2N1cygpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYW5lbCAmJiAoZm9yY2UgfHwgJ0tlZXAgVmlzaWJsZScgIT09IGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JykpKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlzQXR0YWNoZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5wYW5lbDtcbiAgfVxuXG4gIHZpc2libGVGcm9tQ29uZmlnKHZhbCkge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICBjYXNlICdUb2dnbGUnOlxuICAgICAgY2FzZSAnU2hvdyBvbiBFcnJvcic6XG4gICAgICAgIGlmICghdGhpcy50ZXJtaW5hbEVsLmhhc0NsYXNzKCdlcnJvcicpKSB7XG4gICAgICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hdHRhY2goKTtcbiAgfVxuXG4gIG9yaWVudGF0aW9uRnJvbUNvbmZpZyhvcmllbnRhdGlvbikge1xuICAgIGNvbnN0IGlzVmlzaWJsZSA9IHRoaXMuaXNWaXNpYmxlKCk7XG4gICAgdGhpcy5kZXRhY2godHJ1ZSk7XG4gICAgaWYgKGlzVmlzaWJsZSkge1xuICAgICAgdGhpcy5hdHRhY2goKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc2l6ZXIuZ2V0KDApLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMucmVzaXplU3RhcnRlZCk7XG5cbiAgICBzd2l0Y2ggKG9yaWVudGF0aW9uKSB7XG4gICAgICBjYXNlICdUb3AnOlxuICAgICAgY2FzZSAnQm90dG9tJzpcbiAgICAgICAgdGhpcy5nZXQoMCkuc3R5bGUud2lkdGggPSBudWxsO1xuICAgICAgICB0aGlzLnJlc2l6ZXIuZ2V0KDApLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMucmVzaXplU3RhcnRlZCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdMZWZ0JzpcbiAgICAgIGNhc2UgJ1JpZ2h0JzpcbiAgICAgICAgdGhpcy50ZXJtaW5hbEVsLmdldCgwKS5zdHlsZS5oZWlnaHQgPSBudWxsO1xuICAgICAgICB0aGlzLnJlc2l6ZXIuZ2V0KDApLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMucmVzaXplU3RhcnRlZCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMucmVzaXplVGVybWluYWwoKTtcbiAgfVxuXG4gIGZvbnRTaXplRnJvbUNvbmZpZyhzaXplKSB7XG4gICAgdGhpcy5jc3MoeyAnZm9udC1zaXplJzogc2l6ZSB9KTtcbiAgICB0aGlzLnJlc2l6ZVRvTmVhcmVzdFJvdygpO1xuICB9XG5cbiAgZm9udEZhbWlseUZyb21Db25maWcoZmFtaWx5KSB7XG4gICAgdGhpcy5jc3MoeyAnZm9udC1mYW1pbHknOiBmYW1pbHkgfSk7XG4gICAgdGhpcy5yZXNpemVUb05lYXJlc3RSb3coKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpdGxlVGltZXIpO1xuICAgIHRoaXMuYnVpbGRUaW1lci50ZXh0KEJ1aWxkVmlldy5pbml0aWFsVGltZXJUZXh0KCkpO1xuICAgIHRoaXMudGl0bGVUaW1lciA9IDA7XG4gICAgdGhpcy50ZXJtaW5hbC5yZXNldCgpO1xuXG4gICAgdGhpcy5wYW5lbEhlYWRpbmcucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MgZXJyb3InKTtcbiAgICB0aGlzLnRpdGxlLnJlbW92ZUNsYXNzKCdzdWNjZXNzIGVycm9yJyk7XG5cbiAgICB0aGlzLmRldGFjaCgpO1xuICB9XG5cbiAgdXBkYXRlVGl0bGUoKSB7XG4gICAgdGhpcy5idWlsZFRpbWVyLnRleHQoKChuZXcgRGF0ZSgpIC0gdGhpcy5zdGFydHRpbWUpIC8gMTAwMCkudG9GaXhlZCgxKSArICcgcycpO1xuICAgIHRoaXMudGl0bGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy51cGRhdGVUaXRsZS5iaW5kKHRoaXMpLCAxMDApO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5kZXRhY2godHJ1ZSk7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCd2aWV3JywgJ3BhbmVsIHRvZ2dsZWQnKTtcbiAgICB0aGlzLmlzQXR0YWNoZWQoKSA/IHRoaXMuZGV0YWNoKHRydWUpIDogdGhpcy5hdHRhY2godHJ1ZSk7XG4gIH1cblxuICBjbGVhck91dHB1dCgpIHtcbiAgICB0aGlzLnRlcm1pbmFsLnJlc2V0KCk7XG4gIH1cblxuICBidWlsZCgpIHtcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdidWlsZDp0cmlnZ2VyJyk7XG4gIH1cblxuICBzZXRIZWFkaW5nKGhlYWRpbmcpIHtcbiAgICB0aGlzLmhlYWRpbmcudGV4dChoZWFkaW5nKTtcbiAgfVxuXG4gIGJ1aWxkU3RhcnRlZCgpIHtcbiAgICB0aGlzLnN0YXJ0dGltZSA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMuYXR0YWNoKCk7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnYnVpbGQuc3RlYWxGb2N1cycpKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcbiAgfVxuXG4gIGJ1aWxkRmluaXNoZWQoc3VjY2Vzcykge1xuICAgIGlmICghc3VjY2VzcyAmJiAhdGhpcy5pc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuYXR0YWNoKGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JykgPT09ICdTaG93IG9uIEVycm9yJyk7XG4gICAgfVxuICAgIHRoaXMuZmluYWxpemVCdWlsZChzdWNjZXNzKTtcbiAgfVxuXG4gIGJ1aWxkQWJvcnRJbml0aWF0ZWQoKSB7XG4gIH1cblxuICBidWlsZEFib3J0ZWQoKSB7XG4gICAgdGhpcy5maW5hbGl6ZUJ1aWxkKGZhbHNlKTtcbiAgfVxuXG4gIGZpbmFsaXplQnVpbGQoc3VjY2Vzcykge1xuICAgIHRoaXMudGl0bGUuYWRkQ2xhc3Moc3VjY2VzcyA/ICdzdWNjZXNzJyA6ICdlcnJvcicpO1xuICAgIHRoaXMucGFuZWxIZWFkaW5nLmFkZENsYXNzKHN1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZXJyb3InKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aXRsZVRpbWVyKTtcbiAgfVxuXG4gIHNjcm9sbFRvKHRleHQpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5nZXRDb250ZW50KCk7XG4gICAgbGV0IGVuZFBvcyA9IC0xO1xuICAgIGxldCBjdXJQb3MgPSB0ZXh0Lmxlbmd0aDtcbiAgICAvLyBXZSBuZWVkIHRvIGRlY3JlYXNlIHRoZSBzaXplIG9mIGB0ZXh0YCB1bnRpbCB3ZSBmaW5kIGEgbWF0Y2guIFRoaXMgaXMgYmVjYXVzZVxuICAgIC8vIHRlcm1pbmFsIHdpbGwgaW5zZXJ0IGxpbmUgYnJlYWtzICgnXFxyXFxuJykgd2hlbiB3aWR0aCBvZiB0ZXJtaW5hbCBpcyByZWFjaGVkLlxuICAgIC8vIEl0IG1heSBoYXZlIGJlZW4gdGhhdCB0aGUgbWlkZGxlIG9mIGEgbWF0Y2hlZCBlcnJvciBpcyBvbiBhIGxpbmUgYnJlYWsuXG4gICAgd2hpbGUgKC0xID09PSBlbmRQb3MgJiYgY3VyUG9zID4gMCkge1xuICAgICAgZW5kUG9zID0gY29udGVudC5pbmRleE9mKHRleHQuc3Vic3RyaW5nKDAsIGN1clBvcy0tKSk7XG4gICAgfVxuXG4gICAgaWYgKGN1clBvcyA9PT0gMCkge1xuICAgICAgLy8gTm8gbWF0Y2ggLSB3aGljaCBpcyB3ZWlyZC4gT2ggd2VsbCAtIHJhdGhlciBiZSBkZWZlbnNpdmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb3cgPSBjb250ZW50LnNsaWNlKDAsIGVuZFBvcykuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICB0aGlzLnRlcm1pbmFsLnlkaXNwID0gMDtcbiAgICB0aGlzLnRlcm1pbmFsLnNjcm9sbERpc3Aocm93IC0gMSk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build/lib/build-view.js
