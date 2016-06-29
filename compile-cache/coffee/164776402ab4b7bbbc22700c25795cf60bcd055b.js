(function() {
  var BottomDock, CompositeDisposable, DockPaneManager, Emitter, Header, TabManager, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  View = require('space-pen').View;

  TabManager = require('./tab-manager');

  DockPaneManager = require('./dock-pane-manager');

  Header = require('./header');

  BottomDock = (function(_super) {
    __extends(BottomDock, _super);

    function BottomDock() {
      this.deleteCurrentPane = __bind(this.deleteCurrentPane, this);
      this.deletePane = __bind(this.deletePane, this);
      this.changePane = __bind(this.changePane, this);
      return BottomDock.__super__.constructor.apply(this, arguments);
    }

    BottomDock.content = function(config) {
      return this.div({
        "class": 'bottom-dock'
      }, (function(_this) {
        return function() {
          _this.subview('header', new Header());
          _this.subview('dockPaneManager', new DockPaneManager());
          return _this.subview('tabManager', new TabManager());
        };
      })(this));
    };

    BottomDock.prototype.initialize = function(config) {
      config = config != null ? config : {};
      this.subscriptions = new CompositeDisposable();
      this.active = false;
      this.panel = this.createPanel({
        startOpen: config.startOpen
      });
      this.emitter = new Emitter();
      return this.subscriptions.add(this.tabManager.onTabClicked(this.changePane));
    };

    BottomDock.prototype.onDidFinishResizing = function(callback) {
      return this.header.onDidFinishResizing(callback);
    };

    BottomDock.prototype.onDidChangePane = function(callback) {
      return this.emitter.on('pane:changed', callback);
    };

    BottomDock.prototype.onDidDeletePane = function(callback) {
      return this.emitter.on('pane:deleted', callback);
    };

    BottomDock.prototype.onDidAddPane = function(callback) {
      return this.emitter.on('pane:added', callback);
    };

    BottomDock.prototype.onDidToggle = function(callback) {
      return this.emitter.on('pane:toggled', callback);
    };

    BottomDock.prototype.addPane = function(pane, title, isInitial) {
      var config;
      this.dockPaneManager.addPane(pane);
      config = {
        title: title,
        id: pane.getId()
      };
      if (!isInitial) {
        this.panel.show();
      }
      this.tabManager.addTab(config);
      if (pane.isActive()) {
        this.changePane(pane.getId());
      } else {
        tabButton.setActive(false);
      }
      return this.emitter.emit('pane:added', pane.getId());
    };

    BottomDock.prototype.getPane = function(id) {
      return this.dockPaneManager.getPane(id);
    };

    BottomDock.prototype.getCurrentPane = function() {
      return this.dockPaneManager.getCurrentPane();
    };

    BottomDock.prototype.changePane = function(id) {
      this.dockPaneManager.changePane(id);
      this.tabManager.changeTab(id);
      this.header.setTitle(this.tabManager.getCurrentTabTitle());
      return this.emitter.emit('pane:changed', id);
    };

    BottomDock.prototype.deletePane = function(id) {
      var success;
      success = this.dockPaneManager.deletePane(id);
      if (!success) {
        return;
      }
      this.tabManager.deleteTab(id);
      if (this.dockPaneManager.getCurrentPane()) {
        this.header.setTitle(this.tabManager.getCurrentTabTitle());
      } else {
        this.active = false;
        this.toggle();
      }
      return this.emitter.emit('pane:deleted', id);
    };

    BottomDock.prototype.deleteCurrentPane = function() {
      var currentPane;
      currentPane = this.dockPaneManager.getCurrentPane();
      if (!currentPane) {
        return;
      }
      return this.deletePane(currentPane.getId());
    };

    BottomDock.prototype.createPanel = function(_arg) {
      var options, startOpen;
      startOpen = _arg.startOpen;
      this.active = startOpen;
      options = {
        item: this,
        visible: startOpen,
        priority: 1000
      };
      return atom.workspace.addBottomPanel(options);
    };

    BottomDock.prototype.toggle = function() {
      if (!this.panel.isVisible() && this.dockPaneManager.getCurrentPane()) {
        this.active = true;
        this.panel.show();
      } else {
        this.active = false;
        this.panel.hide();
      }
      return this.emitter.emit('pane:toggled', this.active);
    };

    BottomDock.prototype.paneCount = function() {
      return this.dockPaneManager.paneCount();
    };

    BottomDock.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.panel.destroy();
      this.header.destroy();
      this.tabManager.destroy();
      return this.dockPaneManager.destroy();
    };

    return BottomDock;

  })(View);

  module.exports = BottomDock;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi92aWV3cy9ib3R0b20tZG9jay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUZBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FBdEIsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLFdBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUpULENBQUE7O0FBQUEsRUFNTTtBQUNKLGlDQUFBLENBQUE7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxNQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sYUFBUDtPQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekIsVUFBQSxLQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQsRUFBdUIsSUFBQSxNQUFBLENBQUEsQ0FBdkIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLGlCQUFULEVBQWdDLElBQUEsZUFBQSxDQUFBLENBQWhDLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxVQUFBLENBQUEsQ0FBM0IsRUFIeUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxD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

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/views/bottom-dock.coffee
