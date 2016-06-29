(function() {
  var $, CompositeDisposable, Emitter, TabButton, TabManager, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), View = _ref.View, $ = _ref.$;

  _ref1 = require('atom'), Emitter = _ref1.Emitter, CompositeDisposable = _ref1.CompositeDisposable;

  TabButton = require('./tab-button');

  TabManager = (function(_super) {
    __extends(TabManager, _super);

    function TabManager() {
      this.deleteClicked = __bind(this.deleteClicked, this);
      return TabManager.__super__.constructor.apply(this, arguments);
    }

    TabManager.content = function() {
      return this.div({
        "class": 'tab-manager'
      }, (function(_this) {
        return function() {
          return _this.div({
            outlet: 'tabContainer',
            "class": 'tab-container'
          });
        };
      })(this));
    };

    TabManager.prototype.initialize = function() {
      this.tabs = [];
      this.subscriptions = new CompositeDisposable();
      this.emitter = new Emitter();
      return this.currTab = null;
    };

    TabManager.prototype.getCurrentTabTitle = function() {
      var _ref2, _ref3;
      return (_ref2 = (_ref3 = this.currTab) != null ? _ref3.title : void 0) != null ? _ref2 : "";
    };

    TabManager.prototype.addTab = function(config) {
      var tab;
      tab = new TabButton(config);
      this.tabContainer.append(tab);
      this.tabs.push(tab);
      if (this.tabs.length === 1) {
        this.hide();
      } else {
        this.show();
      }
      return this.subscriptions.add(tab.onDidClick((function(_this) {
        return function(id) {
          return _this.emitter.emit('tab:clicked', id);
        };
      })(this)));
    };

    TabManager.prototype.deleteTab = function(id) {
      var matchedTab, matchedTabs, tab;
      matchedTabs = (function() {
        var _i, _len, _ref2, _results;
        _ref2 = this.tabs;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          tab = _ref2[_i];
          if (tab.getId() === String(id)) {
            _results.push(tab);
          }
        }
        return _results;
      }).call(this);
      matchedTab = matchedTabs[0];
      if (!matchedTab) {
        return;
      }
      if (this.currTab.getId() === String(id)) {
        this.currTab = null;
      }
      matchedTab.destroy();
      this.tabs = (function() {
        var _i, _len, _ref2, _results;
        _ref2 = this.tabs;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          tab = _ref2[_i];
          if (tab.getId() !== String(id)) {
            _results.push(tab);
          }
        }
        return _results;
      }).call(this);
      if (!this.currTab && this.tabs.length) {
        this.changeTab(this.tabs[this.tabs.length - 1].getId());
      }
      if (this.tabs.length === 1) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    TabManager.prototype.changeTab = function(id) {
      var tab, _i, _len, _ref2, _results;
      _ref2 = this.tabs;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        tab = _ref2[_i];
        if (tab.getId() === String(id)) {
          tab.setActive(true);
          _results.push(this.currTab = tab);
        } else {
          _results.push(tab.setActive(false));
        }
      }
      return _results;
    };

    TabManager.prototype.deleteClicked = function() {
      if (this.currTab) {
        return this.emitter.emit('delete:clicked', this.currTab.getId());
      }
    };

    TabManager.prototype.onTabClicked = function(callback) {
      return this.emitter.on('tab:clicked', callback);
    };

    TabManager.prototype.onDeleteClicked = function(callback) {
      return this.emitter.on('delete:clicked', callback);
    };

    TabManager.prototype.deleteCurrentTab = function() {
      return this.removeTab(this.currTab.getId());
    };

    TabManager.prototype.destroy = function() {
      var tab, _i, _len, _ref2, _results;
      this.subscriptions.dispose();
      _ref2 = this.tabs;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        tab = _ref2[_i];
        _results.push(tab.destroy);
      }
      return _results;
    };

    return TabManager;

  })(View);

  module.exports = TabManager;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi92aWV3cy90YWItbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUVBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosRUFBQyxZQUFBLElBQUQsRUFBTyxTQUFBLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFFBQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsZ0JBQUEsT0FBRCxFQUFVLDRCQUFBLG1CQURWLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBSU07QUFDSixpQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sYUFBUDtPQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE1BQUEsRUFBUSxjQUFSO0FBQUEsWUFBd0IsT0FBQSxFQUFPLGVBQS9CO1dBQUwsRUFEeUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHlCQUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsRUFBUixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFxQixJQUFBLG1CQUFBLENBQUEsQ0FEckIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLE9BQUEsQ0FB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

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/views/tab-manager.coffee
