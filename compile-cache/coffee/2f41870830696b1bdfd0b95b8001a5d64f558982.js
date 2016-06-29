(function() {
  var BottomDockServiceV0;

  BottomDockServiceV0 = (function() {
    function BottomDockServiceV0(bottomDock) {
      this.bottomDock = bottomDock;
    }

    BottomDockServiceV0.prototype.toggle = function() {
      return this.bottomDock.toggle();
    };

    BottomDockServiceV0.prototype.changePane = function(id) {
      return this.bottomDock.changePane(id);
    };

    BottomDockServiceV0.prototype.refreshPane = function(id) {};

    BottomDockServiceV0.prototype.deletePane = function(id) {
      return this.bottomDock.deletePane(id);
    };

    BottomDockServiceV0.prototype.getPane = function(id) {
      return this.bottomDock.getPane(id);
    };

    BottomDockServiceV0.prototype.addPane = function(pane, title) {
      var tabConfig;
      tabConfig = {
        title: title,
        active: true,
        id: pane.getId()
      };
      return this.bottomDock.addPane(pane, tabConfig);
    };

    BottomDockServiceV0.prototype.getCurrentPane = function() {
      return this.bottomDock.getCurrentPane();
    };

    BottomDockServiceV0.prototype.refreshCurrentPane = function() {};

    BottomDockServiceV0.prototype.deleteCurrentPane = function() {
      return this.bottomDock.deleteCurrentPane();
    };

    return BottomDockServiceV0;

  })();

  module.exports = BottomDockServiceV0;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi9ib3R0b20tZG9jay1zZXJ2aWNlLXYwLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFNO0FBQ1MsSUFBQSw2QkFBRSxVQUFGLEdBQUE7QUFBZSxNQUFkLElBQUMsQ0FBQSxhQUFBLFVBQWEsQ0FBZjtJQUFBLENBQWI7O0FBQUEsa0NBRUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBRE07SUFBQSxDQUZSLENBQUE7O0FBQUEsa0NBS0EsVUFBQSxHQUFZLFNBQUMsRUFBRCxHQUFBO2FBQ1YsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQXVCLEVBQXZCLEVBRFU7SUFBQSxDQUxaLENBQUE7O0FBQUEsa0NBUUEsV0FBQSxHQUFhLFNBQUMsRUFBRCxHQUFBLENBUmIsQ0FBQTs7QUFBQSxrQ0FVQSxVQUFBLEdBQVksU0FBQyxFQUFELEdBQUE7YUFDVixJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBdUIsRUFBdkIsRUFEVTtJQUFBLENBVlosQ0FBQTs7QUFBQSxrQ0FhQSxPQUFBLEdBQVMsU0FBQyxFQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBb0IsRUFBcEIsRUFETztJQUFBLENBYlQsQ0FBQTs7QUFBQSxrQ0FnQkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTtBQUNQLFVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sS0FBUDtBQUFBLFFBQ0EsTUFBQSxFQUFRLElBRFI7QUFBQSxRQUVBLEVBQUEsRUFBSSxJQUFJLENBQUMsS0FBTCxDQUFBLENBRko7T0FERixDQUFBO2FBS0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLElBQXBCLEVBQTBCLFNBQTFCLEVBTk87SUFBQSxDQWhCVCxDQUFBOztBQUFBLGtDQXdCQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUNkLElBQUMsQ0FBQSxVQUFVLENBQUMsY0FBWixDQUFBLEVBRGM7SUFBQSxDQXhCaEIsQ0FBQTs7QUFBQSxrQ0EyQkEsa0JBQUEsR0FBb0IsU0FBQSxHQUFBLENBM0JwQixDQUFBOztBQUFBLGtDQTZCQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7YUFDakIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUFBLEVBRGlCO0lBQUEsQ0E3Qm5CLENBQUE7OytCQUFBOztNQURGLENBQUE7O0FBQUEsRUFpQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsbUJBakNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/bottom-dock-service-v0.coffee
