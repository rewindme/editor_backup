(function() {
  var BufferedProcess, Convert, GulpHelperView, View, converter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  BufferedProcess = require('atom').BufferedProcess;

  Convert = require('ansi-to-html');

  converter = new Convert();

  module.exports = GulpHelperView = (function(_super) {
    var args, command, processes;

    __extends(GulpHelperView, _super);

    function GulpHelperView() {
      this.gulpExit = __bind(this.gulpExit, this);
      this.gulpErr = __bind(this.gulpErr, this);
      this.gulpOut = __bind(this.gulpOut, this);
      return GulpHelperView.__super__.constructor.apply(this, arguments);
    }

    processes = {};

    command = process.platform === 'win32' ? 'gulp' : '/usr/local/bin/gulp';

    args = ['watch', '--color'];

    GulpHelperView.content = function() {
      return this.div({
        "class": "gulp-helper tool-panel panel-bottom"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "panel-heading affix"
          }, 'Gulp Output');
          return _this.div({
            "class": "panel-body padded"
          });
        };
      })(this));
    };

    GulpHelperView.prototype.initialize = function(serializeState) {
      return atom.workspaceView.command("gulp-helper:toggle", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    };

    GulpHelperView.prototype.serialize = function() {};

    GulpHelperView.prototype.destroy = function() {
      return this.detach();
    };

    GulpHelperView.prototype.toggle = function() {
      var process, projectPath, _results;
      if (this.hasParent()) {
        this.detach();
        _results = [];
        for (projectPath in processes) {
          process = processes[projectPath];
          if (process) {
            _results.push(process.kill());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        atom.workspaceView.prependToBottom(this);
        return this.runGulp();
      }
    };

    GulpHelperView.prototype.runGulp = function() {
      var projectPath, _i, _len, _ref, _results;
      atom.workspaceView.find('.gulp-helper .panel-body').html('');
      _ref = atom.project.getPaths();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        projectPath = _ref[_i];
        _results.push((function(_this) {
          return function(projectPath) {
            var exit, options, projectPathName, stderr, stdout;
            options = {
              cwd: projectPath
            };
            projectPathName = projectPath.split(path.sep).filter(function(path) {
              return path !== '';
            }).pop();
            stdout = function(output) {
              return _this.gulpOut(output, projectPathName);
            };
            stderr = function(code) {
              return _this.gulpErr(code, projectPathName);
            };
            exit = function(code) {
              return _this.gulpErr(code, projectPathName);
            };
            return processes[projectPath] = new BufferedProcess({
              command: command,
              args: args,
              options: options,
              stdout: stdout,
              stderr: stderr,
              exit: exit
            });
          };
        })(this)(projectPath));
      }
      return _results;
    };

    GulpHelperView.prototype.setScroll = function() {
      var gulpHelper;
      gulpHelper = atom.workspaceView.find('.gulp-helper');
      return gulpHelper.scrollTop(gulpHelper[0].scrollHeight);
    };

    GulpHelperView.prototype.gulpOut = function(output, projectPath) {
      var line, stream, _i, _len, _ref;
      _ref = output.split("\n").filter(function(lineRaw) {
        return lineRaw !== '';
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        stream = converter.toHtml(line);
        atom.workspaceView.find('.gulp-helper .panel-body').append("<div class='text-highighted'><span class='folder-name'>" + projectPath + "</span> " + stream + "</div>");
      }
      return this.setScroll();
    };

    GulpHelperView.prototype.gulpErr = function(code, projectPath) {
      atom.workspaceView.find('.gulp-helper .panel-body').append("<div class='text-error'><span class='folder-name'>" + projectPath + "</span> Error Code: " + code + "</div>");
      return this.setScroll();
    };

    GulpHelperView.prototype.gulpExit = function(code, projectPath) {
      atom.workspaceView.find('.gulp-helper .panel-body').append("<div class='text-error'><span class='folder-name'>" + projectPath + "</span> Exited with error code: " + code + "</div>");
      return this.setScroll();
    };

    return GulpHelperView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2d1bHAtaGVscGVyL2xpYi9ndWxwLWhlbHBlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5REFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLE1BQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFERCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxjQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBZ0IsSUFBQSxPQUFBLENBQUEsQ0FIaEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixRQUFBLHdCQUFBOztBQUFBLHFDQUFBLENBQUE7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLFNBQUEsR0FBWSxFQUFaLENBQUE7O0FBQUEsSUFDQSxPQUFBLEdBQWEsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkIsR0FBb0MsTUFBcEMsR0FBZ0QscUJBRDFELENBQUE7O0FBQUEsSUFFQSxJQUFBLEdBQU8sQ0FBQyxPQUFELEVBQVUsU0FBVixDQUZQLENBQUE7O0FBQUEsSUFHQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxxQ0FBUDtPQUFMLEVBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDakQsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8scUJBQVA7V0FBTCxFQUFtQyxhQUFuQyxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFP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

//# sourceURL=/Users/naver/.atom/packages/gulp-helper/lib/gulp-helper-view.coffee
