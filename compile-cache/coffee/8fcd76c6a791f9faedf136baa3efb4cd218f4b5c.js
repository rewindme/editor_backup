(function() {
  var CommandOutputView, TextEditorView, View, addClass, ansihtml, dirname, exec, extname, fs, lastOpenedView, readline, removeClass, resolve, spawn, _ref, _ref1, _ref2, _ref3,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  _ref1 = require('child_process'), spawn = _ref1.spawn, exec = _ref1.exec;

  ansihtml = require('ansi-html-stream');

  readline = require('readline');

  _ref2 = require('domutil'), addClass = _ref2.addClass, removeClass = _ref2.removeClass;

  _ref3 = require('path'), resolve = _ref3.resolve, dirname = _ref3.dirname, extname = _ref3.extname;

  fs = require('fs');

  lastOpenedView = null;

  module.exports = CommandOutputView = (function(_super) {
    __extends(CommandOutputView, _super);

    function CommandOutputView() {
      this.flashIconClass = __bind(this.flashIconClass, this);
      return CommandOutputView.__super__.constructor.apply(this, arguments);
    }

    CommandOutputView.prototype.cwd = null;

    CommandOutputView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'panel cli-status panel-bottom'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'cli-panel-body'
          }, function() {
            return _this.pre({
              "class": "terminal",
              outlet: "cliOutput"
            });
          });
          return _this.div({
            "class": 'cli-panel-input'
          }, function() {
            _this.subview('cmdEditor', new TextEditorView({
              mini: true,
              placeholderText: 'input your command here'
            }));
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                outlet: 'killBtn',
                click: 'kill',
                "class": 'btn hide'
              }, 'kill');
              _this.button({
                click: 'destroy',
                "class": 'btn'
              }, 'destroy');
              return _this.span({
                "class": 'icon icon-x',
                click: 'close'
              });
            });
          });
        };
      })(this));
    };

    CommandOutputView.prototype.initialize = function() {
      var cmd, shell;
      this.userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      cmd = 'test -e /etc/profile && source /etc/profile;test -e ~/.profile && source ~/.profile; node -pe "JSON.stringify(process.env)"';
      shell = atom.config.get('terminal-panel.shell');
      exec(cmd, {
        shell: shell
      }, function(code, stdout, stderr) {
        var e;
        try {
          return process.env = JSON.parse(stdout);
        } catch (_error) {
          e = _error;
        }
      });
      atom.commands.add('atom-workspace', {
        "cli-status:toggle-output": (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
      return atom.commands.add(this.cmdEditor.element, {
        'core:confirm': (function(_this) {
          return function() {
            var args, inputCmd;
            inputCmd = _this.cmdEditor.getModel().getText();
            _this.cliOutput.append("\n$>" + inputCmd + "\n");
            _this.scrollToBottom();
            args = [];
            inputCmd.replace(/("[^"]*"|'[^']*'|[^\s'"]+)/g, function(s) {
              if (s[0] !== '"' && s[0] !== "'") {
                s = s.replace(/~/g, _this.userHome);
              }
              return args.push(s);
            });
            cmd = args.shift();
            if (cmd === 'cd') {
              return _this.cd(args);
            }
            if (cmd === 'ls' && atom.config.get('terminal-panel.overrideLs')) {
              return _this.ls(args);
            }
            if (cmd === 'clear') {
              _this.cliOutput.empty();
              _this.message('\n');
              return _this.cmdEditor.setText('');
            }
            return _this.spawn(inputCmd, cmd, args);
          };
        })(this)
      });
    };

    CommandOutputView.prototype.showCmd = function() {
      this.cmdEditor.show();
      this.cmdEditor.css('visibility', '');
      this.cmdEditor.getModel().selectAll();
      if (atom.config.get('terminal-panel.clearCommandInput')) {
        this.cmdEditor.setText('');
      }
      this.cmdEditor.focus();
      return this.scrollToBottom();
    };

    CommandOutputView.prototype.scrollToBottom = function() {
      return this.cliOutput.scrollTop(10000000);
    };

    CommandOutputView.prototype.flashIconClass = function(className, time) {
      var onStatusOut;
      if (time == null) {
        time = 100;
      }
      addClass(this.statusIcon, className);
      this.timer && clearTimeout(this.timer);
      onStatusOut = (function(_this) {
        return function() {
          return removeClass(_this.statusIcon, className);
        };
      })(this);
      return this.timer = setTimeout(onStatusOut, time);
    };

    CommandOutputView.prototype.destroy = function() {
      var _destroy;
      _destroy = (function(_this) {
        return function() {
          if (_this.hasParent()) {
            _this.close();
          }
          if (_this.statusIcon && _this.statusIcon.parentNode) {
            _this.statusIcon.parentNode.removeChild(_this.statusIcon);
          }
          return _this.statusView.removeCommandView(_this);
        };
      })(this);
      if (this.program) {
        this.program.once('exit', _destroy);
        return this.program.kill();
      } else {
        return _destroy();
      }
    };

    CommandOutputView.prototype.kill = function() {
      if (this.program) {
        return this.program.kill();
      }
    };

    CommandOutputView.prototype.open = function() {
      this.lastLocation = atom.workspace.getActivePane();
      if (!this.hasParent()) {
        this.panel = atom.workspace.addBottomPanel({
          item: this
        });
      }
      if (lastOpenedView && lastOpenedView !== this) {
        lastOpenedView.close();
      }
      lastOpenedView = this;
      this.scrollToBottom();
      this.statusView.setActiveCommandView(this);
      this.cmdEditor.focus();
      this.cliOutput.css('font-family', atom.config.get('editor.fontFamily'));
      this.cliOutput.css('font-size', atom.config.get('editor.fontSize') + 'px');
      return this.cliOutput.css('max-height', atom.config.get('terminal-panel.windowHeight') + 'vh');
    };

    CommandOutputView.prototype.close = function() {
      this.lastLocation.activate();
      this.detach();
      this.panel.destroy();
      return lastOpenedView = null;
    };

    CommandOutputView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    CommandOutputView.prototype.cd = function(args) {
      var dir;
      if (!args[0]) {
        args = [atom.project.path];
      }
      dir = resolve(this.getCwd(), args[0]);
      return fs.stat(dir, (function(_this) {
        return function(err, stat) {
          if (err) {
            if (err.code === 'ENOENT') {
              return _this.errorMessage("cd: " + args[0] + ": No such file or directory");
            }
            return _this.errorMessage(err.message);
          }
          if (!stat.isDirectory()) {
            return _this.errorMessage("cd: not a directory: " + args[0]);
          }
          _this.cwd = dir;
          return _this.message("cwd: " + _this.cwd);
        };
      })(this));
    };

    CommandOutputView.prototype.ls = function(args) {
      var files, filesBlocks;
      files = fs.readdirSync(this.getCwd());
      filesBlocks = [];
      files.forEach((function(_this) {
        return function(filename) {
          return filesBlocks.push(_this._fileInfoHtml(filename, _this.getCwd()));
        };
      })(this));
      filesBlocks = filesBlocks.sort(function(a, b) {
        var aDir, bDir;
        aDir = a[1].isDirectory();
        bDir = b[1].isDirectory();
        if (aDir && !bDir) {
          return -1;
        }
        if (!aDir && bDir) {
          return 1;
        }
        return a[2] > b[2] && 1 || -1;
      });
      filesBlocks = filesBlocks.map(function(b) {
        return b[0];
      });
      return this.message(filesBlocks.join('') + '<div class="clear"/>');
    };

    CommandOutputView.prototype._fileInfoHtml = function(filename, parent) {
      var classes, filepath, stat;
      classes = ['icon', 'file-info'];
      filepath = parent + '/' + filename;
      stat = fs.lstatSync(filepath);
      if (stat.isSymbolicLink()) {
        classes.push('stat-link');
        stat = fs.statSync(filepath);
      }
      if (stat.isFile()) {
        if (stat.mode & 73) {
          classes.push('stat-program');
        }
        classes.push('icon-file-text');
      }
      if (stat.isDirectory()) {
        classes.push('icon-file-directory');
      }
      if (stat.isCharacterDevice()) {
        classes.push('stat-char-dev');
      }
      if (stat.isFIFO()) {
        classes.push('stat-fifo');
      }
      if (stat.isSocket()) {
        classes.push('stat-sock');
      }
      if (filename[0] === '.') {
        classes.push('status-ignored');
      }
      return ["<span class=\"" + (classes.join(' ')) + "\">" + filename + "</span>", stat, filename];
    };

    CommandOutputView.prototype.getGitStatusName = function(path, gitRoot, repo) {
      var status;
      status = (repo.getCachedPathStatus || repo.getPathStatus)(path);
      if (status) {
        if (repo.isStatusModified(status)) {
          return 'modified';
        }
        if (repo.isStatusNew(status)) {
          return 'added';
        }
      }
      if (repo.isPathIgnore(path)) {
        return 'ignored';
      }
    };

    CommandOutputView.prototype.message = function(message) {
      this.cliOutput.append(message);
      this.showCmd();
      removeClass(this.statusIcon, 'status-error');
      return addClass(this.statusIcon, 'status-success');
    };

    CommandOutputView.prototype.errorMessage = function(message) {
      this.cliOutput.append(message);
      this.showCmd();
      removeClass(this.statusIcon, 'status-success');
      return addClass(this.statusIcon, 'status-error');
    };

    CommandOutputView.prototype.getCwd = function() {
      var extFile, projectDir;
      extFile = extname(atom.project.getPaths()[0]);
      if (extFile === "") {
        if (atom.project.getPaths()[0]) {
          projectDir = atom.project.getPaths()[0];
        } else {
          if (process.env.HOME) {
            projectDir = process.env.HOME;
          } else if (process.env.USERPROFILE) {
            projectDir = process.env.USERPROFILE;
          } else {
            projectDir = '/';
          }
        }
      } else {
        projectDir = dirname(atom.project.getPaths()[0]);
      }
      return this.cwd || projectDir || this.userHome;
    };

    CommandOutputView.prototype.spawn = function(inputCmd, cmd, args) {
      var err, htmlStream, shell;
      this.cmdEditor.css('visibility', 'hidden');
      htmlStream = ansihtml();
      htmlStream.on('data', (function(_this) {
        return function(data) {
          _this.cliOutput.append(data);
          return _this.scrollToBottom();
        };
      })(this));
      shell = atom.config.get('terminal-panel.shell');
      try {
        this.program = exec(inputCmd, {
          stdio: 'pipe',
          env: process.env,
          cwd: this.getCwd(),
          shell: shell
        });
        this.program.stdout.pipe(htmlStream);
        this.program.stderr.pipe(htmlStream);
        removeClass(this.statusIcon, 'status-success');
        removeClass(this.statusIcon, 'status-error');
        addClass(this.statusIcon, 'status-running');
        this.killBtn.removeClass('hide');
        this.program.once('exit', (function(_this) {
          return function(code) {
            if (atom.config.get('terminal-panel.logConsole')) {
              console.log('exit', code);
            }
            _this.killBtn.addClass('hide');
            removeClass(_this.statusIcon, 'status-running');
            _this.program = null;
            addClass(_this.statusIcon, code === 0 && 'status-success' || 'status-error');
            return _this.showCmd();
          };
        })(this));
        this.program.on('error', (function(_this) {
          return function(err) {
            if (atom.config.get('terminal-panel.logConsole')) {
              console.log('error');
            }
            _this.cliOutput.append(err.message);
            _this.showCmd();
            return addClass(_this.statusIcon, 'status-error');
          };
        })(this));
        this.program.stdout.on('data', (function(_this) {
          return function() {
            _this.flashIconClass('status-info');
            return removeClass(_this.statusIcon, 'status-error');
          };
        })(this));
        return this.program.stderr.on('data', (function(_this) {
          return function() {
            if (atom.config.get('terminal-panel.logConsole')) {
              console.log('stderr');
            }
            return _this.flashIconClass('status-error', 300);
          };
        })(this));
      } catch (_error) {
        err = _error;
        this.cliOutput.append(err.message);
        return this.showCmd();
      }
    };

    return CommandOutputView;

  })(View);

}).call(this);
