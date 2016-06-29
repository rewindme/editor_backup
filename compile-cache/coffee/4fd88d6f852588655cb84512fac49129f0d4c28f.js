(function() {
  var $, PageView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  module.exports = PageView = (function(_super) {
    __extends(PageView, _super);

    function PageView() {
      return PageView.__super__.constructor.apply(this, arguments);
    }

    PageView.content = function() {
      return this.div({
        "class": 'browser-page',
        tabindex: -1
      });
    };

    PageView.prototype.initialize = function(page) {
      var url;
      page.setView(this);
      this.localPage = page;
      url = page.url;
      this.browser = page.getBrowser();
      this.page = page;
      this.webview = atom.webRenderFrames.createFrame(this);
      page.webview = this.webview;
      this.webview[0].src = url;
      console.log('created webview');
      window.cur_page_view_frame = this;
      return this.webview.on('did-finish-load', (function(_this) {
        return function() {
          var title;
          url = _this.getUrl();
          title = _this.getTitle();
          _this.page.setTitle(title);
          _this.localPage.locationChanged(url);
          _this.localPage.setTitle(title);
          if (_this.browser.omnibox) {
            return _this.browser.omnibox.setUrl(url);
          }
        };
      })(this));
    };

    PageView.prototype.getTitle = function() {
      var webview;
      webview = this.getWebview();
      if (webview.getTitle) {
        return webview.getTitle();
      }
    };

    PageView.prototype.getUrl = function() {
      var webview;
      if (!this.webview || !this.webview[0]) {
        return '';
      }
      webview = this.webview[0];
      if (webview.getUrl) {
        return this.getWebview().getUrl();
      }
    };

    PageView.prototype.setLocation = function(url) {
      if (this.webview) {
        return this.webview.attr({
          src: url
        });
      }
    };

    PageView.prototype.getWebview = function() {
      return this.webview[0];
    };

    PageView.prototype.goBack = function() {
      if (this.webview) {
        return this.webview[0].goBack();
      }
    };

    PageView.prototype.goForward = function() {
      if (this.webview) {
        return this.webview[0].goForward();
      }
    };

    PageView.prototype.goVisible = function() {
      this.css('visibility', 'visible');
      $(this.webview).css('visibility', 'visible');
      return $(this.webview).parent().removeClass('holder-hidden');
    };

    PageView.prototype.goInvisible = function() {
      this.css('visibility', 'hidden');
      $(this.webview).parent().addClass('holder-hidden');
      return $(this.webview).css('visibility', 'hidden');
    };

    PageView.prototype.reload = function() {
      if (this.webview) {
        console.log('reloading webview');
        return this.webview.reload();
      }
    };

    PageView.prototype.destroy = function() {
      clearInterval(this.urlInterval);
      console.log('destroyed webview');
      return $(this.webview).parent().remove();
    };

    return PageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2F0b20td2ViYnJvd3Nlci9saWIvcGFnZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBQUEsTUFBQSx1QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFNLGNBQU47QUFBQSxRQUFzQixRQUFBLEVBQVMsQ0FBQSxDQUEvQjtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsdUJBR0EsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsVUFBQSxHQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBRGIsQ0FBQTtBQUFBLE1BRUEsR0FBQSxHQUFNLElBQUksQ0FBQyxHQUZYLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUpmLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFMUixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBckIsQ0FBaUMsSUFBakMsQ0FQWCxDQUFBO0FBQUEsTUFRQSxJQUFJLENBQUMsT0FBTCxHQUFlLElBQUMsQ0FBQSxPQVJoQixDQUFBO0FBQUEsTUFTQSxJQUFD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

//# sourceURL=/Users/naver/.atom/packages/atom-webbrowser/lib/page-view.coffee
