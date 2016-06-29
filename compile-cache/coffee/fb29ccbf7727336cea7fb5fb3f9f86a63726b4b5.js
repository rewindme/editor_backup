(function() {
  var $, OmniboxView, ToolbarView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  OmniboxView = require('./omnibox-view');

  module.exports = ToolbarView = (function(_super) {
    __extends(ToolbarView, _super);

    function ToolbarView() {
      return ToolbarView.__super__.constructor.apply(this, arguments);
    }

    ToolbarView.content = function() {
      return this.div({
        "class": 'browser-toolbar',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            outlet: 'navBtnsLft',
            "class": 'nav-btns left'
          }, function() {
            _this.span({
              outlet: 'goLeft',
              "class": 'octicon browser-btn octicon-arrow-left'
            });
            _this.span({
              outlet: 'goRight',
              "class": 'octicon browser-btn octicon-arrow-right'
            });
            return _this.span({
              outlet: 'refresh',
              "class": 'octicon browser-btn octicon-sync'
            });
          });
          return _this.div({
            outlet: 'omniboxContainer',
            "class": 'omnibox-container'
          });
        };
      })(this));
    };

    ToolbarView.prototype.addTooltips = function() {
      var ex;
      try {
        atom.tooltips.add(this.toggleUI, {
          title: 'Hide URL / Navigation Bar'
        });
        atom.tooltips.add(this.goLeft, {
          title: 'Go Back'
        });
        atom.tooltips.add(this.goRight, {
          title: 'Go Forward'
        });
        return atom.tooltips.add(this.refresh, {
          title: 'Refresh'
        });
      } catch (_error) {
        ex = _error;
        return console.dir(ex);
      }
    };

    ToolbarView.prototype.initialize = function(browser) {
      this.browser = browser;
      if (!this.browser) {
        this.browser = atom.webBrowser;
      }
      window.currentToolbarView = this;
      atom.workspace.addTopPanel({
        item: this,
        visible: true
      });
      this.omniboxView = new OmniboxView(browser);
      this.omniboxContainer.append(this.omniboxView);
      this.favicon = this.omniboxView.favicon;
      this.addTooltips();
      this.setOmniText('');
      return this.on('click', (function(_this) {
        return function(e) {
          var btnIdx, classes;
          if ((classes = $(e.target).attr('class')) && (btnIdx = classes.indexOf('octicon-')) > -1) {
            switch (classes.slice(btnIdx + 8)) {
              case 'arrow-left':
                return _this.browser.back();
              case 'arrow-right':
                return _this.browser.forward();
              case 'sync':
                return _this.browser.refresh();
            }
          }
        };
      })(this));
    };

    ToolbarView.prototype.focus = function() {
      return this.omniboxView.focus();
    };

    ToolbarView.prototype.focused = function() {
      return this.isFocused;
    };

    ToolbarView.prototype.getOmniboxView = function() {
      return this.omniboxView;
    };

    ToolbarView.prototype.setOmniText = function(text) {
      this.omniboxView.setText(text);
      if (!text) {
        return this.setFaviconDomain('atom.io');
      }
    };

    ToolbarView.prototype.setFaviconDomain = function(domain) {
      return this.favicon.attr({
        src: "http://www.google.com/s2/favicons?domain=" + domain
      });
    };

    ToolbarView.prototype.destroy = function() {
      this.unsubscribe();
      return this.detach();
    };

    return ToolbarView;

  })(View);


  /*
    octicon-bookmark
    bug
    chevron-left
    chevron-right
    file-directory
    gear
    globe
    history
    pencil
    pin
    plus
    star
    heart
    sync
    x
   */

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2F0b20td2ViYnJvd3Nlci9saWIvdG9vbGJhci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQURkLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU0saUJBQU47QUFBQSxRQUF5QixRQUFBLEVBQVMsQ0FBQSxDQUFsQztPQUFMLEVBQTJDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxNQUFBLEVBQVEsWUFBUjtBQUFBLFlBQXNCLE9BQUEsRUFBTSxlQUE1QjtXQUFMLEVBQWtELFNBQUEsR0FBQTtBQUNoRCxZQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE1BQUEsRUFBTyxRQUFQO0FBQUEsY0FBaUIsT0FBQSxFQUFNLHdDQUF2QjthQUFOLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsTUFBQSxFQUFPLFNBQVA7QUFBQSxjQUFrQixPQUFBLEVBQU0seUNBQXhCO2FBQU4sQ0FEQSxDQUFBO21CQUVBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE1BQUEsRUFBTyxT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

//# sourceURL=/Users/naver/.atom/packages/atom-webbrowser/lib/toolbar-view.coffee
