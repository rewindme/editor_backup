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
      termName: 'xterm-256color'
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
            var delta = this.panelHeading.get(0).getBoundingClientRect().top - ev.y;
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
      if (-1 !== ['Left', 'Right'].indexOf(atom.config.get('build.panelOrientation'))) {
        this.resizeTerminal();
        return;
      }

      var _getFontGeometry = this.getFontGeometry();

      var h = _getFontGeometry.h;

      var nearestRowHeight = Math.round(this.terminalEl.height() / h) * h;
      this.terminalEl.css('height', nearestRowHeight + 'px');
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
      this.resizeToNearestRow();
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
      // We need to decrese the size of `text` until we find a match. This is because
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvYnVpbGQtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7aUNBRXdCLHNCQUFzQjs7QUFGOUMsV0FBVyxDQUFDOztJQUlTLFNBQVM7WUFBVCxTQUFTOztlQUFULFNBQVM7O1dBRUwsNEJBQUc7QUFDeEIsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUV3Qiw4QkFBRztBQUMxQixhQUFPLFlBQVksQ0FBQztLQUNyQjs7O1dBRWEsbUJBQUc7OztBQUNmLFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBTyxzQ0FBc0MsRUFBRSxFQUFFLFlBQU07QUFDOUUsY0FBSyxHQUFHLENBQUMsRUFBRSxTQUFPLFNBQVMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQUUsWUFBTTtBQUMzRCxnQkFBSyxHQUFHLENBQUMsRUFBRSxTQUFPLGdDQUFnQyxFQUFFLEVBQUUsWUFBTTtBQUMxRCxrQkFBSyxNQUFNLENBQUMsRUFBRSxTQUFPLCtCQUErQixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztBQUN4RyxrQkFBSyxNQUFNLENBQUMsRUFBRSxTQUFPLG9DQUFvQyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0FBQ25GLGtCQUFLLE1BQU0sQ0FBQyxFQUFFLFNBQU8sNkJBQTZCLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDdEUsa0JBQUssR0FBRyxDQUFDLEVBQUUsU0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFLFlBQU07QUFDbEQsb0JBQUssSUFBSSxDQUFDLEVBQUUsU0FBTyxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLE1BQUssZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO2FBQ3BGLENBQUMs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QUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ25DOzs7U0F0VmtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvYnVpbGQtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBWaWV3LCAkIH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWlsZFZpZXcgZXh0ZW5kcyBWaWV3IHtcblxuICBzdGF0aWMgaW5pdGlhbFRpbWVyVGV4dCgpIHtcbiAgICByZXR1cm4gJzAuMCBzJztcbiAgfVxuXG4gIHN0YXRpYyBpbml0aWFsSGVhZGluZ1RleHQoKSB7XG4gICAgcmV0dXJuICfCr1xcXFxfKOODhClfL8KvJztcbiAgfVxuXG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHRoaXMuZGl2KHsgdGFiSW5kZXg6IC0xLCBjbGFzczogJ2J1aWxkIHRvb2wtcGFuZWwgbmF0aXZlLWtleS1iaW5kaW5ncycgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ2hlYWRpbmcnLCBvdXRsZXQ6ICdwYW5lbEhlYWRpbmcnIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ2NvbnRyb2wtY29udGFpbmVyIG9wYXF1ZS1ob3ZlcicgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gYnRuLWRlZmF1bHQgaWNvbiBpY29uLXphcCcsIGNsaWNrOiAnYnVpbGQnLCB0aXRsZTogJ0J1aWxkIGN1cnJlbnQgcHJvamVjdCcgfSk7XG4gICAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0biBidG4tZGVmYXVsdCBpY29uIGljb24tdHJhc2hjYW4nLCBjbGljazogJ2NsZWFyT3V0cHV0JyB9KTtcbiAgICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiAnYnRuIGJ0bi1kZWZhdWx0IGljb24gaWNvbi14JywgY2xpY2s6ICdjbG9zZScgfSk7XG4gICAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ3RpdGxlJywgb3V0bGV0OiAndGl0bGUnIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAnYnVpbGQtdGltZXInLCBvdXRsZXQ6ICdidWlsZFRpbWVyJyB9LCB0aGlzLmluaXRpYWxUaW1lclRleHQoKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnaGVhZGluZy10ZXh0Jywgb3V0bGV0OiAnaGVhZGluZycgfSwgdGhpcy5pbml0aWFsSGVhZGluZ1RleHQoKSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ291dHB1dCBwYW5lbC1ib2R5Jywgb3V0bGV0OiAnb3V0cHV0JyB9KTtcbiAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdyZXNpemVyJywgb3V0bGV0OiAncmVzaXplcicgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgY29uc3QgVGVybWluYWwgPSByZXF1aXJlKCd0ZXJtLmpzJyk7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gICAgdGhpcy5zdGFydHRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMudGVybWluYWwgPSBuZXcgVGVybWluYWwoe1xuICAgICAgY3Vyc29yQmxpbms6IGZhbHNlLFxuICAgICAgY29udmVydEVvbDogdHJ1ZSxcbiAgICAgIHVzZUZvY3VzOiBmYWxzZSxcbiAgICAgIHRlcm1OYW1lOiAneHRlcm0tMjU2Y29sb3InXG4gICAgfSk7XG5cbiAgICB0aGlzLnRlcm1pbmFsLmdldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5saW5lcy5yZWR1Y2UoKG0xLCBsaW5lKSA9PiB7XG4gICAgICAgIHJldHVybiBtMSArIGxpbmUucmVkdWNlKChtMiwgY29sKSA9PiBtMiArIGNvbFsxXSwgJycpICsgJ1xcbic7XG4gICAgICB9LCAnJyk7XG4gICAgfTtcblxuICAgIHRoaXMuZm9udEdlb21ldHJ5ID0geyB3OiAxNSwgaDogMTUgfTtcbiAgICB0aGlzLnRlcm1pbmFsLm9wZW4odGhpcy5vdXRwdXRbMF0pO1xuICAgIHRoaXMuZGVzdHJveVRlcm1pbmFsID0gOjoodGhpcy50ZXJtaW5hbCkuZGVzdHJveTtcbiAgICB0aGlzLnRlcm1pbmFsLmRlc3Ryb3kgPSB0aGlzLnRlcm1pbmFsLmRlc3Ryb3lTb29uID0gKCkgPT4ge307IC8vIFRoaXMgdGVybWluYWwgd2lsbCBiZSBvcGVuIGZvcmV2ZXIgYW5kIHJlc2V0IHdoZW4gbmVjZXNzYXJ5XG4gICAgdGhpcy50ZXJtaW5hbEVsID0gJCh0aGlzLnRlcm1pbmFsLmVsZW1lbnQpO1xuICAgIHRoaXMudGVybWluYWxFbFswXS50ZXJtaW5hbCA9IHRoaXMudGVybWluYWw7IC8vIEZvciB0ZXN0aW5nIHB1cnBvc2VzXG5cbiAgICB0aGlzLnJlc2l6ZVN0YXJ0ZWQgPSA6OnRoaXMucmVzaXplU3RhcnRlZDtcbiAgICB0aGlzLnJlc2l6ZU1vdmVkID0gOjp0aGlzLnJlc2l6ZU1vdmVkO1xuICAgIHRoaXMucmVzaXplRW5kZWQgPSA6OnRoaXMucmVzaXplRW5kZWQ7XG5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdidWlsZC5wYW5lbFZpc2liaWxpdHknLCA6OnRoaXMudmlzaWJsZUZyb21Db25maWcpO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2J1aWxkLnBhbmVsT3JpZW50YXRpb24nLCA6OnRoaXMub3JpZW50YXRpb25Gcm9tQ29uZmlnKTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdidWlsZC5oaWRlUGFuZWxIZWFkaW5nJywgKGhpZGUpID0+IHtcbiAgICAgIGhpZGUgJiYgdGhpcy5wYW5lbEhlYWRpbmcuaGlkZSgpIHx8IHRoaXMucGFuZWxIZWFkaW5nLnNob3coKTtcbiAgICB9KTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdidWlsZC5vdmVycmlkZVRoZW1lQ29sb3JzJywgKG92ZXJyaWRlKSA9PiB7XG4gICAgICB0aGlzLm91dHB1dC5yZW1vdmVDbGFzcygnb3ZlcnJpZGUtdGhlbWUnKTtcbiAgICAgIG92ZXJyaWRlICYmIHRoaXMub3V0cHV0LmFkZENsYXNzKCdvdmVycmlkZS10aGVtZScpO1xuICAgIH0pO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5mb250U2l6ZScsIDo6dGhpcy5mb250U2l6ZUZyb21Db25maWcpO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5mb250RmFtaWx5JywgOjp0aGlzLmZvbnRGYW1pbHlGcm9tQ29uZmlnKTtcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6dG9nZ2xlLXBhbmVsJywgOjp0aGlzLnRvZ2dsZSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveVRlcm1pbmFsKCk7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmRldGVjdFJlc2l6ZUludGVydmFsKTtcbiAgfVxuXG4gIHJlc2l6ZVN0YXJ0ZWQoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZVsnLXdlYmtpdC11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplTW92ZWQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUVuZGVkKTtcbiAgfVxuXG4gIHJlc2l6ZU1vdmVkKGV2KSB7XG4gICAgY29uc3QgeyBoIH0gPSB0aGlzLmZvbnRHZW9tZXRyeTtcblxuICAgIHN3aXRjaCAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5wYW5lbE9yaWVudGF0aW9uJykpIHtcbiAgICAgIGNhc2UgJ0JvdHRvbSc6IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnBhbmVsSGVhZGluZy5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gZXYueTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRlbHRhKSA8IChoICogNSAvIDYpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbmVhcmVzdFJvd0hlaWdodCA9IE1hdGgucm91bmQoKHRoaXMudGVybWluYWxFbC5oZWlnaHQoKSArIGRlbHRhKSAvIGgpICogaDtcbiAgICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gJCgnLml0ZW0tdmlld3MnKS5oZWlnaHQoKSArICQoJy5idWlsZCAub3V0cHV0JykuaGVpZ2h0KCk7XG4gICAgICAgIHRoaXMudGVybWluYWxFbC5jc3MoJ2hlaWdodCcsIGAke01hdGgubWluKG1heEhlaWdodCwgbmVhcmVzdFJvd0hlaWdodCl9cHhgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ1RvcCc6IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnJlc2l6ZXIuZ2V0KDApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGV2Lnk7XG4gICAgICAgIGlmIChNYXRoLmFicyhkZWx0YSkgPCAoaCAqIDUgLyA2KSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG5lYXJlc3RSb3dIZWlnaHQgPSBNYXRoLnJvdW5kKCh0aGlzLnRlcm1pbmFsRWwuaGVpZ2h0KCkgLSBkZWx0YSkgLyBoKSAqIGg7XG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9ICQoJy5pdGVtLXZpZXdzJykuaGVpZ2h0KCkgKyAkKCcuYnVpbGQgLm91dHB1dCcpLmhlaWdodCgpO1xuICAgICAgICB0aGlzLnRlcm1pbmFsRWwuY3NzKCdoZWlnaHQnLCBgJHtNYXRoLm1pbihtYXhIZWlnaHQsIG5lYXJlc3RSb3dIZWlnaHQpfXB4YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdMZWZ0Jzoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMucmVzaXplci5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQgLSBldi54O1xuICAgICAgICB0aGlzLmNzcygnd2lkdGgnLCBgJHt0aGlzLndpZHRoKCkgLSBkZWx0YSAtIHRoaXMucmVzaXplci5vdXRlcldpZHRoKCl9cHhgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ1JpZ2h0Jzoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMucmVzaXplci5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIGV2Lng7XG4gICAgICAgIHRoaXMuY3NzKCd3aWR0aCcsIGAke3RoaXMud2lkdGgoKSArIGRlbHRhfXB4YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVzaXplVGVybWluYWwoKTtcbiAgfVxuXG4gIHJlc2l6ZUVuZGVkKCkge1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGVbJy13ZWJraXQtdXNlci1zZWxlY3QnXSA9ICdhbGwnO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplTW92ZWQpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUVuZGVkKTtcbiAgfVxuXG4gIHJlc2l6ZVRvTmVhcmVzdFJvdygpIHtcbiAgICBpZiAoLTEgIT09IFsgJ0xlZnQnLCAnUmlnaHQnIF0uaW5kZXhPZihhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnBhbmVsT3JpZW50YXRpb24nKSkpIHtcbiAgICAgIHRoaXMucmVzaXplVGVybWluYWwoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgeyBoIH0gPSB0aGlzLmdldEZvbnRHZW9tZXRyeSgpO1xuICAgIGNvbnN0IG5lYXJlc3RSb3dIZWlnaHQgPSBNYXRoLnJvdW5kKHRoaXMudGVybWluYWxFbC5oZWlnaHQoKSAvIGgpICogaDtcbiAgICB0aGlzLnRlcm1pbmFsRWwuY3NzKCdoZWlnaHQnLCBgJHtuZWFyZXN0Um93SGVpZ2h0fXB4YCk7XG4gICAgdGhpcy5yZXNpemVUZXJtaW5hbCgpO1xuICB9XG5cbiAgZ2V0Rm9udEdlb21ldHJ5KCkge1xuICAgIGNvbnN0IG8gPSAkKCc8ZGl2PkE8L2Rpdj4nKVxuICAgICAgLmFkZENsYXNzKCd0ZXJtaW5hbCcpXG4gICAgICAuYWRkQ2xhc3MoJ3Rlcm1pbmFsLXRlc3QnKVxuICAgICAgLmFwcGVuZFRvKHRoaXMub3V0cHV0KTtcbiAgICBjb25zdCB3ID0gb1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICBjb25zdCBoID0gb1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgby5yZW1vdmUoKTtcbiAgICByZXR1cm4geyB3OiB3LCBoOiBofTtcbiAgfVxuXG4gIHJlc2l6ZVRlcm1pbmFsKCkge1xuICAgIHRoaXMuZm9udEdlb21ldHJ5ID0gdGhpcy5nZXRGb250R2VvbWV0cnkoKTtcbiAgICBjb25zdCB7IHcsIGggfSA9IHRoaXMuZm9udEdlb21ldHJ5O1xuICAgIGlmICgwID09PSB3IHx8IDAgPT09IGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXJtaW5hbFdpZHRoID0gTWF0aC5mbG9vcigodGhpcy50ZXJtaW5hbEVsLndpZHRoKCkpIC8gdyk7XG4gICAgY29uc3QgdGVybWluYWxIZWlnaHQgPSBNYXRoLmZsb29yKCh0aGlzLnRlcm1pbmFsRWwuaGVpZ2h0KCkpIC8gaCk7XG5cbiAgICB0aGlzLnRlcm1pbmFsLnJlc2l6ZSh0ZXJtaW5hbFdpZHRoLCB0ZXJtaW5hbEhlaWdodCk7XG4gIH1cblxuICBnZXRDb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLnRlcm1pbmFsLmdldENvbnRlbnQoKTtcbiAgfVxuXG4gIGF0dGFjaChmb3JjZSA9IGZhbHNlKSB7XG4gICAgaWYgKCFmb3JjZSkge1xuICAgICAgc3dpdGNoIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScpKSB7XG4gICAgICAgIGNhc2UgJ0hpZGRlbic6XG4gICAgICAgIGNhc2UgJ1Nob3cgb24gRXJyb3InOlxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgY29uc3QgYWRkZm4gPSB7XG4gICAgICBUb3A6IGF0b20ud29ya3NwYWNlLmFkZFRvcFBhbmVsLFxuICAgICAgQm90dG9tOiBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCxcbiAgICAgIExlZnQ6IGF0b20ud29ya3NwYWNlLmFkZExlZnRQYW5lbCxcbiAgICAgIFJpZ2h0OiBhdG9tLndvcmtzcGFjZS5hZGRSaWdodFBhbmVsXG4gICAgfTtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxPcmllbnRhdGlvbicpIHx8ICdCb3R0b20nO1xuICAgIHRoaXMucGFuZWwgPSBhZGRmbltvcmllbnRhdGlvbl0uY2FsbChhdG9tLndvcmtzcGFjZSwgeyBpdGVtOiB0aGlzIH0pO1xuICAgIHRoaXMucmVzaXplVG9OZWFyZXN0Um93KCk7XG4gIH1cblxuICBkZXRhY2goZm9yY2UpIHtcbiAgICBmb3JjZSA9IGZvcmNlIHx8IGZhbHNlO1xuICAgIGlmIChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXNbMF0pIHtcbiAgICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuZm9jdXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFuZWwgJiYgKGZvcmNlIHx8ICdLZWVwIFZpc2libGUnICE9PSBhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScpKSkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpc0F0dGFjaGVkKCkge1xuICAgIHJldHVybiAhIXRoaXMucGFuZWw7XG4gIH1cblxuICB2aXNpYmxlRnJvbUNvbmZpZyh2YWwpIHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgY2FzZSAnVG9nZ2xlJzpcbiAgICAgIGNhc2UgJ1Nob3cgb24gRXJyb3InOlxuICAgICAgICBpZiAoIXRoaXMudGVybWluYWxFbC5oYXNDbGFzcygnZXJyb3InKSkge1xuICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYXR0YWNoKCk7XG4gIH1cblxuICBvcmllbnRhdGlvbkZyb21Db25maWcob3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBpc1Zpc2libGUgPSB0aGlzLmlzVmlzaWJsZSgpO1xuICAgIHRoaXMuZGV0YWNoKHRydWUpO1xuICAgIGlmIChpc1Zpc2libGUpIHtcbiAgICAgIHRoaXMuYXR0YWNoKCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNpemVyLmdldCgwKS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLnJlc2l6ZVN0YXJ0ZWQpO1xuXG4gICAgc3dpdGNoIChvcmllbnRhdGlvbikge1xuICAgICAgY2FzZSAnVG9wJzpcbiAgICAgIGNhc2UgJ0JvdHRvbSc6XG4gICAgICAgIHRoaXMuZ2V0KDApLnN0eWxlLndpZHRoID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZXNpemVyLmdldCgwKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLnJlc2l6ZVN0YXJ0ZWQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnTGVmdCc6XG4gICAgICBjYXNlICdSaWdodCc6XG4gICAgICAgIHRoaXMudGVybWluYWxFbC5nZXQoMCkuc3R5bGUuaGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZXNpemVyLmdldCgwKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLnJlc2l6ZVN0YXJ0ZWQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLnJlc2l6ZVRlcm1pbmFsKCk7XG4gIH1cblxuICBmb250U2l6ZUZyb21Db25maWcoc2l6ZSkge1xuICAgIHRoaXMuY3NzKHsgJ2ZvbnQtc2l6ZSc6IHNpemUgfSk7XG4gICAgdGhpcy5yZXNpemVUb05lYXJlc3RSb3coKTtcbiAgfVxuXG4gIGZvbnRGYW1pbHlGcm9tQ29uZmlnKGZhbWlseSkge1xuICAgIHRoaXMuY3NzKHsgJ2ZvbnQtZmFtaWx5JzogZmFtaWx5IH0pO1xuICAgIHRoaXMucmVzaXplVG9OZWFyZXN0Um93KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aXRsZVRpbWVyKTtcbiAgICB0aGlzLmJ1aWxkVGltZXIudGV4dChCdWlsZFZpZXcuaW5pdGlhbFRpbWVyVGV4dCgpKTtcbiAgICB0aGlzLnRpdGxlVGltZXIgPSAwO1xuICAgIHRoaXMudGVybWluYWwucmVzZXQoKTtcblxuICAgIHRoaXMucGFuZWxIZWFkaW5nLnJlbW92ZUNsYXNzKCdzdWNjZXNzIGVycm9yJyk7XG4gICAgdGhpcy50aXRsZS5yZW1vdmVDbGFzcygnc3VjY2VzcyBlcnJvcicpO1xuXG4gICAgdGhpcy5kZXRhY2goKTtcbiAgfVxuXG4gIHVwZGF0ZVRpdGxlKCkge1xuICAgIHRoaXMuYnVpbGRUaW1lci50ZXh0KCgobmV3IERhdGUoKSAtIHRoaXMuc3RhcnR0aW1lKSAvIDEwMDApLnRvRml4ZWQoMSkgKyAnIHMnKTtcbiAgICB0aGlzLnRpdGxlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMudXBkYXRlVGl0bGUuYmluZCh0aGlzKSwgMTAwKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuZGV0YWNoKHRydWUpO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIHJlcXVpcmUoJy4vZ29vZ2xlLWFuYWx5dGljcycpLnNlbmRFdmVudCgndmlldycsICdwYW5lbCB0b2dnbGVkJyk7XG4gICAgdGhpcy5pc0F0dGFjaGVkKCkgPyB0aGlzLmRldGFjaCh0cnVlKSA6IHRoaXMuYXR0YWNoKHRydWUpO1xuICB9XG5cbiAgY2xlYXJPdXRwdXQoKSB7XG4gICAgdGhpcy50ZXJtaW5hbC5yZXNldCgpO1xuICB9XG5cbiAgYnVpbGQoKSB7XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnYnVpbGQ6dHJpZ2dlcicpO1xuICB9XG5cbiAgc2V0SGVhZGluZyhoZWFkaW5nKSB7XG4gICAgdGhpcy5oZWFkaW5nLnRleHQoaGVhZGluZyk7XG4gIH1cblxuICBidWlsZFN0YXJ0ZWQoKSB7XG4gICAgdGhpcy5zdGFydHRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLmF0dGFjaCgpO1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnN0ZWFsRm9jdXMnKSkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gIH1cblxuICBidWlsZEZpbmlzaGVkKHN1Y2Nlc3MpIHtcbiAgICBpZiAoIXN1Y2Nlc3MgJiYgIXRoaXMuaXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLmF0dGFjaChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScpID09PSAnU2hvdyBvbiBFcnJvcicpO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplQnVpbGQoc3VjY2Vzcyk7XG4gIH1cblxuICBidWlsZEFib3J0SW5pdGlhdGVkKCkge1xuICB9XG5cbiAgYnVpbGRBYm9ydGVkKCkge1xuICAgIHRoaXMuZmluYWxpemVCdWlsZChmYWxzZSk7XG4gIH1cblxuICBmaW5hbGl6ZUJ1aWxkKHN1Y2Nlc3MpIHtcbiAgICB0aGlzLnRpdGxlLmFkZENsYXNzKHN1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZXJyb3InKTtcbiAgICB0aGlzLnBhbmVsSGVhZGluZy5hZGRDbGFzcyhzdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJyk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGl0bGVUaW1lcik7XG4gIH1cblxuICBzY3JvbGxUbyh0ZXh0KSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpO1xuICAgIGxldCBlbmRQb3MgPSAtMTtcbiAgICBsZXQgY3VyUG9zID0gdGV4dC5sZW5ndGg7XG4gICAgLy8gV2UgbmVlZCB0byBkZWNyZXNlIHRoZSBzaXplIG9mIGB0ZXh0YCB1bnRpbCB3ZSBmaW5kIGEgbWF0Y2guIFRoaXMgaXMgYmVjYXVzZVxuICAgIC8vIHRlcm1pbmFsIHdpbGwgaW5zZXJ0IGxpbmUgYnJlYWtzICgnXFxyXFxuJykgd2hlbiB3aWR0aCBvZiB0ZXJtaW5hbCBpcyByZWFjaGVkLlxuICAgIC8vIEl0IG1heSBoYXZlIGJlZW4gdGhhdCB0aGUgbWlkZGxlIG9mIGEgbWF0Y2hlZCBlcnJvciBpcyBvbiBhIGxpbmUgYnJlYWsuXG4gICAgd2hpbGUgKC0xID09PSBlbmRQb3MgJiYgY3VyUG9zID4gMCkge1xuICAgICAgZW5kUG9zID0gY29udGVudC5pbmRleE9mKHRleHQuc3Vic3RyaW5nKDAsIGN1clBvcy0tKSk7XG4gICAgfVxuXG4gICAgaWYgKGN1clBvcyA9PT0gMCkge1xuICAgICAgLy8gTm8gbWF0Y2ggLSB3aGljaCBpcyB3ZWlyZC4gT2ggd2VsbCAtIHJhdGhlciBiZSBkZWZlbnNpdmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb3cgPSBjb250ZW50LnNsaWNlKDAsIGVuZFBvcykuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICB0aGlzLnRlcm1pbmFsLnlkaXNwID0gMDtcbiAgICB0aGlzLnRlcm1pbmFsLnNjcm9sbERpc3Aocm93IC0gMSk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build/lib/build-view.js
