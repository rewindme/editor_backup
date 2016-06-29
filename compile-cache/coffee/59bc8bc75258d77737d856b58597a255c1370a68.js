(function() {
  var $, BufferedProcess, Convert, GulpControlView, View, convert, crypto, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  crypto = require('crypto');

  fs = require('fs');

  path = require('path');

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  Convert = require('ansi-to-html');

  convert = new Convert();

  module.exports = GulpControlView = (function(_super) {
    __extends(GulpControlView, _super);

    function GulpControlView() {
      return GulpControlView.__super__.constructor.apply(this, arguments);
    }

    GulpControlView.content = function() {
      return this.div({
        "class": 'gulp-control'
      }, (function(_this) {
        return function() {
          _this.ul({
            "class": 'tasks',
            outlet: 'taskList'
          });
          return _this.div({
            "class": 'output',
            outlet: 'outputPane'
          });
        };
      })(this));
    };

    GulpControlView.prototype.serialize = function() {};

    GulpControlView.prototype.initialize = function() {
      var projpaths;
      console.log('GulpControlView: initialize');
      projpaths = atom.project.getPaths();
      if (!projpaths || !projpaths.length || !projpaths[0]) {
        this.writeOutput('No project path found, aborting', 'error');
        return;
      }
      this.click('.tasks li.task', (function(_this) {
        return function(event) {
          var t, target, task, _i, _len, _ref1;
          target = $(event.target);
          task = target.text();
          if (target.hasClass('running') && _this.process) {
            _this.process.kill();
            _this.process = null;
            target.removeClass('active running');
            return _this.writeOutput("Task '" + task + "' stopped");
          } else {
            _ref1 = _this.tasks;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              t = _ref1[_i];
              if (t === task) {
                return _this.runGulp(task);
              }
            }
          }
        };
      })(this));
      this.getGulpTasks();
    };

    GulpControlView.prototype.destroy = function() {
      console.log('GulpControlView: destroy');
      if (this.process) {
        this.process.kill();
        this.process = null;
      }
      this.detach();
    };

    GulpControlView.prototype.getTitle = function() {
      return 'gulp.js:control';
    };

    GulpControlView.prototype.getGulpCwd = function(cwd) {
      var abs, dir, dirs, entry, found, gfregx, _i, _j, _len, _len1, _ref1;
      dirs = [];
      gfregx = /^gulpfile(\.babel)?\.(js|coffee)/i;
      _ref1 = fs.readdirSync(cwd);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        entry = _ref1[_i];
        if (entry.indexOf('.') !== 0) {
          if (gfregx.test(entry)) {
            this.gulpFile = entry;
            return cwd;
          } else if (entry.indexOf('node_modules') === -1) {
            abs = path.join(cwd, entry);
            if (fs.statSync(abs).isDirectory()) {
              dirs.push(abs);
            }
          }
        }
      }
      for (_j = 0, _len1 = dirs.length; _j < _len1; _j++) {
        dir = dirs[_j];
        if (found = this.getGulpCwd(dir)) {
          return found;
        }
      }
    };

    GulpControlView.prototype.getTaskId = function(taskname) {
      var shasum;
      shasum = crypto.createHash('sha1');
      shasum.update(taskname);
      return "gulp-" + (shasum.digest('hex'));
    };

    GulpControlView.prototype.getGulpTasks = function() {
      var onError, onExit, onOutput, projpath;
      this.tasks = [];
      projpath = atom.project.getPaths()[0];
      if (!(this.gulpCwd = this.getGulpCwd(projpath))) {
        this.writeOutput("Unable to find " + projpath + "/**/gulpfile.[js|coffee]", 'error');
        return;
      }
      this.writeOutput("Using " + this.gulpCwd + "/" + this.gulpFile);
      this.writeOutput('Retrieving list of gulp tasks');
      onOutput = (function(_this) {
        return function(output) {
          var task, _i, _len, _ref1, _results;
          _ref1 = output.split('\n');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            task = _ref1[_i];
            if (task.length) {
              _results.push(_this.tasks.push(task));
            }
          }
          return _results;
        };
      })(this);
      onError = (function(_this) {
        return function(output) {
          return _this.gulpErr(output);
        };
      })(this);
      onExit = (function(_this) {
        return function(code) {
          var task, tid, _i, _len, _ref1;
          if (code === 0) {
            _ref1 = _this.tasks.sort();
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              task = _ref1[_i];
              tid = _this.getTaskId(task);
              _this.taskList.append("<li id='" + tid + "' class='task'>" + task + "</li>");
            }
            return _this.writeOutput("" + _this.tasks.length + " tasks found");
          } else {
            _this.gulpExit(code);
            return console.error('GulpControl: getGulpTasks, exit', code);
          }
        };
      })(this);
      this.runGulp('--tasks-simple', onOutput, onError, onExit);
    };

    GulpControlView.prototype.runGulp = function(task, stdout, stderr, exit) {
      var args, command, localGulpPath, options, projpath, tid;
      if (this.process) {
        this.process.kill();
        this.process = null;
      }
      command = 'gulp';
      projpath = atom.project.getPaths()[0];
      localGulpPath = path.join(projpath, 'node_modules', '.bin', 'gulp');
      if (fs.existsSync(localGulpPath)) {
        command = localGulpPath;
      }
      args = [task, '--color'];
      process.env.PATH = (function() {
        switch (process.platform) {
          case 'win32':
            return process.env.PATH;
          default:
            return ("" + process.env.PATH + ":") + atom.config.get('gulp-control.nodePath');
        }
      })();
      options = {
        cwd: this.gulpCwd,
        env: process.env
      };
      stdout || (stdout = (function(_this) {
        return function(output) {
          return _this.gulpOut(output);
        };
      })(this));
      stderr || (stderr = (function(_this) {
        return function(code) {
          return _this.gulpErr(code);
        };
      })(this));
      exit || (exit = (function(_this) {
        return function(code) {
          return _this.gulpExit(code);
        };
      })(this));
      if (task.indexOf('-')) {
        this.writeOutput('&nbsp;');
        this.writeOutput("Running gulp " + task);
      }
      tid = this.getTaskId(task);
      this.find('.tasks li.task.active').removeClass('active');
      this.find(".tasks li.task#" + tid).addClass('active running');
      this.process = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    };

    GulpControlView.prototype.writeOutput = function(line, klass) {
      if (line && line.length) {
        this.outputPane.append("<pre class='" + (klass || '') + "'>" + line + "</pre>");
        this.outputPane.scrollToBottom();
      }
    };

    GulpControlView.prototype.gulpOut = function(output) {
      var line, _i, _len, _ref1;
      _ref1 = output.split('\n');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        this.writeOutput(convert.toHtml(line));
      }
    };

    GulpControlView.prototype.gulpErr = function(output) {
      var line, _i, _len, _ref1;
      _ref1 = output.split('\n');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        this.writeOutput(convert.toHtml(line), 'error');
      }
    };

    GulpControlView.prototype.gulpExit = function(code) {
      this.find('.tasks li.task.active.running').removeClass('running');
      this.writeOutput("Exited with code " + code, "" + (code ? 'error' : ''));
      this.process = null;
    };

    return GulpControlView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2d1bHAtY29udHJvbC9saWIvZ3VscC1jb250cm9sLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1GQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFKRCxDQUFBOztBQUFBLEVBS0EsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFlBQUEsSUFBRCxFQUFPLFNBQUEsQ0FMUCxDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxjQUFSLENBUFYsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBQSxDQVJkLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sY0FBUDtPQUFMLEVBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDMUIsVUFBQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtBQUFBLFlBQWdCLE1BQUEsRUFBUSxVQUF4QjtXQUFKLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sUUFB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

//# sourceURL=/Users/naver/.atom/packages/gulp-control/lib/gulp-control-view.coffee
