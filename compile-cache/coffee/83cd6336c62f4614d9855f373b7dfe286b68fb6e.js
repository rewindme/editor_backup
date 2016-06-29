(function() {
  var BottomDock, BottomDockService, BottomDockServiceV0, BottomDockServiceV1, CompositeDisposable, Status;

  CompositeDisposable = require('atom').CompositeDisposable;

  BottomDockService = require('./bottom-dock-service');

  BottomDockServiceV1 = require('./bottom-dock-service-v1');

  BottomDockServiceV0 = require('./bottom-dock-service-v0');

  BottomDock = require('./views/bottom-dock');

  Status = require('./views/status');

  module.exports = {
    config: {
      showStatus: {
        title: 'Show bottom-dock toggle in status bar',
        type: 'boolean',
        "default": true
      },
      startOpen: {
        title: 'Start with panel open',
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      var config;
      config = {
        startOpen: atom.config.get('bottom-dock.startOpen')
      };
      this.bottomDock = new BottomDock(config);
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'bottom-dock:toggle': (function(_this) {
          return function() {
            return _this.bottomDock.toggle();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'bottom-dock:delete': (function(_this) {
          return function() {
            return _this.bottomDock.deleteCurrentPane();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.config.onDidChange('bottom-dock.showStatus', (function(_this) {
        return function(_arg) {
          var newValue, _ref;
          newValue = _arg.newValue;
          return (_ref = _this.statusBarTile) != null ? _ref.item.setVisiblity(newValue) : void 0;
        };
      })(this)));
    },
    consumeStatusBar: function(statusBar) {
      var config;
      config = {
        visible: atom.config.get('bottom-dock.showStatus')
      };
      this.statusBarTile = statusBar.addRightTile({
        item: new Status(config, {
          priority: 2
        })
      });
      return this.subscriptions.add(this.statusBarTile.item.onDidToggle((function(_this) {
        return function() {
          return _this.bottomDock.toggle();
        };
      })(this)));
    },
    provideBottomDockService: function() {
      return this.bottomDockService = new BottomDockService(this.bottomDock);
    },
    provideBottomDockServiceV1: function() {
      return this.bottomDockServiceV1 = new BottomDockServiceV1(this.bottomDock);
    },
    provideBottomDockServiceV0: function() {
      return this.bottomDockServiceV0 = new BottomDockServiceV0(this.bottomDock);
    },
    deactivate: function() {
      var _ref;
      this.subscriptions.dispose();
      this.bottomDock.destroy();
      if ((_ref = this.statusBarTile) != null) {
        _ref.destroy();
      }
      return this.statusBarTile = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvR0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBRHBCLENBQUE7O0FBQUEsRUFFQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsMEJBQVIsQ0FGdEIsQ0FBQTs7QUFBQSxFQUdBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSwwQkFBUixDQUh0QixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGdCQUFSLENBTFQsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sdUNBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQURGO0FBQUEsTUFJQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyx1QkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BTEY7S0FERjtBQUFBLElBVUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUNFO0FBQUEsUUFBQSxTQUFBLEVBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUFYO09BREYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFVBQUQs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

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/main.coffee
