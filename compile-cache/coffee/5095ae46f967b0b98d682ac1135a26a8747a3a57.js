(function() {
  var ProjectRemoveListView, SelectListView, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require("fs");

  path = require("path");

  SelectListView = require("atom-space-pen-views").SelectListView;

  module.exports = ProjectRemoveListView = (function(_super) {
    __extends(ProjectRemoveListView, _super);

    function ProjectRemoveListView() {
      return ProjectRemoveListView.__super__.constructor.apply(this, arguments);
    }

    ProjectRemoveListView.prototype.panel = null;

    ProjectRemoveListView.prototype.initialize = function() {
      ProjectRemoveListView.__super__.initialize.apply(this, arguments);
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
      return this.addClass("project-jump");
    };

    ProjectRemoveListView.prototype.getFilterKey = function() {
      return "name";
    };

    ProjectRemoveListView.prototype.viewForItem = function(project) {
      var el;
      el = document.createElement("li");
      el.textContent = path.parse(project).base;
      return el;
    };

    ProjectRemoveListView.prototype.destroy = function() {
      return this.panel.destroy();
    };

    ProjectRemoveListView.prototype.cancelled = function() {
      return this.panel.hide();
    };

    ProjectRemoveListView.prototype.confirmed = function(project) {
      this.cancel();
      return this.removeProject(project);
    };

    ProjectRemoveListView.prototype.attach = function() {
      this.storeFocusedElement();
      this.addProjects();
      this.panel.show();
      return this.focusFilterEditor();
    };

    ProjectRemoveListView.prototype.addProjects = function() {
      return this.setItems(atom.project.getPaths());
    };

    ProjectRemoveListView.prototype.show = function() {
      return this.attach();
    };

    ProjectRemoveListView.prototype.removeProject = function(dir) {
      console.log(dir);
      return atom.project.removePath(dir);
    };

    return ProjectRemoveListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtanVtcC9saWIvcHJvamVjdC1qdW1wLXByb2plY3QtcmVtb3ZlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsTUFBQSwrQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQyxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSLEVBQWxCLGNBRkQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ087QUFJTCw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsb0NBQUEsS0FBQSxHQUFPLElBQVAsQ0FBQTs7QUFBQSxvQ0FJQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1gsTUFBQSx1REFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBOEI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsUUFBWSxPQUFBLEVBQVMsS0FBckI7T0FBOUIsQ0FGVCxDQUFBO2FBR0EsSUFBQyxDQUFBLFFBQUQsQ0FBVyxjQUFYLEVBSlc7SUFBQSxDQUpaLENBQUE7O0FBQUEsb0NBVUEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNiLGFBQU8sTUFBUCxDQURhO0lBQUEsQ0FWZCxDQUFBOztBQUFBLG9DQWFBLFdBQUEsR0FBYSxTQUFFLE9BQUYsR0FBQTtBQUNaLFVBQUEsRUFBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLFFBQVEsQ0FBQyxhQUFULENBQXdCLElBQXhCLENBQUwsQ0FBQTtBQUFBLE1BQ0EsRUFBRSxDQUFDLFdBQUgsR0FBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBWSxPQUFaLENBQXFCLENBQUMsSUFEdkMsQ0FBQTtBQUVBLGFBQU8sRUFBUCxDQUhZO0lBQUEsQ0FiYixDQUFBOztBQUFBLG9DQWtCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUEsRUFEUTtJQUFBLENBbEJULENBQUE7O0FBQUEsb0NBcUJBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxFQURVO0lBQUEsQ0FyQlgsQ0FBQTs7QUFBQSxvQ0F3QkEsU0FBQSxHQUFXLFNBQUUsT0FBRixHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTthQUVBLElBQUMsQ0FBQSxhQUFELENBQWdCLE9BQWhCLEVBSFU7SUFBQSxDQXhCWCxDQUFBOztBQUFBLG9DQTZCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUpPO0lBQUEsQ0E3QlIsQ0FBQTs7QUFBQSxvQ0FxQ0EsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUNaLElBQUMsQ0FBQSxRQUFELENBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBWCxFQURZO0lBQUEsQ0FyQ2IsQ0FBQTs7QUFBQSxvQ0F3Q0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxNQUFELENBQUEsRUFESztJQUFBLENBeENOLENBQUE7O0FBQUEsb0NBMkNBLGFBQUEsR0FBZSxTQUFFLEdBQUYsR0FBQTtBQUNkLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaLENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBYixDQUF5QixHQUF6QixFQUZjO0lBQUEsQ0EzQ2YsQ0FBQTs7aUNBQUE7O0tBSm1DLGVBUHJDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/project-jump/lib/project-jump-project-remove.coffee
