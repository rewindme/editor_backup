(function() {
  var $, OmniboxView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  module.exports = OmniboxView = (function(_super) {
    __extends(OmniboxView, _super);

    function OmniboxView() {
      return OmniboxView.__super__.constructor.apply(this, arguments);
    }

    OmniboxView.content = function() {
      return this.div({
        "class": 'omnibox',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.img({
            outlet: 'favicon',
            "class": 'favicon'
          });
          return _this.input({
            outlet: 'input',
            placeholder: ' Enter URL',
            "class": 'native-key-bindings'
          });
        };
      })(this));
    };

    OmniboxView.prototype.initialize = function(browser) {
      this.browser = browser;
      if (!this.browser) {
        this.browser = atom.webBrowser;
      }
      this.browser.omnibox = this;
      this._setUrl = '';
      this.input.on('keydown', (function(_this) {
        return function(e) {
          var url;
          url = _this.input.val();
          if (!/^\w+:\/\//.test(url)) {
            url = 'http://' + url;
          }
          switch (e.which) {
            case 13:
              if (e.ctrlKey) {
                _this.browser.createPage(url);
                _this.input.blur();
              } else {
                _this.browser.setLocation(url);
                _this.input.blur();
              }
              break;
            case 9:
              _this.input.blur();
              break;
            case 27:
              _this.browser.getToolbar().destroy();
              break;
            default:
              return;
          }
          return false;
        };
      })(this));
      this.input.on('focus', (function(_this) {
        return function() {
          _this.focused = true;
          return typeof _this.focusCallback === "function" ? _this.focusCallback(true) : void 0;
        };
      })(this));
      return this.input.on('blur', (function(_this) {
        return function() {
          _this.focused = false;
          if (_this.input.val().length < 2 && _this._setUrl.length > 2) {
            _this.input.val(_this._setUrl);
          }
          return typeof _this.focusCallback === "function" ? _this.focusCallback(false) : void 0;
        };
      })(this));
    };

    OmniboxView.prototype.focus = function() {
      return this.input.focus();
    };

    OmniboxView.prototype.onFocusChg = function(focusCallback) {
      this.focusCallback = focusCallback;
    };

    OmniboxView.prototype.setUrl = function(url) {
      this._setUrl = url;
      if (!this.focused) {
        return this.input.val(url);
      }
    };

    OmniboxView.prototype.setText = function(text) {
      return this.input.val(text);
    };

    OmniboxView.prototype.destroy = function() {
      this.unsubscribe();
      return this.detach();
    };

    return OmniboxView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2F0b20td2ViYnJvd3Nlci9saWIvb21uaWJveC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsTUFBQSwwQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFNLFNBQU47QUFBQSxRQUFpQixRQUFBLEVBQVMsQ0FBQSxDQUExQjtPQUFMLEVBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDakMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxNQUFBLEVBQU8sU0FBUDtBQUFBLFlBQWtCLE9BQUEsRUFBTSxTQUF4QjtXQUFMLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsS0FBRCxDQUNFO0FBQUEsWUFBQSxNQUFBLEVBQVEsT0FBUjtBQUFBLFlBQ0EsV0FBQSxFQUFhLFlBRGI7QUFBQSxZQUVBLE9BQUEsRUFBTyxxQkFGUDtXQURGLEVBRmlDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwwQkFRQSxVQUFBLEdBQVksU0FBRSxPQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxVQUFBLE9BQ1osQ0FBQTtBQUFBLE1BQUEsSUFBRyxDQUFBLElBQUssQ0FBQSxPQUFSO0FBQXFCLFFBQUEsSUFBQyxD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

//# sourceURL=/Users/naver/.atom/packages/atom-webbrowser/lib/omnibox-view.coffee
