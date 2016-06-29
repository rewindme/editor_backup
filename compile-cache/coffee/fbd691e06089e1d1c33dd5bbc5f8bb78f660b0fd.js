(function() {
  var BottomDockService;

  BottomDockService = (function() {
    function BottomDockService(bottomDock) {
      this.bottomDock = bottomDock;
    }

    BottomDockService.prototype.isActive = function() {
      return this.bottomDock.active;
    };

    BottomDockService.prototype.toggle = function() {
      return this.bottomDock.toggle();
    };

    BottomDockService.prototype.changePane = function(id) {
      return this.bottomDock.changePane(id);
    };

    BottomDockService.prototype.deletePane = function(id) {
      return this.bottomDock.deletePane(id);
    };

    BottomDockService.prototype.getPane = function(id) {
      return this.bottomDock.getPane(id);
    };

    BottomDockService.prototype.addPane = function(pane, title, isInitial) {
      return this.bottomDock.addPane(pane, title, isInitial);
    };

    BottomDockService.prototype.getCurrentPane = function() {
      return this.bottomDock.getCurrentPane();
    };

    BottomDockService.prototype.deleteCurrentPane = function() {
      return this.bottomDock.deleteCurrentPane();
    };

    BottomDockService.prototype.onDidDeletePane = function(callback) {
      return this.bottomDock.onDidDeletePane(callback);
    };

    BottomDockService.prototype.onDidAddPane = function(callback) {
      return this.bottomDock.onDidAddPane(callback);
    };

    BottomDockService.prototype.onDidChangePane = function(callback) {
      return this.bottomDock.onDidChangePane(callback);
    };

    BottomDockService.prototype.onDidFinishResizing = function(callback) {
      return this.bottomDock.onDidFinishResizing(callback);
    };

    BottomDockService.prototype.onDidToggle = function(callback) {
      return this.bottomDock.onDidToggle(callback);
    };

    BottomDockService.prototype.paneCount = function() {
      return this.bottomDock.paneCount();
    };

    return BottomDockService;

  })();

  module.exports = BottomDockService;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi9ib3R0b20tZG9jay1zZXJ2aWNlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFNO0FBQ1MsSUFBQSwyQkFBRSxVQUFGLEdBQUE7QUFBZSxNQUFkLElBQUMsQ0FBQSxhQUFBLFVBQWEsQ0FBZjtJQUFBLENBQWI7O0FBQUEsZ0NBRUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FESjtJQUFBLENBRlYsQ0FBQTs7QUFBQSxnQ0FLQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFETTtJQUFBLENBTFIsQ0FBQTs7QUFBQSxnQ0FRQSxVQUFBLEdBQVksU0FBQyxFQUFELEdBQUE7YUFDVixJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBdUIsRUFBdkIsRUFEVTtJQUFBLENBUlosQ0FBQTs7QUFBQSxnQ0FXQSxVQUFBLEdBQVksU0FBQyxFQUFELEdBQUE7YUFDVixJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBdUIsRUFBdkIsRUFEVTtJQUFBLENBWFosQ0FBQTs7QUFBQSxnQ0FjQSxPQUFBLEdBQVMsU0FBQyxFQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBb0IsRUFBcEIsRUFETztJQUFBLENBZFQsQ0FBQTs7QUFBQSxnQ0FpQkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxTQUFkLEdBQUE7YUFDUCxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBb0IsSUFBcEIsRUFBMEIsS0FBMUIsRUFBaUMsU0FBakMsRUFETztJQUFBLENBakJULENBQUE7O0FBQUEsZ0NBb0JBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO2FBQ2QsSUFBQyxDQUFBLFVBQVUsQ0FBQyxjQUFaLENBQUEsRUFEYztJQUFBLENBcEJoQixDQUFBOztBQUFBLGdDQXVCQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7YUFDakIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUFBLEVBRGlCO0lBQUEsQ0F2Qm5CLENBQUE7O0FBQUEsZ0NBMEJBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7YUFDZixJQUFDLENBQUEsVUFBVSxDQUFDLGVBQVosQ0FBNEIsUUFBNUIsRUFEZTtJQUFBLENBMUJqQixDQUFBOztBQUFBLGdDQTZCQSxZQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFDWixJQUFDLENBQUEsVUFBVSxDQUFDLFlBQVosQ0FBeUIsUUFBekIsRUFEWTtJQUFBLENBN0JkLENBQUE7O0FBQUEsZ0NBZ0NBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7YUFDZixJQUFDLENBQUEsVUFBVSxDQUFDLGVBQVosQ0FBNEIsUUFBNUIsRUFEZTtJQUFBLENBaENqQixDQUFBOztBQUFBLGdDQW1DQSxtQkFBQSxHQUFxQixTQUFDLFFBQUQsR0FBQTthQUNuQixJQUFDLENBQUEsVUFBVSxDQUFDLG1CQUFaLENBQWdDLFFBQWhDLEVBRG1CO0lBQUEsQ0FuQ3JCLENBQUE7O0FBQUEsZ0NBc0NBLFdBQUEsR0FBYSxTQUFDLFFBQUQsR0FBQTthQUNYLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixRQUF4QixFQURXO0lBQUEsQ0F0Q2IsQ0FBQTs7QUFBQSxnQ0F5Q0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLEVBRFM7SUFBQSxDQXpDWCxDQUFBOzs2QkFBQTs7TUFERixDQUFBOztBQUFBLEVBNkNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGlCQTdDakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/bottom-dock-service.coffee
