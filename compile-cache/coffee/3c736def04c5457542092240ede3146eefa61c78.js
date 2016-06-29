(function() {
  var BottomDockServiceV1;

  BottomDockServiceV1 = (function() {
    function BottomDockServiceV1(bottomDock) {
      this.bottomDock = bottomDock;
    }

    BottomDockServiceV1.prototype.toggle = function() {
      return this.bottomDock.toggle();
    };

    BottomDockServiceV1.prototype.changePane = function(id) {
      return this.bottomDock.changePane(id);
    };

    BottomDockServiceV1.prototype.refreshPane = function(id) {};

    BottomDockServiceV1.prototype.deletePane = function(id) {
      return this.bottomDock.deletePane(id);
    };

    BottomDockServiceV1.prototype.getPane = function(id) {
      return this.bottomDock.getPane(id);
    };

    BottomDockServiceV1.prototype.addPane = function(pane, tabButton) {
      return this.bottomDock.addPane(pane, pane.getId());
    };

    BottomDockServiceV1.prototype.getCurrentPane = function() {
      return this.bottomDock.getCurrentPane();
    };

    BottomDockServiceV1.prototype.refreshCurrentPane = function() {};

    BottomDockServiceV1.prototype.deleteCurrentPane = function() {
      return this.bottomDock.deleteCurrentPane();
    };

    BottomDockServiceV1.prototype.onDidDeletePane = function(callback) {
      return this.bottomDock.onDidDeletePane(callback);
    };

    BottomDockServiceV1.prototype.onDidChangePane = function(callback) {
      return this.bottomDock.onDidChangePane(callback);
    };

    return BottomDockServiceV1;

  })();

  module.exports = BottomDockServiceV1;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi9ib3R0b20tZG9jay1zZXJ2aWNlLXYxLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFNO0FBQ1MsSUFBQSw2QkFBRSxVQUFGLEdBQUE7QUFBZSxNQUFkLElBQUMsQ0FBQSxhQUFBLFVBQWEsQ0FBZjtJQUFBLENBQWI7O0FBQUEsa0NBRUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBRE07SUFBQSxDQUZSLENBQUE7O0FBQUEsa0NBS0EsVUFBQSxHQUFZLFNBQUMsRUFBRCxHQUFBO2FBQ1YsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQXVCLEVBQXZCLEVBRFU7SUFBQSxDQUxaLENBQUE7O0FBQUEsa0NBUUEsV0FBQSxHQUFhLFNBQUMsRUFBRCxHQUFBLENBUmIsQ0FBQTs7QUFBQSxrQ0FVQSxVQUFBLEdBQVksU0FBQyxFQUFELEdBQUE7YUFDVixJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBdUIsRUFBdkIsRUFEVTtJQUFBLENBVlosQ0FBQTs7QUFBQSxrQ0FhQSxPQUFBLEdBQVMsU0FBQyxFQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBb0IsRUFBcEIsRUFETztJQUFBLENBYlQsQ0FBQTs7QUFBQSxrQ0FnQkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLFNBQVAsR0FBQTthQUVQLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFvQixJQUFwQixFQUEwQixJQUFJLENBQUMsS0FBTCxDQUFBLENBQTFCLEVBRk87SUFBQSxDQWhCVCxDQUFBOztBQUFBLGtDQW9CQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUNkLElBQUMsQ0FBQSxVQUFVLENBQUMsY0FBWixDQUFBLEVBRGM7SUFBQSxDQXBCaEIsQ0FBQTs7QUFBQSxrQ0F1QkEsa0JBQUEsR0FBb0IsU0FBQSxHQUFBLENBdkJwQixDQUFBOztBQUFBLGtDQXlCQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7YUFDakIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUFBLEVBRGlCO0lBQUEsQ0F6Qm5CLENBQUE7O0FBQUEsa0NBNEJBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7YUFDZixJQUFDLENBQUEsVUFBVSxDQUFDLGVBQVosQ0FBNEIsUUFBNUIsRUFEZTtJQUFBLENBNUJqQixDQUFBOztBQUFBLGtDQStCQSxlQUFBLEdBQWlCLFNBQUMsUUFBRCxHQUFBO2FBQ2YsSUFBQyxDQUFBLFVBQVUsQ0FBQyxlQUFaLENBQTRCLFFBQTVCLEVBRGU7SUFBQSxDQS9CakIsQ0FBQTs7K0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQW1DQSxNQUFNLENBQUMsT0FBUCxHQUFpQixtQkFuQ2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/bottom-dock-service-v1.coffee
