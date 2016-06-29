(function() {
  var $, Page, Toolbar, View, WebBrowser, _ref;

  Toolbar = require('./toolbar');

  Page = require('./page');

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  require('./render-frames');

  WebBrowser = (function() {
    function WebBrowser() {}

    WebBrowser.prototype.config = {
      homepage: {
        type: 'string',
        "default": "http://github.com/"
      },
      autoReloadCache: {
        type: 'boolean',
        "default": false
      },
      autoReopen: {
        type: 'boolean',
        "default": true
      }
    };

    WebBrowser.prototype.activate = function(state) {
      this.state = state;
      atom.webBrowser = this;
      this.pages = [];
      setInterval(this.fixPages.bind(this, 250));
      atom.commands.add('atom-workspace', {
        'web-browser:toggle': (function(_this) {
          return function(event) {
            if (_this.toolbar == null) {
              _this.toolbar = new Toolbar(_this);
            }
            if (!_this.toolbar.visible()) {
              _this.toolbar.show().focus();
            } else {
              _this.toolbar.hide();
            }
            if (!_this.toolbar.focused()) {
              return _this.toolbar.focus();
            }
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'web-browser:newtab': (function(_this) {
          return function(event) {
            if (_this.toolbar == null) {
              _this.toolbar = new Toolbar(_this);
            }
            if (!_this.toolbar.visible()) {
              _this.toolbar.show().focus();
            }
            return atom.workspace.open(_this.config.homepage["default"]);
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'web-browser:newtab-showui': (function(_this) {
          return function(event) {
            return _this.newTabShowUI();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'web-browser:devtools': (function(_this) {
          return function(event) {
            var webview, _ref1;
            webview = (_ref1 = atom.webBrowser.getActivePage()) != null ? _ref1.getWebview() : void 0;
            return webview != null ? webview.openDevTools() : void 0;
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'web-browser:go-back': (function(_this) {
          return function(event) {
            return _this.back();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'web-browser:go-forward': (function(_this) {
          return function(event) {
            return _this.forward();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'web-browser:reload': (function(_this) {
          return function(event) {
            return _this.reload();
          };
        })(this)
      });
      atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          var p;
          p = _this.getActivePage();
          if (p) {
            if (_this.lastPage) {
              _this.lastPage.goInvisible();
            }
            _this.page.goVisible();
          } else {
            _this.hideAll();
          }
          return _this.fixPages();
        };
      })(this));
      this.addFileMenuItem();
      this.opener = (function(_this) {
        return function(filePath, options) {
          var p;
          if (/^https?:\/\//.test(filePath)) {
            p = new Page(_this, filePath);
            _this.pages.push(p);
            setTimeout((function() {
              return atom.webRenderFrames.repositionFrames();
            }), 200);
            return p;
          }
        };
      })(this);
      atom.workspace.addOpener(this.opener);
      return setTimeout(this.reopen.bind(this, 3000));
    };

    WebBrowser.prototype.getToolbar = function() {
      return this.toolbar;
    };

    WebBrowser.prototype.getOmniboxView = function() {
      var _ref1;
      return (_ref1 = this.toolbar) != null ? _ref1.getOmniboxView() : void 0;
    };

    WebBrowser.prototype.setOmniText = function(text) {
      var _ref1;
      return (_ref1 = this.toolbar) != null ? _ref1.setOmniText(text) : void 0;
    };

    WebBrowser.prototype.setFaviconDomain = function(domain) {
      var _ref1;
      return (_ref1 = this.toolbar) != null ? _ref1.setFaviconDomain(domain) : void 0;
    };

    WebBrowser.prototype.addFileMenuItem = function() {
      var menu;
      menu = atom.menu.template[0];
      menu.submenu.splice(2, 0, {
        label: 'New Tab (Browser)',
        command: 'web-browser:newtab-showui'
      });
      atom.menu.template[0] = menu;
      console.dir(menu);
      return atom.menu.update();
    };

    WebBrowser.prototype.reopen = function() {
      var ex, should_run, url, _i, _len, _ref1, _results;
      should_run = this.config.autoReopen["default"];
      if (!should_run) {
        return;
      }
      if (this.state.urls && this.state.urls.length) {
        _ref1 = this.state.urls;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          url = _ref1[_i];
          try {
            _results.push(this.createPage(url));
          } catch (_error) {
            ex = _error;
            console.log('exception starting webpage: ');
            _results.push(console.dir(ex));
          }
        }
        return _results;
      }
    };

    WebBrowser.prototype.openURL = function(uri, toolbar) {
      if (toolbar == null) {
        toolbar = false;
      }
      if (toolbar) {
        if (this.toolbar == null) {
          this.toolbar = new Toolbar(this);
        }
        this.toolbar.show().focus();
      }
      return this.createPage(uri);
    };

    WebBrowser.prototype.newTabShowUI = function() {
      if (this.toolbar == null) {
        this.toolbar = new Toolbar(this);
      }
      this.toolbar.show().focus();
      return atom.workspace.open(this.config.homepage["default"]);
    };

    WebBrowser.prototype.hideAll = function() {
      var page, _i, _len, _ref1, _results;
      _ref1 = this.pages;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        page = _ref1[_i];
        _results.push(page.goInvisible());
      }
      return _results;
    };

    WebBrowser.prototype.fixPages = function() {
      if (this.pages.length === 0) {
        return;
      }
      return atom.webRenderFrames.repositionFrames();
    };

    WebBrowser.prototype.destroyToolbar = function() {
      this.toolbar.destroy();
      return this.toolbar = null;
    };

    WebBrowser.prototype.createPage = function(url) {
      if (this.toolbar == null) {
        this.toolbar = new Toolbar(this);
      }
      return atom.workspace.open(this.config.homepage["default"]);
    };

    WebBrowser.prototype.setLocation = function(url) {
      var page;
      if (this.toolbar == null) {
        this.toolbar = new Toolbar(this);
      }
      this.toolbar.setOmniText(url);
      page = this.getActivePage();
      if (page) {
        return page != null ? page.setLocation(url) : void 0;
      } else {
        return this.createPage(url);
      }
    };

    WebBrowser.prototype.getActivePage = function() {
      var page;
      page = atom.workspace.getActivePaneItem();
      if (page instanceof Page) {
        if (this.lastPage !== page) {
          this.lastPage = this.page;
        }
        this.page = page;
        return page;
      } else {
        return false;
      }
    };

    WebBrowser.prototype.getWebView = function() {
      var page;
      page = this.getActivePage();
      if (page) {
        return page.webview[0];
      }
    };

    WebBrowser.prototype.serialize = function() {
      var page, urls, _i, _len, _ref1;
      urls = [];
      if (this.pages.length !== 0) {
        _ref1 = this.pages;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          page = _ref1[_i];
          urls.push(page.url);
        }
      }
      return {
        urls: urls
      };
    };

    WebBrowser.prototype.back = function() {
      var webview, _ref1, _ref2;
      if (!atom.webBrowser.getActivePage()) {
        return;
      }
      webview = (_ref1 = atom.webBrowser.getActivePage()) != null ? _ref1.getWebview() : void 0;
      if (!webview) {
        return;
      }
      return (_ref2 = this.getActivePage()) != null ? _ref2.goBack() : void 0;
    };

    WebBrowser.prototype.forward = function() {
      var webview, _ref1, _ref2;
      if (!atom.webBrowser.getActivePage()) {
        return;
      }
      webview = (_ref1 = atom.webBrowser.getActivePage()) != null ? _ref1.getWebview() : void 0;
      if (!webview) {
        return;
      }
      return (_ref2 = this.getActivePage()) != null ? _ref2.goForward() : void 0;
    };

    WebBrowser.prototype.refresh = function() {
      var webview, _ref1, _ref2;
      if (!atom.webBrowser.getActivePage()) {
        return;
      }
      webview = (_ref1 = atom.webBrowser.getActivePage()) != null ? _ref1.getWebview() : void 0;
      if (!webview) {
        return;
      }
      if (this.config.autoReloadCache) {
        return webview.reloadIgnoringCache();
      } else {
        return (_ref2 = this.getActivePage()) != null ? _ref2.reload() : void 0;
      }
    };

    return WebBrowser;

  })();

  module.exports = new WebBrowser;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2F0b20td2ViYnJvd3Nlci9saWIvd2ViLWJyb3dzZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxNQUFBLHdDQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBVSxPQUFBLENBQVEsUUFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUZKLENBQUE7O0FBQUEsRUFLQSxPQUFBLENBQVEsaUJBQVIsQ0FMQSxDQUFBOztBQUFBLEVBT007NEJBRUo7O0FBQUEseUJBQUEsTUFBQSxHQUNFO0FBQUEsTUFBQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsb0JBRFQ7T0FERjtBQUFBLE1BR0EsZUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FKRjtBQUFBLE1BTUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FQRjtLQURGLENBQUE7O0FBQUEseUJBV0EsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBQVQsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLFVBQUwsR0FBa0IsSUFGbEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUhULENBQUE7QUFBQSxNQUtBLFdBQUEsQ0FBWSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQWtCLEdBQWxCLENBQVosQ0FMQSxDQUFBO0FBQUEsTUFPQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7O2NBQ3BCLEtBQUMsQ0FBQSxVQUFlLElBQUEsT0FBQSxDQUFRLEtBQVI7YUFBaEI7QUFDQSxZQUFBLElBQUcsQ0FBQSxLQUFLLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxDQUFQO0FBQ0UsY0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQSxDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUFBLENBREY7YUFBQSxNQUFBO0FBR0UsY0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQSxDQUFBLENBSEY7YUFEQTtBQU1BLFlBQUEsSUFBRyxDQUFBLEtBQUssQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBLENBQVA7cUJBQ0UsS0FBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQUEsRUFERjthQVBvQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO09BREYsQ0FQQSxDQUFBO0FBQUEsTUFtQkEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSxvQkFBQSxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBOztjQUNwQixLQUFDLENBQUEsVUFBZSxJQUFBLE9BQUEsQ0FBUSxLQUFSO2FBQWhCO0FBQ0EsWUFBQSxJQUFHLENBQUEsS0FBSyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUEsQ0FBUDtBQUErQixjQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFBLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBQUEsQ0FBL0I7YUFEQTttQkFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsS0FBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBRCxDQUFwQyxFQUhvQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO09BREYsQ0FuQkEsQ0FBQTtBQUFBLE1BeUJBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsMkJBQUEsRUFBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTttQkFDM0IsS0FBQyxDQUFBLFlBQUQsQ0FBQSxFQUQyQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO09BREYsQ0F6QkEsQ0FBQTtBQUFBLE1BNkJBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsc0JBQUEsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTtBQUN0QixnQkFBQSxjQUFBO0FBQUEsWUFBQSxPQUFBLDREQUF5QyxDQUFFLFVBQWpDLENBQUEsVUFBVixDQUFBO3FDQUNBLE9BQU8sQ0FBRSxZQUFULENBQUEsV0FGc0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtPQURGLENBN0JBLENBQUE7QUFBQSxNQWtDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLHFCQUFBLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7bUJBQ3JCLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFEcUI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QjtPQURGLENBbENBLENBQUE7QUFBQSxNQXNDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLHdCQUFBLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7bUJBQ3hCLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFEd0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQjtPQURGLENBdENBLENBQUE7QUFBQSxNQTBDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7bUJBQ3BCLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFEb0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QjtPQURGLENBMUNBLENBQUE7QUFBQSxNQStDQSxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkMsY0FBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUksS0FBQyxDQUFBLGFBQUQsQ0FBQSxDQUFKLENBQUE7QUFDQSxVQUFBLElBQUcsQ0FBSDtBQUNFLFlBQUEsSUFBRyxLQUFDLENBQUEsUUFBSjtBQUFrQixjQUFBLEtBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFBLENBQUEsQ0FBbEI7YUFBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUEsQ0FEQSxDQURGO1dBQUEsTUFBQTtBQUlFLFlBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBQSxDQUFBLENBSkY7V0FEQTtpQkFNQSxLQUFDLENBQUEsUUFBRCxDQUFBLEVBUHVDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0EvQ0EsQ0FBQTtBQUFBLE1BeURBLElBQUMsQ0FBQSxlQUFELENBQUEsQ0F6REEsQ0FBQTtBQUFBLE1BNERBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxFQUFXLE9BQVgsR0FBQTtBQUNSLGNBQUEsQ0FBQTtBQUFBLFVBQUEsSUFBRyxjQUFjLENBQUMsSUFBZixDQUFvQixRQUFwQixDQUFIO0FBQ0UsWUFBQSxDQUFBLEdBQVEsSUFBQSxJQUFBLENBQUssS0FBTCxFQUFRLFFBQVIsQ0FBUixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxDQUFaLENBREEsQ0FBQTtBQUFBLFlBRUEsVUFBQSxDQUFXLENBQUUsU0FBQSxHQUFBO3FCQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQXJCLENBQUEsRUFBSDtZQUFBLENBQUYsQ0FBWCxFQUEyRCxHQUEzRCxDQUZBLENBQUE7QUFHQSxtQkFBTyxDQUFQLENBSkY7V0FEUTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBNURWLENBQUE7QUFBQSxNQW1FQSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsSUFBQyxDQUFBLE1BQTFCLENBbkVBLENBQUE7YUFzRUEsVUFBQSxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLElBQWIsRUFBZ0IsSUFBaEIsQ0FBWCxFQXZFUTtJQUFBLENBWFYsQ0FBQTs7QUFBQSx5QkFvRkEsVUFBQSxHQUEyQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsUUFBSjtJQUFBLENBcEYzQixDQUFBOztBQUFBLHlCQXFGQSxjQUFBLEdBQTJCLFNBQUEsR0FBQTtBQUFHLFVBQUEsS0FBQTttREFBUSxDQUFFLGNBQVYsQ0FBQSxXQUFIO0lBQUEsQ0FyRjNCLENBQUE7O0FBQUEseUJBc0ZBLFdBQUEsR0FBb0IsU0FBQyxJQUFELEdBQUE7QUFBVSxVQUFBLEtBQUE7bURBQVEsQ0FBRSxXQUFWLENBQXNCLElBQXRCLFdBQVY7SUFBQSxDQXRGcEIsQ0FBQTs7QUFBQSx5QkF1RkEsZ0JBQUEsR0FBa0IsU0FBQyxNQUFELEdBQUE7QUFBWSxVQUFBLEtBQUE7bURBQVEsQ0FBRSxnQkFBVixDQUEyQixNQUEzQixXQUFaO0lBQUEsQ0F2RmxCLENBQUE7O0FBQUEseUJBMEZBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUExQixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsRUFBMEI7QUFBQSxRQUFFLEtBQUEsRUFBTyxtQkFBVDtBQUFBLFFBQThCLE9BQUEsRUFBUywyQkFBdkM7T0FBMUIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQW5CLEdBQXdCLElBRnhCLENBQUE7QUFBQSxNQUdBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWixDQUhBLENBQUE7YUFJQSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQVYsQ0FBQSxFQUxlO0lBQUEsQ0ExRmpCLENBQUE7O0FBQUEseUJBaUdBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLDhDQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBRCxDQUEvQixDQUFBO0FBQ0EsTUFBQSxJQUFHLENBQUEsVUFBSDtBQUF1QixjQUFBLENBQXZCO09BREE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLElBQWdCLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQS9CO0FBQ0U7QUFBQTthQUFBLDRDQUFBOzBCQUFBO0FBQ0U7QUFDRSwwQkFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLEdBQVosRUFBQSxDQURGO1dBQUEsY0FBQTtBQUdFLFlBREksV0FDSixDQUFBO0FBQUEsWUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDhCQUFaLENBQUEsQ0FBQTtBQUFBLDBCQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksRUFBWixFQURBLENBSEY7V0FERjtBQUFBO3dCQURGO09BSk07SUFBQSxDQWpHUixDQUFBOztBQUFBLHlCQTZHQSxPQUFBLEdBQVMsU0FBQyxHQUFELEVBQU0sT0FBTixHQUFBOztRQUFNLFVBQVE7T0FDckI7QUFBQSxNQUFBLElBQUcsT0FBSDs7VUFDRSxJQUFDLENBQUEsVUFBZSxJQUFBLE9BQUEsQ0FBUSxJQUFSO1NBQWhCO0FBQUEsUUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQSxDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQURBLENBREY7T0FBQTthQUdBLElBQUMsQ0FBQSxVQUFELENBQVksR0FBWixFQUpPO0lBQUEsQ0E3R1QsQ0FBQTs7QUFBQSx5QkFtSEEsWUFBQSxHQUFjLFNBQUEsR0FBQTs7UUFDWixJQUFDLENBQUEsVUFBZSxJQUFBLE9BQUEsQ0FBUSxJQUFSO09BQWhCO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQSxDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBRCxDQUFwQyxFQUhZO0lBQUEsQ0FuSGQsQ0FBQTs7QUFBQSx5QkF3SEEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsK0JBQUE7QUFBQTtBQUFBO1dBQUEsNENBQUE7eUJBQUE7QUFDRSxzQkFBQSxJQUFJLENBQUMsV0FBTCxDQUFBLEVBQUEsQ0FERjtBQUFBO3NCQURPO0lBQUEsQ0F4SFQsQ0FBQTs7QUFBQSx5QkE0SEEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsS0FBaUIsQ0FBcEI7QUFBMkIsY0FBQSxDQUEzQjtPQUFBO2FBQ0EsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBckIsQ0FBQSxFQUZRO0lBQUEsQ0E1SFYsQ0FBQTs7QUFBQSx5QkFnSUEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FGRztJQUFBLENBaEloQixDQUFBOztBQUFBLHlCQW9JQSxVQUFBLEdBQVksU0FBQyxHQUFELEdBQUE7O1FBQ1YsSUFBQyxDQUFBLFVBQWUsSUFBQSxPQUFBLENBQVEsSUFBUjtPQUFoQjthQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFELENBQXBDLEVBRlU7SUFBQSxDQXBJWixDQUFBOztBQUFBLHlCQXdJQSxXQUFBLEdBQWEsU0FBQyxHQUFELEdBQUE7QUFDWCxVQUFBLElBQUE7O1FBQUEsSUFBQyxDQUFBLFVBQWUsSUFBQSxPQUFBLENBQVEsSUFBUjtPQUFoQjtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FGUCxDQUFBO0FBR0EsTUFBQSxJQUFHLElBQUg7OEJBQWEsSUFBSSxDQUFFLFdBQU4sQ0FBa0IsR0FBbEIsV0FBYjtPQUFBLE1BQUE7ZUFDSyxJQUFDLENBQUEsVUFBRCxDQUFZLEdBQVosRUFETDtPQUpXO0lBQUEsQ0F4SWIsQ0FBQTs7QUFBQSx5QkFnSkEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFQLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBQSxZQUFnQixJQUFuQjtBQUNFLFFBQUEsSUFBRyxJQUFDLENBQUEsUUFBRCxLQUFhLElBQWhCO0FBQTBCLFVBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsSUFBYixDQUExQjtTQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBRFIsQ0FBQTtlQUVBLEtBSEY7T0FBQSxNQUFBO2VBS0UsTUFMRjtPQUZhO0lBQUEsQ0FoSmYsQ0FBQTs7QUFBQSx5QkF5SkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBUCxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUg7QUFBYSxlQUFPLElBQUksQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFwQixDQUFiO09BRlU7SUFBQSxDQXpKWixDQUFBOztBQUFBLHlCQTZKQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSwyQkFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEVBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsS0FBaUIsQ0FBcEI7QUFDRTtBQUFBLGFBQUEsNENBQUE7MkJBQUE7QUFDRSxVQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLEdBQWYsQ0FBQSxDQURGO0FBQUEsU0FERjtPQURBO2FBSUE7QUFBQSxRQUFFLElBQUEsRUFBTSxJQUFSO1FBTFM7SUFBQSxDQTdKWCxDQUFBOztBQUFBLHlCQXFLQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSxxQkFBQTtBQUFBLE1BQUEsSUFBRyxDQUFBLElBQVEsQ0FBQyxVQUFVLENBQUMsYUFBaEIsQ0FBQSxDQUFQO0FBQTRDLGNBQUEsQ0FBNUM7T0FBQTtBQUFBLE1BQ0EsT0FBQSw0REFBeUMsQ0FBRSxVQUFqQyxDQUFBLFVBRFYsQ0FBQTtBQUVBLE1BQUEsSUFBRyxDQUFBLE9BQUg7QUFBb0IsY0FBQSxDQUFwQjtPQUZBOzJEQUlnQixDQUFFLE1BQWxCLENBQUEsV0FMSTtJQUFBLENBcktOLENBQUE7O0FBQUEseUJBMktBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLHFCQUFBO0FBQUEsTUFBQSxJQUFHLENBQUEsSUFBUSxDQUFDLFVBQVUsQ0FBQyxhQUFoQixDQUFBLENBQVA7QUFBNEMsY0FBQSxDQUE1QztPQUFBO0FBQUEsTUFDQSxPQUFBLDREQUF5QyxDQUFFLFVBQWpDLENBQUEsVUFEVixDQUFBO0FBRUEsTUFBQSxJQUFHLENBQUEsT0FBSDtBQUFvQixjQUFBLENBQXBCO09BRkE7MkRBSWdCLENBQUUsU0FBbEIsQ0FBQSxXQUxPO0lBQUEsQ0EzS1QsQ0FBQTs7QUFBQSx5QkFpTEEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEscUJBQUE7QUFBQSxNQUFBLElBQUcsQ0FBQSxJQUFRLENBQUMsVUFBVSxDQUFDLGFBQWhCLENBQUEsQ0FBUDtBQUE0QyxjQUFBLENBQTVDO09BQUE7QUFBQSxNQUNBLE9BQUEsNERBQXlDLENBQUUsVUFBakMsQ0FBQSxVQURWLENBQUE7QUFFQSxNQUFBLElBQUcsQ0FBQSxPQUFIO0FBQW9CLGNBQUEsQ0FBcEI7T0FGQTtBQUlBLE1BQUEsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLGVBQVg7ZUFDRSxPQUFPLENBQUMsbUJBQVIsQ0FBQSxFQURGO09BQUEsTUFBQTs2REFHa0IsQ0FBRSxNQUFsQixDQUFBLFdBSEY7T0FMTztJQUFBLENBakxULENBQUE7O3NCQUFBOztNQVRGLENBQUE7O0FBQUEsRUFvTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsR0FBQSxDQUFBLFVBcE1qQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/atom-webbrowser/lib/web-browser.coffee
