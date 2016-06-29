(function() {
  var ProjectJumpListView, SelectListView, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require("fs");

  path = require("path");

  SelectListView = require("atom-space-pen-views").SelectListView;

  module.exports = ProjectJumpListView = (function(_super) {
    __extends(ProjectJumpListView, _super);

    function ProjectJumpListView() {
      return ProjectJumpListView.__super__.constructor.apply(this, arguments);
    }

    ProjectJumpListView.prototype.panel = null;

    ProjectJumpListView.prototype.mode = null;

    ProjectJumpListView.prototype.initialize = function() {
      ProjectJumpListView.__super__.initialize.apply(this, arguments);
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
      this.addClass("project-jump");
      return this.list.addClass("mark-active");
    };

    ProjectJumpListView.prototype.getFilterKey = function() {
      return "name";
    };

    ProjectJumpListView.prototype.viewForItem = function(project) {
      var el;
      el = document.createElement("li");
      el.textContent = project.name;
      el.dataset.dir = project.dir;
      if (atom.project.getPaths().indexOf(project.dir) !== -1) {
        el.classList.add("active");
      }
      return el;
    };

    ProjectJumpListView.prototype.destroy = function() {
      return this.panel.destroy();
    };

    ProjectJumpListView.prototype.cancelled = function() {
      return this.panel.hide();
    };

    ProjectJumpListView.prototype.confirmed = function(project) {
      this.cancel();
      return this.openProject(project.dir);
    };

    ProjectJumpListView.prototype.attach = function() {
      this.storeFocusedElement();
      this.addProjects();
      this.panel.show();
      return this.focusFilterEditor();
    };

    ProjectJumpListView.prototype.addProjects = function() {
      var list, project, projectHome, _i, _len, _ref;
      list = [];
      try {
        projectHome = atom.config.get("core.projectHome");
        _ref = fs.readdirSync(projectHome);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          project = _ref[_i];
          list.push({
            name: project,
            dir: path.join(projectHome, project)
          });
        }
      } catch (_error) {}
      return this.setItems(list);
    };

    ProjectJumpListView.prototype.show = function(mode) {
      this.mode = mode;
      return this.attach();
    };

    ProjectJumpListView.prototype.openProject = function(dir) {
      switch (this.mode) {
        case "add":
          return atom.project.addPath(dir);
        case "open":
          return atom.open({
            pathsToOpen: [dir],
            newWindow: true
          });
        case "switch":
          return atom.project.setPaths([dir]);
      }
    };

    return ProjectJumpListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtanVtcC9saWIvcHJvamVjdC1qdW1wLXByb2plY3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsNkNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUixFQUFsQixjQUZELENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNPO0FBSUwsMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGtDQUFBLEtBQUEsR0FBTyxJQUFQLENBQUE7O0FBQUEsa0NBQ0EsSUFBQSxHQUFNLElBRE4sQ0FBQTs7QUFBQSxrQ0FLQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1gsTUFBQSxxREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBOEI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsUUFBWSxPQUFBLEVBQVMsS0FBckI7T0FBOUIsQ0FGVCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsUUFBRCxDQUFXLGNBQVgsQ0FIQSxDQUFBO2FBSUEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQWdCLGFBQWhCLEVBTFc7SUFBQSxDQUxaLENBQUE7O0FBQUEsa0NBWUEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNiLGFBQU8sTUFBUCxDQURhO0lBQUEsQ0FaZCxDQUFBOztBQUFBLGtDQWVBLFdBQUEsR0FBYSxTQUFFLE9BQUYsR0FBQTtBQUNaLFVBQUEsRUFBQTtBQUFB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

//# sourceURL=/Users/naver/.atom/packages/project-jump/lib/project-jump-project-view.coffee
