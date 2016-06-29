'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

exports['default'] = {
  config: require('./config'),

  activate: function activate() {
    var _this = this;

    if (!/^win/.test(process.platform)) {
      // Manually append /usr/local/bin as it may not be set on some systems,
      // and it's common to have node installed here. Keep it at end so it won't
      // accidentially override any other node installation
      process.env.PATH += ':/usr/local/bin';
    }

    this.instancedTools = {}; // Ordered by project path
    this.targets = {};
    this.activeTarget = {};
    this.targetsLoading = {};
    this.targetsSubscriptions = {};
    this.tools = [require('./atom-build')];
    this.linter = null;

    var BuildView = require('./build-view');
    this.buildView = new BuildView();

    var ErrorMatcher = require('./error-matcher');
    this.errorMatcher = new ErrorMatcher();
    this.errorMatcher.on('error', function (message) {
      atom.notifications.addError('Error matching failed!', { detail: message });
    });
    this.errorMatcher.on('matched', function (match) {
      _this.buildView.scrollTo(match[0]);
    });

    atom.commands.add('atom-workspace', 'build:refresh-targets', function () {
      return _this.refreshTargets();
    });
    atom.commands.add('atom-workspace', 'build:trigger', function () {
      return _this.build('trigger');
    });
    atom.commands.add('atom-workspace', 'build:select-active-target', function () {
      return _this.selectActiveTarget();
    });
    atom.commands.add('atom-workspace', 'build:stop', function () {
      return _this.stop();
    });
    atom.commands.add('atom-workspace', 'build:confirm', function () {
      require('./google-analytics').sendEvent('build', 'confirmed');
      document.activeElement.click();
    });
    atom.commands.add('atom-workspace', 'build:no-confirm', function () {
      if (_this.saveConfirmView) {
        require('./google-analytics').sendEvent('build', 'not confirmed');
        _this.saveConfirmView.cancel();
      }
    });

    atom.workspace.observeTextEditors(function (editor) {
      editor.onDidSave(function () {
        if (atom.config.get('build.buildOnSave')) {
          _this.build('save');
        }
      });
    });

    atom.workspace.onDidChangeActivePaneItem(function () {
      return _this.updateStatusBar();
    });
    atom.packages.onDidActivateInitialPackages(function () {
      return _this.refreshTargets();
    });

    var projectPaths = atom.project.getPaths();
    atom.project.onDidChangePaths(function () {
      var addedPaths = atom.project.getPaths().filter(function (el) {
        return projectPaths.indexOf(el) === -1;
      });
      _this.refreshTargets(addedPaths);
      projectPaths = atom.project.getPaths();
    });
  },

  deactivate: function deactivate() {
    var _this2 = this;

    Object.keys(this.instancedTools).map(function (cwd) {
      return _this2.instancedTools[cwd].forEach(function (tool) {
        tool.removeAllListeners && tool.removeAllListeners('refresh');
        tool.destructor && tool.destructor();
      });
    });

    if (this.child) {
      this.child.removeAllListeners();
      require('tree-kill')(this.child.pid, 'SIGKILL');
      this.child = null;
    }

    this.statusBarView && this.statusBarView.destroy();
    this.buildView && this.buildView.destroy();
    this.linter && this.linter.dispose();

    clearTimeout(this.finishedTimer);
  },

  updateStatusBar: function updateStatusBar() {
    var activeTarget = this.activeTarget[require('./utils').activePath()];
    this.statusBarView && this.statusBarView.setTarget(activeTarget);
  },

  refreshTargets: function refreshTargets(refreshPaths) {
    var _this3 = this;

    refreshPaths = refreshPaths || atom.project.getPaths();

    var pathPromise = refreshPaths.map(function (p) {
      _this3.targetsLoading[p] = true;
      _this3.targets[p] = _this3.targets[p] || [];

      _this3.instancedTools[p] = (_this3.instancedTools[p] || []).map(function (t) {
        return t.removeAllListeners && t.removeAllListeners('refresh');
      }).filter(function () {
        return false;
      }); // Just empty the array

      var settingsPromise = _this3.tools.map(function (Tool) {
        return new Tool(p);
      }).filter(function (tool) {
        return tool.isEligible();
      }).map(function (tool) {
        _this3.instancedTools[p].push(tool);
        require('./google-analytics').sendEvent('build', 'tool eligible', tool.getNiceName());

        tool.on && tool.on('refresh', _this3.refreshTargets.bind(_this3, [p]));
        return Promise.resolve().then(function () {
          return tool.settings();
        })['catch'](function (err) {
          if (err instanceof SyntaxError) {
            atom.notifications.addError('Invalid build file.', {
              detail: 'You have a syntax error in your build file: ' + err.message,
              dismissable: true
            });
          } else {
            atom.notifications.addError('Ooops. Something went wrong.', {
              detail: err.message + (err.stack ? '\n' + err.stack : ''),
              dismissable: true
            });
          }
        });
      });

      var CompositeDisposable = require('atom').CompositeDisposable;
      return Promise.all(settingsPromise).then(function (settings) {
        settings = require('./utils').uniquifySettings([].concat.apply([], settings).filter(Boolean).map(function (setting) {
          return require('./utils').getDefaultSettings(p, setting);
        }));

        if (null === _this3.activeTarget[p] || !settings.find(function (s) {
          return s.name === _this3.activeTarget[p];
        })) {
          /* Active target has been removed or not set. Set it to the highest prio target */
          _this3.activeTarget[p] = settings[0] ? settings[0].name : undefined;
        }

        // CompositeDisposable cannot be reused, so we must create a new instance on every refresh
        _this3.targetsSubscriptions[p] && _this3.targetsSubscriptions[p].dispose();
        _this3.targetsSubscriptions[p] = new CompositeDisposable();

        settings.forEach(function (setting, index) {
          if (setting.keymap && !setting.atomCommandName) {
            setting.atomCommandName = 'build:trigger:' + setting.name;
          }
          var subscriptions = new CompositeDisposable();
          subscriptions.add(atom.commands.add('atom-workspace', setting.atomCommandName, _this3.build.bind(_this3, 'trigger')));

          if (setting.keymap) {
            require('./google-analytics').sendEvent('keymap', 'registered', setting.keymap);
            var keymapSpec = { 'atom-workspace, atom-text-editor': {} };
            keymapSpec['atom-workspace, atom-text-editor'][setting.keymap] = setting.atomCommandName;
            subscriptions.add(atom.keymaps.add(setting.name, keymapSpec));
          }

          _this3.targetsSubscriptions[p].add(subscriptions);
        });

        _this3.targets[p] = settings;
        _this3.targetsLoading[p] = false;
        _this3.fillTargets();
        _this3.updateStatusBar();
      });
    });

    Promise.all(pathPromise).then(function (entries) {
      if (entries.length === 0) {
        return;
      }

      if (atom.config.get('build.notificationOnRefresh')) {
        var rows = refreshPaths.map(function (p) {
          return _this3.targets[p].length + ' targets at: ' + p;
        });
        atom.notifications.addInfo('Build targets parsed.', {
          detail: rows.join('\n')
        });
      }
    });
  },

  fillTargets: function fillTargets() {
    if (this.targetsView) {
      var p = require('./utils').activePath();
      this.targetsView.setActiveTarget(this.activeTarget[p]);
      this.targetsView.setItems((this.targets[p] || []).map(function (target) {
        return target.name;
      }));
    }
  },

  selectActiveTarget: function selectActiveTarget() {
    var _this4 = this;

    var p = require('./utils').activePath();
    var TargetsView = require('./targets-view');
    this.targetsView = new TargetsView();

    if (this.targetsLoading[p]) {
      this.targetsView.setLoading('Loading project build targets…');
    } else {
      this.fillTargets();
    }

    this.targetsView.awaitSelection().then(function (newTarget) {
      _this4.activeTarget[p] = newTarget;
      _this4.updateStatusBar();

      if (atom.config.get('build.selectTriggers')) {
        var workspaceElement = atom.views.getView(atom.workspace);
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      }
      _this4.targetsView = null;
    })['catch'](function (err) {
      _this4.targetsView = null;
      _this4.targetsView.setError(err.message);
    });
  },

  startNewBuild: function startNewBuild(source, atomCommandName) {
    var _this5 = this;

    var BuildError = require('./build-error');
    var p = require('./utils').activePath();
    var buildTitle = '';
    this.linter && this.linter.deleteMessages();

    Promise.resolve(this.targets[p]).then(function (targets) {
      if (!targets || 0 === targets.length) {
        throw new BuildError('No eligible build target.', 'No configuration to build this project exists.');
      }

      var target = targets.find(function (t) {
        return t.atomCommandName === atomCommandName;
      });
      if (!target) {
        (function () {
          var targetName = _this5.activeTarget[p];
          target = targets.find(function (t) {
            return t.name === targetName;
          });
        })();
      }
      require('./google-analytics').sendEvent('build', 'triggered');

      if (!target.exec) {
        throw new BuildError('Invalid build file.', 'No executable command specified.');
      }

      _this5.statusBarView && _this5.statusBarView.buildStarted();
      _this5.buildView.buildStarted();
      _this5.buildView.setHeading('Running preBuild...');

      return Promise.resolve(target.preBuild ? target.preBuild() : null).then(function () {
        return target;
      });
    }).then(function (target) {
      var replace = require('./utils').replace;
      var env = Object.assign({}, process.env, target.env);
      Object.keys(env).forEach(function (key) {
        env[key] = replace(env[key], target.env);
      });

      var exec = replace(target.exec, target.env);
      var args = target.args.map(function (arg) {
        return replace(arg, target.env);
      });
      var cwd = replace(target.cwd, target.env);
      var isWin = process.platform === 'win32';
      var shCmd = isWin ? 'cmd' : '/bin/sh';
      var shCmdArg = isWin ? '/C' : '-c';

      // Store this as we need to re-set it after postBuild
      buildTitle = [target.sh ? shCmd + ' ' + shCmdArg + ' ' + exec : exec].concat(_toConsumableArray(args), ['\n']).join(' ');

      _this5.buildView.setHeading(buildTitle);
      if (target.sh) {
        _this5.child = require('child_process').spawn(shCmd, [shCmdArg, [exec].concat(args).join(' ')], { cwd: cwd, env: env });
      } else {
        _this5.child = require('cross-spawn-async').spawn(exec, args, { cwd: cwd, env: env });
      }

      var stdout = '';
      var stderr = '';
      _this5.child.stdout.setEncoding('utf8');
      _this5.child.stderr.setEncoding('utf8');
      _this5.child.stdout.on('data', function (d) {
        return stdout += d;
      });
      _this5.child.stderr.on('data', function (d) {
        return stderr += d;
      });
      _this5.child.stdout.pipe(_this5.buildView.terminal);
      _this5.child.stderr.pipe(_this5.buildView.terminal);

      _this5.child.on('error', function (err) {
        _this5.buildView.terminal.write((target.sh ? 'Unable to execute with shell: ' : 'Unable to execute: ') + exec + '\n');

        if (/\s/.test(exec) && !target.sh) {
          _this5.buildView.terminal.write('`cmd` cannot contain space. Use `args` for arguments.\n');
        }

        if ('ENOENT' === err.code) {
          _this5.buildView.terminal.write('Make sure cmd:\'' + exec + '\' and cwd:\'' + cwd + '\' exists and have correct access permissions.\n');
          _this5.buildView.terminal.write('Binaries are found in these folders: ' + process.env.PATH + '\n');
        }
      });

      _this5.child.on('close', function (exitCode) {
        _this5.child = null;
        _this5.errorMatcher.set(target.errorMatch, cwd, stdout + stderr);

        var success = 0 === exitCode;
        if (atom.config.get('build.matchedErrorFailsBuild')) {
          success = success && !_this5.errorMatcher.hasMatch();
        }

        var path = require('path');
        _this5.linter && _this5.linter.setMessages(_this5.errorMatcher.getMatches().map(function (match) {
          return {
            type: 'Error',
            text: match.message || 'Error from build',
            filePath: path.isAbsolute(match.file) ? match.file : path.join(cwd, match.file),
            range: [[(match.line || 1) - 1, (match.col || 1) - 1], [(match.line_end || match.line || 1) - 1, (match.col_end || match.col || 1) - 1]]
          };
        }));

        if (atom.config.get('build.beepWhenDone')) {
          atom.beep();
        }

        _this5.buildView.setHeading('Running postBuild...');
        return Promise.resolve(target.postBuild ? target.postBuild(success) : null).then(function () {
          _this5.buildView.setHeading(buildTitle);

          _this5.buildView.buildFinished(success);
          _this5.statusBarView && _this5.statusBarView.setBuildSuccess(success);
          if (success) {
            require('./google-analytics').sendEvent('build', 'succeeded');
            _this5.finishedTimer = setTimeout(function () {
              _this5.buildView.detach();
            }, 1200);
          } else {
            if (atom.config.get('build.scrollOnError')) {
              _this5.errorMatcher.matchFirst();
            }
            require('./google-analytics').sendEvent('build', 'failed');
          }
        });
      });
    })['catch'](function (err) {
      if (err instanceof BuildError) {
        if (source === 'save') {
          // If there is no eligible build tool, and cause of build was a save, stay quiet.
          return;
        }

        atom.notifications.addWarning(err.name, { detail: err.message });
      } else {
        atom.notifications.addError('Failed to build.', { detail: err.message });
      }
    });
  },

  abort: function abort(cb) {
    var _this6 = this;

    this.child.removeAllListeners('exit');
    this.child.removeAllListeners('close');
    this.child.on('exit', function () {
      _this6.child.removeAllListeners();
      _this6.child = null;
      cb && cb();
    });

    try {
      require('tree-kill')(this.child.pid, this.child.killed ? 'SIGKILL' : 'SIGTERM');
    } catch (e) {
      /* Something may have happened to the child (e.g. terminated by itself). Ignore this. */
    }

    this.child.killed = true;
  },

  build: function build(source, event) {
    var _this7 = this;

    clearTimeout(this.finishedTimer);

    this.doSaveConfirm(this.unsavedTextEditors(), function () {
      var next = _this7.startNewBuild.bind(_this7, source, event ? event.type : null);
      _this7.child ? _this7.abort(next) : next();
    });
  },

  doSaveConfirm: function doSaveConfirm(modifiedTextEditors, continuecb, cancelcb) {
    var saveAndContinue = function saveAndContinue(save) {
      modifiedTextEditors.forEach(function (textEditor) {
        return save && textEditor.save();
      });
      continuecb();
    };

    if (0 === modifiedTextEditors.length || atom.config.get('build.saveOnBuild')) {
      saveAndContinue(true);
      return;
    }

    if (this.saveConfirmView) {
      this.saveConfirmView.destroy();
    }

    var SaveConfirmView = require('./save-confirm-view');
    this.saveConfirmView = new SaveConfirmView();
    this.saveConfirmView.show(saveAndContinue, cancelcb);
  },

  unsavedTextEditors: function unsavedTextEditors() {
    return atom.workspace.getTextEditors().filter(function (textEditor) {
      return textEditor.isModified() && undefined !== textEditor.getPath();
    });
  },

  stop: function stop() {
    var _this8 = this;

    clearTimeout(this.finishedTimer);
    if (this.child) {
      if (!this.child.killed) {
        this.buildView.buildAbortInitiated();
      }
      this.abort(function () {
        _this8.buildView.buildAborted();
        _this8.statusBarView && _this8.statusBarView.buildAborted();
      });
    } else {
      this.buildView.reset();
    }
  },

  consumeLinterRegistry: function consumeLinterRegistry(registry) {
    this.linter = registry.register({ name: 'Build' });
  },

  consumeBuilder: function consumeBuilder(builder) {
    var _this9 = this;

    this.tools.push(builder);
    var Disposable = require('atom').Disposable;
    return new Disposable(function () {
      _this9.tools = _this9.tools.filter(function (tool) {
        return tool !== builder;
      });
    });
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    var _this10 = this;

    var StatusBarView = require('./status-bar-view');
    this.statusBarView = new StatusBarView(statusBar);
    this.statusBarView.onClick(function () {
      return _this10.selectActiveTarget();
    });
    this.statusBarView.attach();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvYnVpbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7OztxQkFFRztBQUNiLFFBQU0sRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDOztBQUUzQixVQUFRLEVBQUEsb0JBQUc7OztBQUNULFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTs7OztBQUlsQyxhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxpQkFBaUIsQ0FBQztLQUN2Qzs7QUFFRCxRQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUN6QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUN6QixRQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBRSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUUsQ0FBQztBQUN6QyxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbkIsUUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQzs7QUFFakMsUUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLE9BQU8sRUFBSztBQUN6QyxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVB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Q0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pCLFFBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDOUMsV0FBTyxJQUFJLFVBQVUsQ0FBQyxZQUFNO0FBQzFCLGFBQUssS0FBSyxHQUFHLE9BQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7ZUFBSSxJQUFJLEtBQUssT0FBTztPQUFBLENBQUMsQ0FBQztLQUMxRCxDQUFDLENBQUM7R0FDSjs7QUFFRCxrQkFBZ0IsRUFBQSwwQkFBQyxTQUFTLEVBQUU7OztBQUMxQixRQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNuRCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xELFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO2FBQU0sUUFBSyxrQkFBa0IsRUFBRTtLQUFBLENBQUMsQ0FBQztBQUM1RCxRQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQzdCO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9idWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzogcmVxdWlyZSgnLi9jb25maWcnKSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICBpZiAoIS9ed2luLy50ZXN0KHByb2Nlc3MucGxhdGZvcm0pKSB7XG4gICAgICAvLyBNYW51YWxseSBhcHBlbmQgL3Vzci9sb2NhbC9iaW4gYXMgaXQgbWF5IG5vdCBiZSBzZXQgb24gc29tZSBzeXN0ZW1zLFxuICAgICAgLy8gYW5kIGl0J3MgY29tbW9uIHRvIGhhdmUgbm9kZSBpbnN0YWxsZWQgaGVyZS4gS2VlcCBpdCBhdCBlbmQgc28gaXQgd29uJ3RcbiAgICAgIC8vIGFjY2lkZW50aWFsbHkgb3ZlcnJpZGUgYW55IG90aGVyIG5vZGUgaW5zdGFsbGF0aW9uXG4gICAgICBwcm9jZXNzLmVudi5QQVRIICs9ICc6L3Vzci9sb2NhbC9iaW4nO1xuICAgIH1cblxuICAgIHRoaXMuaW5zdGFuY2VkVG9vbHMgPSB7fTsgLy8gT3JkZXJlZCBieSBwcm9qZWN0IHBhdGhcbiAgICB0aGlzLnRhcmdldHMgPSB7fTtcbiAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IHt9O1xuICAgIHRoaXMudGFyZ2V0c0xvYWRpbmcgPSB7fTtcbiAgICB0aGlzLnRhcmdldHNTdWJzY3JpcHRpb25zID0ge307XG4gICAgdGhpcy50b29scyA9IFsgcmVxdWlyZSgnLi9hdG9tLWJ1aWxkJykgXTtcbiAgICB0aGlzLmxpbnRlciA9IG51bGw7XG5cbiAgICBjb25zdCBCdWlsZFZpZXcgPSByZXF1aXJlKCcuL2J1aWxkLXZpZXcnKTtcbiAgICB0aGlzLmJ1aWxkVmlldyA9IG5ldyBCdWlsZFZpZXcoKTtcblxuICAgIGNvbnN0IEVycm9yTWF0Y2hlciA9IHJlcXVpcmUoJy4vZXJyb3ItbWF0Y2hlcicpO1xuICAgIHRoaXMuZXJyb3JNYXRjaGVyID0gbmV3IEVycm9yTWF0Y2hlcigpO1xuICAgIHRoaXMuZXJyb3JNYXRjaGVyLm9uKCdlcnJvcicsIChtZXNzYWdlKSA9PiB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yIG1hdGNoaW5nIGZhaWxlZCEnLCB7IGRldGFpbDogbWVzc2FnZSB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmVycm9yTWF0Y2hlci5vbignbWF0Y2hlZCcsIChtYXRjaCkgPT4ge1xuICAgICAgdGhpcy5idWlsZFZpZXcuc2Nyb2xsVG8obWF0Y2hbMF0pO1xuICAgIH0pO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnJlZnJlc2gtdGFyZ2V0cycsICgpID0+IHRoaXMucmVmcmVzaFRhcmdldHMoKSk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnRyaWdnZXInLCAoKSA9PiB0aGlzLmJ1aWxkKCd0cmlnZ2VyJykpO1xuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdidWlsZDpzZWxlY3QtYWN0aXZlLXRhcmdldCcsICgpID0+IHRoaXMuc2VsZWN0QWN0aXZlVGFyZ2V0KCkpO1xuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdidWlsZDpzdG9wJywgKCkgPT4gdGhpcy5zdG9wKCkpO1xuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdidWlsZDpjb25maXJtJywgKCkgPT4ge1xuICAgICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdidWlsZCcsICdjb25maXJtZWQnKTtcbiAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgICB9KTtcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6bm8tY29uZmlybScsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNhdmVDb25maXJtVmlldykge1xuICAgICAgICByZXF1aXJlKCcuL2dvb2dsZS1hbmFseXRpY3MnKS5zZW5kRXZlbnQoJ2J1aWxkJywgJ25vdCBjb25maXJtZWQnKTtcbiAgICAgICAgdGhpcy5zYXZlQ29uZmlybVZpZXcuY2FuY2VsKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PiB7XG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLmJ1aWxkT25TYXZlJykpIHtcbiAgICAgICAgICB0aGlzLmJ1aWxkKCdzYXZlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoKSA9PiB0aGlzLnVwZGF0ZVN0YXR1c0JhcigpKTtcbiAgICBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVJbml0aWFsUGFja2FnZXMoKCkgPT4gdGhpcy5yZWZyZXNoVGFyZ2V0cygpKTtcblxuICAgIGxldCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocygoKSA9PiB7XG4gICAgICBjb25zdCBhZGRlZFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuZmlsdGVyKGVsID0+IHByb2plY3RQYXRocy5pbmRleE9mKGVsKSA9PT0gLTEpO1xuICAgICAgdGhpcy5yZWZyZXNoVGFyZ2V0cyhhZGRlZFBhdGhzKTtcbiAgICAgIHByb2plY3RQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgIH0pO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pbnN0YW5jZWRUb29scykubWFwKGN3ZCA9PiB0aGlzLmluc3RhbmNlZFRvb2xzW2N3ZF0uZm9yRWFjaCh0b29sID0+IHtcbiAgICAgIHRvb2wucmVtb3ZlQWxsTGlzdGVuZXJzICYmIHRvb2wucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZWZyZXNoJyk7XG4gICAgICB0b29sLmRlc3RydWN0b3IgJiYgdG9vbC5kZXN0cnVjdG9yKCk7XG4gICAgfSkpO1xuXG4gICAgaWYgKHRoaXMuY2hpbGQpIHtcbiAgICAgIHRoaXMuY2hpbGQucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgICByZXF1aXJlKCd0cmVlLWtpbGwnKSh0aGlzLmNoaWxkLnBpZCwgJ1NJR0tJTEwnKTtcbiAgICAgIHRoaXMuY2hpbGQgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdHVzQmFyVmlldyAmJiB0aGlzLnN0YXR1c0JhclZpZXcuZGVzdHJveSgpO1xuICAgIHRoaXMuYnVpbGRWaWV3ICYmIHRoaXMuYnVpbGRWaWV3LmRlc3Ryb3koKTtcbiAgICB0aGlzLmxpbnRlciAmJiB0aGlzLmxpbnRlci5kaXNwb3NlKCk7XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5maW5pc2hlZFRpbWVyKTtcbiAgfSxcblxuICB1cGRhdGVTdGF0dXNCYXIoKSB7XG4gICAgY29uc3QgYWN0aXZlVGFyZ2V0ID0gdGhpcy5hY3RpdmVUYXJnZXRbcmVxdWlyZSgnLi91dGlscycpLmFjdGl2ZVBhdGgoKV07XG4gICAgdGhpcy5zdGF0dXNCYXJWaWV3ICYmIHRoaXMuc3RhdHVzQmFyVmlldy5zZXRUYXJnZXQoYWN0aXZlVGFyZ2V0KTtcbiAgfSxcblxuICByZWZyZXNoVGFyZ2V0cyhyZWZyZXNoUGF0aHMpIHtcbiAgICByZWZyZXNoUGF0aHMgPSByZWZyZXNoUGF0aHMgfHwgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG5cbiAgICBjb25zdCBwYXRoUHJvbWlzZSA9IHJlZnJlc2hQYXRocy5tYXAoKHApID0+IHtcbiAgICAgIHRoaXMudGFyZ2V0c0xvYWRpbmdbcF0gPSB0cnVlO1xuICAgICAgdGhpcy50YXJnZXRzW3BdID0gdGhpcy50YXJnZXRzW3BdIHx8IFtdO1xuXG4gICAgICB0aGlzLmluc3RhbmNlZFRvb2xzW3BdID0gKHRoaXMuaW5zdGFuY2VkVG9vbHNbcF0gfHwgW10pXG4gICAgICAgIC5tYXAodCA9PiB0LnJlbW92ZUFsbExpc3RlbmVycyAmJiB0LnJlbW92ZUFsbExpc3RlbmVycygncmVmcmVzaCcpKVxuICAgICAgICAuZmlsdGVyKCgpID0+IGZhbHNlKTsgLy8gSnVzdCBlbXB0eSB0aGUgYXJyYXlcblxuICAgICAgY29uc3Qgc2V0dGluZ3NQcm9taXNlID0gdGhpcy50b29sc1xuICAgICAgICAubWFwKFRvb2wgPT4gbmV3IFRvb2wocCkpXG4gICAgICAgIC5maWx0ZXIodG9vbCA9PiB0b29sLmlzRWxpZ2libGUoKSlcbiAgICAgICAgLm1hcCh0b29sID0+IHtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlZFRvb2xzW3BdLnB1c2godG9vbCk7XG4gICAgICAgICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdidWlsZCcsICd0b29sIGVsaWdpYmxlJywgdG9vbC5nZXROaWNlTmFtZSgpKTtcblxuICAgICAgICAgIHRvb2wub24gJiYgdG9vbC5vbigncmVmcmVzaCcsIHRoaXMucmVmcmVzaFRhcmdldHMuYmluZCh0aGlzLCBbIHAgXSkpO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRvb2wuc2V0dGluZ3MoKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0ludmFsaWQgYnVpbGQgZmlsZS4nLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiAnWW91IGhhdmUgYSBzeW50YXggZXJyb3IgaW4geW91ciBidWlsZCBmaWxlOiAnICsgZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ09vb3BzLiBTb21ldGhpbmcgd2VudCB3cm9uZy4nLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiBlcnIubWVzc2FnZSArIChlcnIuc3RhY2sgPyAnXFxuJyArIGVyci5zdGFjayA6ICcnKSxcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IENvbXBvc2l0ZURpc3Bvc2FibGUgPSByZXF1aXJlKCdhdG9tJykuQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChzZXR0aW5nc1Byb21pc2UpLnRoZW4oKHNldHRpbmdzKSA9PiB7XG4gICAgICAgIHNldHRpbmdzID0gcmVxdWlyZSgnLi91dGlscycpLnVuaXF1aWZ5U2V0dGluZ3MoW10uY29uY2F0LmFwcGx5KFtdLCBzZXR0aW5ncylcbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgLm1hcChzZXR0aW5nID0+IHJlcXVpcmUoJy4vdXRpbHMnKS5nZXREZWZhdWx0U2V0dGluZ3MocCwgc2V0dGluZykpKTtcblxuICAgICAgICBpZiAobnVsbCA9PT0gdGhpcy5hY3RpdmVUYXJnZXRbcF0gfHwgIXNldHRpbmdzLmZpbmQocyA9PiBzLm5hbWUgPT09IHRoaXMuYWN0aXZlVGFyZ2V0W3BdKSkge1xuICAgICAgICAgIC8qIEFjdGl2ZSB0YXJnZXQgaGFzIGJlZW4gcmVtb3ZlZCBvciBub3Qgc2V0LiBTZXQgaXQgdG8gdGhlIGhpZ2hlc3QgcHJpbyB0YXJnZXQgKi9cbiAgICAgICAgICB0aGlzLmFjdGl2ZVRhcmdldFtwXSA9IHNldHRpbmdzWzBdID8gc2V0dGluZ3NbMF0ubmFtZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbXBvc2l0ZURpc3Bvc2FibGUgY2Fubm90IGJlIHJldXNlZCwgc28gd2UgbXVzdCBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb24gZXZlcnkgcmVmcmVzaFxuICAgICAgICB0aGlzLnRhcmdldHNTdWJzY3JpcHRpb25zW3BdICYmIHRoaXMudGFyZ2V0c1N1YnNjcmlwdGlvbnNbcF0uZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnRhcmdldHNTdWJzY3JpcHRpb25zW3BdID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgICAgICBzZXR0aW5ncy5mb3JFYWNoKChzZXR0aW5nLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChzZXR0aW5nLmtleW1hcCAmJiAhc2V0dGluZy5hdG9tQ29tbWFuZE5hbWUpIHtcbiAgICAgICAgICAgIHNldHRpbmcuYXRvbUNvbW1hbmROYW1lID0gYGJ1aWxkOnRyaWdnZXI6JHtzZXR0aW5nLm5hbWV9YDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgc2V0dGluZy5hdG9tQ29tbWFuZE5hbWUsIHRoaXMuYnVpbGQuYmluZCh0aGlzLCAndHJpZ2dlcicpKSk7XG5cbiAgICAgICAgICBpZiAoc2V0dGluZy5rZXltYXApIHtcbiAgICAgICAgICAgIHJlcXVpcmUoJy4vZ29vZ2xlLWFuYWx5dGljcycpLnNlbmRFdmVudCgna2V5bWFwJywgJ3JlZ2lzdGVyZWQnLCBzZXR0aW5nLmtleW1hcCk7XG4gICAgICAgICAgICBjb25zdCBrZXltYXBTcGVjID0geyAnYXRvbS13b3Jrc3BhY2UsIGF0b20tdGV4dC1lZGl0b3InOiB7fSB9O1xuICAgICAgICAgICAga2V5bWFwU3BlY1snYXRvbS13b3Jrc3BhY2UsIGF0b20tdGV4dC1lZGl0b3InXVtzZXR0aW5nLmtleW1hcF0gPSBzZXR0aW5nLmF0b21Db21tYW5kTmFtZTtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20ua2V5bWFwcy5hZGQoc2V0dGluZy5uYW1lLCBrZXltYXBTcGVjKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy50YXJnZXRzU3Vic2NyaXB0aW9uc1twXS5hZGQoc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudGFyZ2V0c1twXSA9IHNldHRpbmdzO1xuICAgICAgICB0aGlzLnRhcmdldHNMb2FkaW5nW3BdID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmlsbFRhcmdldHMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0dXNCYXIoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgUHJvbWlzZS5hbGwocGF0aFByb21pc2UpLnRoZW4oZW50cmllcyA9PiB7XG4gICAgICBpZiAoZW50cmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5ub3RpZmljYXRpb25PblJlZnJlc2gnKSkge1xuICAgICAgICBjb25zdCByb3dzID0gcmVmcmVzaFBhdGhzLm1hcChwID0+IGAke3RoaXMudGFyZ2V0c1twXS5sZW5ndGh9IHRhcmdldHMgYXQ6ICR7cH1gKTtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0J1aWxkIHRhcmdldHMgcGFyc2VkLicsIHtcbiAgICAgICAgICBkZXRhaWw6IHJvd3Muam9pbignXFxuJylcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZmlsbFRhcmdldHMoKSB7XG4gICAgaWYgKHRoaXMudGFyZ2V0c1ZpZXcpIHtcbiAgICAgIGNvbnN0IHAgPSByZXF1aXJlKCcuL3V0aWxzJykuYWN0aXZlUGF0aCgpO1xuICAgICAgdGhpcy50YXJnZXRzVmlldy5zZXRBY3RpdmVUYXJnZXQodGhpcy5hY3RpdmVUYXJnZXRbcF0pO1xuICAgICAgdGhpcy50YXJnZXRzVmlldy5zZXRJdGVtcygodGhpcy50YXJnZXRzW3BdIHx8IFtdKS5tYXAodGFyZ2V0ID0+IHRhcmdldC5uYW1lKSk7XG4gICAgfVxuICB9LFxuXG4gIHNlbGVjdEFjdGl2ZVRhcmdldCgpIHtcbiAgICBjb25zdCBwID0gcmVxdWlyZSgnLi91dGlscycpLmFjdGl2ZVBhdGgoKTtcbiAgICBjb25zdCBUYXJnZXRzVmlldyA9IHJlcXVpcmUoJy4vdGFyZ2V0cy12aWV3Jyk7XG4gICAgdGhpcy50YXJnZXRzVmlldyA9IG5ldyBUYXJnZXRzVmlldygpO1xuXG4gICAgaWYgKHRoaXMudGFyZ2V0c0xvYWRpbmdbcF0pIHtcbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcuc2V0TG9hZGluZygnTG9hZGluZyBwcm9qZWN0IGJ1aWxkIHRhcmdldHNcXHUyMDI2Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsbFRhcmdldHMoKTtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldHNWaWV3LmF3YWl0U2VsZWN0aW9uKCkudGhlbigobmV3VGFyZ2V0KSA9PiB7XG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldFtwXSA9IG5ld1RhcmdldDtcbiAgICAgIHRoaXMudXBkYXRlU3RhdHVzQmFyKCk7XG5cbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnNlbGVjdFRyaWdnZXJzJykpIHtcbiAgICAgICAgY29uc3Qgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcgPSBudWxsO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcgPSBudWxsO1xuICAgICAgdGhpcy50YXJnZXRzVmlldy5zZXRFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3RhcnROZXdCdWlsZChzb3VyY2UsIGF0b21Db21tYW5kTmFtZSkge1xuICAgIGNvbnN0IEJ1aWxkRXJyb3IgPSByZXF1aXJlKCcuL2J1aWxkLWVycm9yJyk7XG4gICAgY29uc3QgcCA9IHJlcXVpcmUoJy4vdXRpbHMnKS5hY3RpdmVQYXRoKCk7XG4gICAgbGV0IGJ1aWxkVGl0bGUgPSAnJztcbiAgICB0aGlzLmxpbnRlciAmJiB0aGlzLmxpbnRlci5kZWxldGVNZXNzYWdlcygpO1xuXG4gICAgUHJvbWlzZS5yZXNvbHZlKHRoaXMudGFyZ2V0c1twXSkudGhlbih0YXJnZXRzID0+IHtcbiAgICAgIGlmICghdGFyZ2V0cyB8fCAwID09PSB0YXJnZXRzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgQnVpbGRFcnJvcignTm8gZWxpZ2libGUgYnVpbGQgdGFyZ2V0LicsICdObyBjb25maWd1cmF0aW9uIHRvIGJ1aWxkIHRoaXMgcHJvamVjdCBleGlzdHMuJyk7XG4gICAgICB9XG5cbiAgICAgIGxldCB0YXJnZXQgPSB0YXJnZXRzLmZpbmQodCA9PiB0LmF0b21Db21tYW5kTmFtZSA9PT0gYXRvbUNvbW1hbmROYW1lKTtcbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIGNvbnN0IHRhcmdldE5hbWUgPSB0aGlzLmFjdGl2ZVRhcmdldFtwXTtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0cy5maW5kKHQgPT4gdC5uYW1lID09PSB0YXJnZXROYW1lKTtcbiAgICAgIH1cbiAgICAgIHJlcXVpcmUoJy4vZ29vZ2xlLWFuYWx5dGljcycpLnNlbmRFdmVudCgnYnVpbGQnLCAndHJpZ2dlcmVkJyk7XG5cbiAgICAgIGlmICghdGFyZ2V0LmV4ZWMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJ1aWxkRXJyb3IoJ0ludmFsaWQgYnVpbGQgZmlsZS4nLCAnTm8gZXhlY3V0YWJsZSBjb21tYW5kIHNwZWNpZmllZC4nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGF0dXNCYXJWaWV3ICYmIHRoaXMuc3RhdHVzQmFyVmlldy5idWlsZFN0YXJ0ZWQoKTtcbiAgICAgIHRoaXMuYnVpbGRWaWV3LmJ1aWxkU3RhcnRlZCgpO1xuICAgICAgdGhpcy5idWlsZFZpZXcuc2V0SGVhZGluZygnUnVubmluZyBwcmVCdWlsZC4uLicpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5wcmVCdWlsZCA/IHRhcmdldC5wcmVCdWlsZCgpIDogbnVsbCkudGhlbigoKSA9PiB0YXJnZXQpO1xuICAgIH0pLnRoZW4odGFyZ2V0ID0+IHtcbiAgICAgIGNvbnN0IHJlcGxhY2UgPSByZXF1aXJlKCcuL3V0aWxzJykucmVwbGFjZTtcbiAgICAgIGNvbnN0IGVudiA9IE9iamVjdC5hc3NpZ24oe30sIHByb2Nlc3MuZW52LCB0YXJnZXQuZW52KTtcbiAgICAgIE9iamVjdC5rZXlzKGVudikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBlbnZba2V5XSA9IHJlcGxhY2UoZW52W2tleV0sIHRhcmdldC5lbnYpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGV4ZWMgPSByZXBsYWNlKHRhcmdldC5leGVjLCB0YXJnZXQuZW52KTtcbiAgICAgIGNvbnN0IGFyZ3MgPSB0YXJnZXQuYXJncy5tYXAoYXJnID0+IHJlcGxhY2UoYXJnLCB0YXJnZXQuZW52KSk7XG4gICAgICBjb25zdCBjd2QgPSByZXBsYWNlKHRhcmdldC5jd2QsIHRhcmdldC5lbnYpO1xuICAgICAgY29uc3QgaXNXaW4gPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInO1xuICAgICAgY29uc3Qgc2hDbWQgPSBpc1dpbiA/ICdjbWQnIDogJy9iaW4vc2gnO1xuICAgICAgY29uc3Qgc2hDbWRBcmcgPSBpc1dpbiA/ICcvQycgOiAnLWMnO1xuXG4gICAgICAvLyBTdG9yZSB0aGlzIGFzIHdlIG5lZWQgdG8gcmUtc2V0IGl0IGFmdGVyIHBvc3RCdWlsZFxuICAgICAgYnVpbGRUaXRsZSA9IFsgKHRhcmdldC5zaCA/IGAke3NoQ21kfSAke3NoQ21kQXJnfSAke2V4ZWN9YCA6IGV4ZWMgKSwgLi4uYXJncywgJ1xcbiddLmpvaW4oJyAnKTtcblxuICAgICAgdGhpcy5idWlsZFZpZXcuc2V0SGVhZGluZyhidWlsZFRpdGxlKTtcbiAgICAgIGlmICh0YXJnZXQuc2gpIHtcbiAgICAgICAgdGhpcy5jaGlsZCA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bihcbiAgICAgICAgICBzaENtZCxcbiAgICAgICAgICBbIHNoQ21kQXJnLCBbIGV4ZWMgXS5jb25jYXQoYXJncykuam9pbignICcpXSxcbiAgICAgICAgICB7IGN3ZDogY3dkLCBlbnY6IGVudiB9XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNoaWxkID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24tYXN5bmMnKS5zcGF3bihcbiAgICAgICAgICBleGVjLFxuICAgICAgICAgIGFyZ3MsXG4gICAgICAgICAgeyBjd2Q6IGN3ZCwgZW52OiBlbnYgfVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBsZXQgc3Rkb3V0ID0gJyc7XG4gICAgICBsZXQgc3RkZXJyID0gJyc7XG4gICAgICB0aGlzLmNoaWxkLnN0ZG91dC5zZXRFbmNvZGluZygndXRmOCcpO1xuICAgICAgdGhpcy5jaGlsZC5zdGRlcnIuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgIHRoaXMuY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgZCA9PiAoc3Rkb3V0ICs9IGQpKTtcbiAgICAgIHRoaXMuY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZCA9PiAoc3RkZXJyICs9IGQpKTtcbiAgICAgIHRoaXMuY2hpbGQuc3Rkb3V0LnBpcGUodGhpcy5idWlsZFZpZXcudGVybWluYWwpO1xuICAgICAgdGhpcy5jaGlsZC5zdGRlcnIucGlwZSh0aGlzLmJ1aWxkVmlldy50ZXJtaW5hbCk7XG5cbiAgICAgIHRoaXMuY2hpbGQub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICB0aGlzLmJ1aWxkVmlldy50ZXJtaW5hbC53cml0ZSgodGFyZ2V0LnNoID8gJ1VuYWJsZSB0byBleGVjdXRlIHdpdGggc2hlbGw6ICcgOiAnVW5hYmxlIHRvIGV4ZWN1dGU6ICcpICsgZXhlYyArICdcXG4nKTtcblxuICAgICAgICBpZiAoL1xccy8udGVzdChleGVjKSAmJiAhdGFyZ2V0LnNoKSB7XG4gICAgICAgICAgdGhpcy5idWlsZFZpZXcudGVybWluYWwud3JpdGUoJ2BjbWRgIGNhbm5vdCBjb250YWluIHNwYWNlLiBVc2UgYGFyZ3NgIGZvciBhcmd1bWVudHMuXFxuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ0VOT0VOVCcgPT09IGVyci5jb2RlKSB7XG4gICAgICAgICAgdGhpcy5idWlsZFZpZXcudGVybWluYWwud3JpdGUoYE1ha2Ugc3VyZSBjbWQ6JyR7ZXhlY30nIGFuZCBjd2Q6JyR7Y3dkfScgZXhpc3RzIGFuZCBoYXZlIGNvcnJlY3QgYWNjZXNzIHBlcm1pc3Npb25zLlxcbmApO1xuICAgICAgICAgIHRoaXMuYnVpbGRWaWV3LnRlcm1pbmFsLndyaXRlKGBCaW5hcmllcyBhcmUgZm91bmQgaW4gdGhlc2UgZm9sZGVyczogJHtwcm9jZXNzLmVudi5QQVRIfVxcbmApO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jaGlsZC5vbignY2xvc2UnLCAoZXhpdENvZGUpID0+IHtcbiAgICAgICAgdGhpcy5jaGlsZCA9IG51bGw7XG4gICAgICAgIHRoaXMuZXJyb3JNYXRjaGVyLnNldCh0YXJnZXQuZXJyb3JNYXRjaCwgY3dkLCBzdGRvdXQgKyBzdGRlcnIpO1xuXG4gICAgICAgIGxldCBzdWNjZXNzID0gKDAgPT09IGV4aXRDb2RlKTtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYnVpbGQubWF0Y2hlZEVycm9yRmFpbHNCdWlsZCcpKSB7XG4gICAgICAgICAgc3VjY2VzcyA9IHN1Y2Nlc3MgJiYgIXRoaXMuZXJyb3JNYXRjaGVyLmhhc01hdGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgICB0aGlzLmxpbnRlciAmJiB0aGlzLmxpbnRlci5zZXRNZXNzYWdlcyh0aGlzLmVycm9yTWF0Y2hlci5nZXRNYXRjaGVzKCkubWFwKG1hdGNoID0+ICh7XG4gICAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgICB0ZXh0OiBtYXRjaC5tZXNzYWdlIHx8ICdFcnJvciBmcm9tIGJ1aWxkJyxcbiAgICAgICAgICBmaWxlUGF0aDogcGF0aC5pc0Fic29sdXRlKG1hdGNoLmZpbGUpID8gbWF0Y2guZmlsZSA6IHBhdGguam9pbihjd2QsIG1hdGNoLmZpbGUpLFxuICAgICAgICAgIHJhbmdlOiBbXG4gICAgICAgICAgICBbIChtYXRjaC5saW5lIHx8IDEpIC0gMSwgKG1hdGNoLmNvbCB8fCAxKSAtIDEgXSxcbiAgICAgICAgICAgIFsgKG1hdGNoLmxpbmVfZW5kIHx8IG1hdGNoLmxpbmUgfHwgMSkgLSAxLCAobWF0Y2guY29sX2VuZCB8fCBtYXRjaC5jb2wgfHwgMSkgLSAxIF1cbiAgICAgICAgICBdXG4gICAgICAgIH0pKSk7XG5cbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYnVpbGQuYmVlcFdoZW5Eb25lJykpIHtcbiAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnVpbGRWaWV3LnNldEhlYWRpbmcoJ1J1bm5pbmcgcG9zdEJ1aWxkLi4uJyk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGFyZ2V0LnBvc3RCdWlsZCA/IHRhcmdldC5wb3N0QnVpbGQoc3VjY2VzcykgOiBudWxsKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmJ1aWxkVmlldy5zZXRIZWFkaW5nKGJ1aWxkVGl0bGUpO1xuXG4gICAgICAgICAgdGhpcy5idWlsZFZpZXcuYnVpbGRGaW5pc2hlZChzdWNjZXNzKTtcbiAgICAgICAgICB0aGlzLnN0YXR1c0JhclZpZXcgJiYgdGhpcy5zdGF0dXNCYXJWaWV3LnNldEJ1aWxkU3VjY2VzcyhzdWNjZXNzKTtcbiAgICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdidWlsZCcsICdzdWNjZWVkZWQnKTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmJ1aWxkVmlldy5kZXRhY2goKTtcbiAgICAgICAgICAgIH0sIDEyMDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5zY3JvbGxPbkVycm9yJykpIHtcbiAgICAgICAgICAgICAgdGhpcy5lcnJvck1hdGNoZXIubWF0Y2hGaXJzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdidWlsZCcsICdmYWlsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEJ1aWxkRXJyb3IpIHtcbiAgICAgICAgaWYgKHNvdXJjZSA9PT0gJ3NhdmUnKSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gZWxpZ2libGUgYnVpbGQgdG9vbCwgYW5kIGNhdXNlIG9mIGJ1aWxkIHdhcyBhIHNhdmUsIHN0YXkgcXVpZXQuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoZXJyLm5hbWUsIHsgZGV0YWlsOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRmFpbGVkIHRvIGJ1aWxkLicsIHsgZGV0YWlsOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBhYm9ydChjYikge1xuICAgIHRoaXMuY2hpbGQucmVtb3ZlQWxsTGlzdGVuZXJzKCdleGl0Jyk7XG4gICAgdGhpcy5jaGlsZC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2Nsb3NlJyk7XG4gICAgdGhpcy5jaGlsZC5vbignZXhpdCcsICgpID0+IHtcbiAgICAgIHRoaXMuY2hpbGQucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmNoaWxkID0gbnVsbDtcbiAgICAgIGNiICYmIGNiKCk7XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgcmVxdWlyZSgndHJlZS1raWxsJykodGhpcy5jaGlsZC5waWQsIHRoaXMuY2hpbGQua2lsbGVkID8gJ1NJR0tJTEwnIDogJ1NJR1RFUk0nKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKiBTb21ldGhpbmcgbWF5IGhhdmUgaGFwcGVuZWQgdG8gdGhlIGNoaWxkIChlLmcuIHRlcm1pbmF0ZWQgYnkgaXRzZWxmKS4gSWdub3JlIHRoaXMuICovXG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZC5raWxsZWQgPSB0cnVlO1xuICB9LFxuXG4gIGJ1aWxkKHNvdXJjZSwgZXZlbnQpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5maW5pc2hlZFRpbWVyKTtcblxuICAgIHRoaXMuZG9TYXZlQ29uZmlybSh0aGlzLnVuc2F2ZWRUZXh0RWRpdG9ycygpLCAoKSA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0gdGhpcy5zdGFydE5ld0J1aWxkLmJpbmQodGhpcywgc291cmNlLCBldmVudCA/IGV2ZW50LnR5cGUgOiBudWxsKTtcbiAgICAgIHRoaXMuY2hpbGQgPyB0aGlzLmFib3J0KG5leHQpIDogbmV4dCgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGRvU2F2ZUNvbmZpcm0obW9kaWZpZWRUZXh0RWRpdG9ycywgY29udGludWVjYiwgY2FuY2VsY2IpIHtcbiAgICBjb25zdCBzYXZlQW5kQ29udGludWUgPSAoc2F2ZSkgPT4ge1xuICAgICAgbW9kaWZpZWRUZXh0RWRpdG9ycy5mb3JFYWNoKCh0ZXh0RWRpdG9yKSA9PiBzYXZlICYmIHRleHRFZGl0b3Iuc2F2ZSgpKTtcbiAgICAgIGNvbnRpbnVlY2IoKTtcbiAgICB9O1xuXG4gICAgaWYgKDAgPT09IG1vZGlmaWVkVGV4dEVkaXRvcnMubGVuZ3RoIHx8IGF0b20uY29uZmlnLmdldCgnYnVpbGQuc2F2ZU9uQnVpbGQnKSkge1xuICAgICAgc2F2ZUFuZENvbnRpbnVlKHRydWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNhdmVDb25maXJtVmlldykge1xuICAgICAgdGhpcy5zYXZlQ29uZmlybVZpZXcuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGNvbnN0IFNhdmVDb25maXJtVmlldyA9IHJlcXVpcmUoJy4vc2F2ZS1jb25maXJtLXZpZXcnKTtcbiAgICB0aGlzLnNhdmVDb25maXJtVmlldyA9IG5ldyBTYXZlQ29uZmlybVZpZXcoKTtcbiAgICB0aGlzLnNhdmVDb25maXJtVmlldy5zaG93KHNhdmVBbmRDb250aW51ZSwgY2FuY2VsY2IpO1xuICB9LFxuXG4gIHVuc2F2ZWRUZXh0RWRpdG9ycygpIHtcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5maWx0ZXIoKHRleHRFZGl0b3IpID0+IHtcbiAgICAgIHJldHVybiB0ZXh0RWRpdG9yLmlzTW9kaWZpZWQoKSAmJiAodW5kZWZpbmVkICE9PSB0ZXh0RWRpdG9yLmdldFBhdGgoKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3RvcCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5maW5pc2hlZFRpbWVyKTtcbiAgICBpZiAodGhpcy5jaGlsZCkge1xuICAgICAgaWYgKCF0aGlzLmNoaWxkLmtpbGxlZCkge1xuICAgICAgICB0aGlzLmJ1aWxkVmlldy5idWlsZEFib3J0SW5pdGlhdGVkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmFib3J0KCgpID0+IHtcbiAgICAgICAgdGhpcy5idWlsZFZpZXcuYnVpbGRBYm9ydGVkKCk7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyVmlldyAmJiB0aGlzLnN0YXR1c0JhclZpZXcuYnVpbGRBYm9ydGVkKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idWlsZFZpZXcucmVzZXQoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29uc3VtZUxpbnRlclJlZ2lzdHJ5KHJlZ2lzdHJ5KSB7XG4gICAgdGhpcy5saW50ZXIgPSByZWdpc3RyeS5yZWdpc3Rlcih7IG5hbWU6ICdCdWlsZCcgfSk7XG4gIH0sXG5cbiAgY29uc3VtZUJ1aWxkZXIoYnVpbGRlcikge1xuICAgIHRoaXMudG9vbHMucHVzaChidWlsZGVyKTtcbiAgICBjb25zdCBEaXNwb3NhYmxlID0gcmVxdWlyZSgnYXRvbScpLkRpc3Bvc2FibGU7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIHRoaXMudG9vbHMgPSB0aGlzLnRvb2xzLmZpbHRlcih0b29sID0+IHRvb2wgIT09IGJ1aWxkZXIpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyKSB7XG4gICAgY29uc3QgU3RhdHVzQmFyVmlldyA9IHJlcXVpcmUoJy4vc3RhdHVzLWJhci12aWV3Jyk7XG4gICAgdGhpcy5zdGF0dXNCYXJWaWV3ID0gbmV3IFN0YXR1c0JhclZpZXcoc3RhdHVzQmFyKTtcbiAgICB0aGlzLnN0YXR1c0JhclZpZXcub25DbGljaygoKSA9PiB0aGlzLnNlbGVjdEFjdGl2ZVRhcmdldCgpKTtcbiAgICB0aGlzLnN0YXR1c0JhclZpZXcuYXR0YWNoKCk7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/naver/.atom/packages/build/lib/build.js
