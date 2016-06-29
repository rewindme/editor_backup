(function() {
  var CompositeDisposable, ProjectJump, ProjectListView, ProjectRemoveListView;

  CompositeDisposable = require('atom').CompositeDisposable;

  ProjectListView = require("./project-jump-project-view");

  ProjectRemoveListView = require("./project-jump-project-remove");

  module.exports = ProjectJump = {
    commands: null,
    listView: null,
    listViewRemove: null,
    activate: function() {
      this.listView = new ProjectListView;
      this.listViewRemove = new ProjectRemoveListView;
      this.commands = new CompositeDisposable;
      return this.commands.add(atom.commands.add("atom-workspace", {
        "project-jump:add": (function(_this) {
          return function() {
            return _this.listView.show("add");
          };
        })(this),
        "project-jump:open": (function(_this) {
          return function() {
            return _this.listView.show("open");
          };
        })(this),
        "project-jump:switch": (function(_this) {
          return function() {
            return _this.listView.show("switch");
          };
        })(this),
        "project-jump:remove": (function(_this) {
          return function() {
            return _this.listViewRemove.show();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.commands.dispose();
      this.listView.destroy();
      return this.listViewRemove.destroy();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtanVtcC9saWIvcHJvamVjdC1qdW1wLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsTUFBQSx3RUFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEsNkJBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSwrQkFBUixDQUZ4QixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsV0FBQSxHQUVoQjtBQUFBLElBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxJQUNBLFFBQUEsRUFBVSxJQURWO0FBQUEsSUFFQSxjQUFBLEVBQWdCLElBRmhCO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBRVQsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEdBQUEsQ0FBQSxlQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEdBQUEsQ0FBQSxxQkFEbEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxHQUFBLENBQUEsbUJBSFosQ0FBQTthQUlBLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFtQixnQkFBbkIsRUFDZDtBQUFBLFFBQUEsa0JBQUEsRUFBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWdCLEtBQWhCLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtBQUFBLFFBQ0EsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWdCLE1BQWhCLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURyQjtBQUFBLFFBRUEscUJBQUEsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWdCLFFBQWhCLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZ2QjtBQUFBLFFBR0EscUJBQUEsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUh2QjtPQURjLENBQWYsRUFOUztJQUFBLENBSlY7QUFBQSxJQWlCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBaEIsQ0FBQSxFQUhXO0lBQUEsQ0FqQlo7R0FSRCxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/project-jump/lib/project-jump.coffee
