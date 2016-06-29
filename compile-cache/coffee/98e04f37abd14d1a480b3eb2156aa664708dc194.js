(function() {
  var $, CompositeDisposable, Emitter, Model, Page, PageView, View, urlUtil, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('theorist').Model;

  PageView = require('./page-view');

  urlUtil = require('url');

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Emitter = _ref1.Emitter;

  module.exports = Page = (function(_super) {
    __extends(Page, _super);

    function Page(browser, url) {
      this.browser = browser;
      this.url = url;
      console.log('browser page created');
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
      atom.webBrowser.page = this;
    }

    Page.prototype.setTitle = function(title) {
      this.title = title;
      if (this.tabView) {
        return this.tabView.find('.title').text(this.title);
      }
    };

    Page.prototype.getTitle = function() {
      if (this.pageView && this.pageView.getTitle) {
        return this.pageView.getTitle();
      }
      return 'Loading..';
    };

    Page.prototype.getLongTitle = function() {
      return this.getTitle();
    };

    Page.prototype.back = function() {
      return this.pageView.goBack();
    };

    Page.prototype.forward = function() {
      return this.pageView.goForward();
    };

    Page.prototype.refresh = function() {
      return this.pageView.reload();
    };

    Page.prototype.goVisible = function() {
      if (this.pageView) {
        return this.pageView.goVisible();
      }
    };

    Page.prototype.goInvisible = function() {
      if (this.pageView) {
        return this.pageView.goInvisible();
      }
    };

    Page.prototype.setLocation = function(url) {
      this.url = url;
      return this.pageView.setLocation(this.url);
    };

    Page.prototype.locationChanged = function(url) {
      this.url = url;
      return this.update();
    };

    Page.prototype.createTab = function() {
      var $tabView, tabBarView, tabView;
      tabBarView = atom.workspaceView.find('.pane.active').find('.tab-bar').view();
      tabView = tabBarView.tabForItem(this);
      $tabView = $(tabView);
      this.url = this.getPath();
      this.$tabFavicon = $('<img class="tab-favicon">');
      $tabView.append(this.$tabFavicon);
      $tabView.find('.title').css({
        paddingLeft: 20
      });
      return this.tabView = $tabView;
    };

    Page.prototype.update = function() {
      var faviconDomain;
      this.browser.setOmniText(this.url);
      faviconDomain = urlUtil.parse(this.url).hostname;
      this.setFaviconDomain(faviconDomain);
      this.browser.setFaviconDomain(faviconDomain);
      if (this.pageView && this.pageView.getTitle) {
        this.setTitle(this.getTitle());
        return this.emitter.emit('did-change-title', this.getTitle());
      }
    };

    Page.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    Page.prototype.setFaviconDomain = function(domain) {};

    Page.prototype.setView = function(pageView, webView) {
      this.pageView = pageView;
      this.webView = webView;
    };

    Page.prototype.getBrowser = function() {
      return this.browser;
    };

    Page.prototype.getClass = function() {
      return Page;
    };

    Page.prototype.getViewClass = function() {
      return PageView;
    };

    Page.prototype.getView = function() {
      return this.pageView;
    };

    Page.prototype.getPath = function() {
      return this.url;
    };

    Page.prototype.getWebview = function() {
      var _ref2;
      return (_ref2 = this.pageView) != null ? _ref2.getWebview() : void 0;
    };

    Page.prototype.goForward = function() {
      var _ref2;
      return (_ref2 = this.pageView) != null ? _ref2.goForward() : void 0;
    };

    Page.prototype.goBack = function() {
      var _ref2;
      return (_ref2 = this.pageView) != null ? _ref2.goBack() : void 0;
    };

    Page.prototype.reload = function() {
      var _ref2;
      return (_ref2 = this.pageView) != null ? _ref2.reload() : void 0;
    };

    Page.prototype.serialize = function() {
      return {};
    };

    Page.prototype.detach = function() {
      return console.log('detaching tab page');
    };

    Page.prototype.destroy = function() {
      var index;
      this.pageView.destroy();
      this.pageView = null;
      index = atom.webBrowser.pages.indexOf(this);
      return atom.webBrowser.pages.splice(index, 1);
    };

    return Page;

  })(Model);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2F0b20td2ViYnJvd3Nlci9saWIvcGFnZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLE1BQUEsa0ZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLFVBQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FEWixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFZLE9BQUEsQ0FBUSxLQUFSLENBRlosQ0FBQTs7QUFBQSxFQUdBLE9BQWEsT0FBQSxDQUFRLHNCQUFSLENBQWIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBSEosQ0FBQTs7QUFBQSxFQUlBLFFBQWlDLE9BQUEsQ0FBUSxXQUFSLENBQWpDLEVBQUMsNEJBQUEsbUJBQUQsRUFBc0IsZ0JBQUEsT0FKdEIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSiwyQkFBQSxDQUFBOztBQUFhLElBQUEsY0FBRSxPQUFGLEVBQVksR0FBWixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQURzQixJQUFDLENBQUEsTUFBQSxHQUN2QixDQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHNCQUFaLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFGZixDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQWhCLEdBQXVCLElBSHZCLENBRFc7SUFBQSxDQUFiOztBQUFBLG1CQU1BLFFBQUEsR0FBVSxTQUFFLEtBQUYsR0FBQTtBQUFZLE1BQVgs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

//# sourceURL=/Users/naver/.atom/packages/atom-webbrowser/lib/page.coffee
