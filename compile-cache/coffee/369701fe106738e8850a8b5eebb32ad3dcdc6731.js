(function() {
  var CompositeDisposable, GulpControl, GulpControlView, views;

  GulpControlView = require('./gulp-control-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  views = [];

  module.exports = GulpControl = {
    activate: function(state) {
      console.log('GulpControl: activate');
      atom.commands.add('atom-workspace', {
        "gulp-control:toggle": (function(_this) {
          return function() {
            return _this.newView();
          };
        })(this)
      });
    },
    deactivate: function() {
      console.log('GulpControl: deactivate');
    },
    newView: function() {
      var item, pane, view;
      console.log('GulpControl: toggle');
      view = new GulpControlView();
      views.push(view);
      pane = atom.workspace.getActivePane();
      item = pane.addItem(view, 0);
      pane.activateItem(item);
    },
    serialize: function() {},
    config: {
      nodePath: {
        title: 'Bin Path',
        description: 'This should be set to the folder in which the node executable is located. This can be found by typing \'which node\' from the command line, but you need to remove \'node\' from the end.',
        type: 'string',
        "default": '/usr/local/bin'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2d1bHAtY29udHJvbC9saWIvZ3VscC1jb250cm9sLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3REFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxFQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUFpQixXQUFBLEdBQ2Y7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSx1QkFBWixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLHFCQUFBLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO09BQXBDLENBRkEsQ0FEUTtJQUFBLENBQVY7QUFBQSxJQU1BLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkseUJBQVosQ0FBQSxDQURVO0lBQUEsQ0FOWjtBQUFBLElBVUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkscUJBQVosQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQVcsSUFBQSxlQUFBLENBQUEsQ0FGWCxDQUFBO0FBQUEsTUFHQSxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FMUCxDQUFBO0FBQUEsTUFNQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLENBQW5CLENBTlAsQ0FBQTtBQUFBLE1BT0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBbEIsQ0FQQSxDQURPO0lBQUEsQ0FWVDtBQUFBLElBcUJBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0FyQlg7QUFBQSxJQXVCQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLFVBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwyTEFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxnQkFIVDtPQURGO0tBeEJGO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/naver/.atom/packages/gulp-control/lib/gulp-control.coffee
