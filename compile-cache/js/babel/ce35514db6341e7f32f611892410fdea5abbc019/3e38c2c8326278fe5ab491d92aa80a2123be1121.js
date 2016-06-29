Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

'use babel';

var TargetManager = (function (_EventEmitter) {
  _inherits(TargetManager, _EventEmitter);

  function TargetManager() {
    var _this = this;

    _classCallCheck(this, TargetManager);

    _get(Object.getPrototypeOf(TargetManager.prototype), 'constructor', this).call(this);

    var projectPaths = atom.project.getPaths();

    this.pathTargets = projectPaths.map(function (path) {
      return _this._defaultPathTarget(path);
    });

    atom.project.onDidChangePaths(function (newProjectPaths) {
      var addedPaths = newProjectPaths.filter(function (el) {
        return projectPaths.indexOf(el) === -1;
      });
      var removedPaths = projectPaths.filter(function (el) {
        return newProjectPaths.indexOf(el) === -1;
      });
      addedPaths.forEach(function (path) {
        return _this.pathTargets.push(_this._defaultPathTarget(path));
      });
      _this.pathTargets = _this.pathTargets.filter(function (pt) {
        return -1 === removedPaths.indexOf(pt.path);
      });
      _this.refreshTargets(addedPaths);
      projectPaths = newProjectPaths;
    });

    atom.commands.add('atom-workspace', 'build:refresh-targets', function () {
      return _this.refreshTargets();
    });
    atom.commands.add('atom-workspace', 'build:select-active-target', function () {
      return _this.selectActiveTarget();
    });
  }

  _createClass(TargetManager, [{
    key: 'setBusyRegistry',
    value: function setBusyRegistry(registry) {
      this.busyRegistry = registry;
    }
  }, {
    key: '_defaultPathTarget',
    value: function _defaultPathTarget(path) {
      var CompositeDisposable = require('atom').CompositeDisposable;
      return {
        path: path,
        loading: false,
        targets: [],
        instancedTools: [],
        activeTarget: null,
        tools: [],
        subscriptions: new CompositeDisposable()
      };
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.pathTargets.forEach(function (pathTarget) {
        return pathTarget.tools.map(function (tool) {
          tool.removeAllListeners && tool.removeAllListeners('refresh');
          tool.destructor && tool.destructor();
        });
      });
    }
  }, {
    key: 'setTools',
    value: function setTools(tools) {
      this.tools = tools || [];
    }
  }, {
    key: 'refreshTargets',
    value: function refreshTargets(refreshPaths) {
      var _this2 = this;

      refreshPaths = refreshPaths || atom.project.getPaths();

      this.busyRegistry && this.busyRegistry.begin('build.refresh-targets', 'Refreshing targets for ' + refreshPaths.join(','));
      var pathPromises = refreshPaths.map(function (path) {
        var pathTarget = _this2.pathTargets.find(function (pt) {
          return pt.path === path;
        });
        pathTarget.loading = true;

        pathTarget.instancedTools = pathTarget.instancedTools.map(function (t) {
          return t.removeAllListeners && t.removeAllListeners('refresh');
        }).filter(function () {
          return false;
        }); // Just empty the array

        var settingsPromise = _this2.tools.map(function (Tool) {
          return new Tool(path);
        }).filter(function (tool) {
          return tool.isEligible();
        }).map(function (tool) {
          pathTarget.instancedTools.push(tool);
          require('./google-analytics').sendEvent('build', 'tool eligible', tool.getNiceName());

          tool.on && tool.on('refresh', _this2.refreshTargets.bind(_this2, [path]));
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
            return require('./utils').getDefaultSettings(path, setting);
          }));

          if (null === pathTarget.activeTarget || !settings.find(function (s) {
            return s.name === pathTarget.activeTarget;
          })) {
            /* Active target has been removed or not set. Set it to the highest prio target */
            pathTarget.activeTarget = settings[0] ? settings[0].name : undefined;
          }

          // CompositeDisposable cannot be reused, so we must create a new instance on every refresh
          pathTarget.subscriptions.dispose();
          pathTarget.subscriptions = new CompositeDisposable();

          settings.forEach(function (setting, index) {
            if (setting.keymap && !setting.atomCommandName) {
              setting.atomCommandName = 'build:trigger:' + setting.name;
            }

            pathTarget.subscriptions.add(atom.commands.add('atom-workspace', setting.atomCommandName, function (atomCommandName) {
              return _this2.emit('trigger', atomCommandName);
            }));

            if (setting.keymap) {
              require('./google-analytics').sendEvent('keymap', 'registered', setting.keymap);
              var keymapSpec = { 'atom-workspace, atom-text-editor': {} };
              keymapSpec['atom-workspace, atom-text-editor'][setting.keymap] = setting.atomCommandName;
              pathTarget.subscriptions.add(atom.keymaps.add(setting.name, keymapSpec));
            }
          });

          pathTarget.targets = settings;
          pathTarget.loading = false;
        })['catch'](function (err) {
          atom.notifications.addError('Ooops. Something went wrong.', {
            detail: err.message + (err.stack ? '\n' + err.stack : ''),
            dismissable: true
          });
        });
      });

      return Promise.all(pathPromises).then(function (entries) {
        _this2.fillTargets(require('./utils').activePath());
        _this2.emit('refresh-complete');
        _this2.busyRegistry && _this2.busyRegistry.end('build.refresh-targets');

        if (entries.length === 0) {
          return;
        }

        if (atom.config.get('build.notificationOnRefresh')) {
          var rows = refreshPaths.map(function (path) {
            var pathTarget = _this2.pathTargets.find(function (pt) {
              return pt.path === path;
            });
            if (!pathTarget) {
              return 'Targets ' + path + ' no longer exists. Is build deactivated?';
            }
            return pathTarget.targets.length + ' targets at: ' + path;
          });
          atom.notifications.addInfo('Build targets parsed.', {
            detail: rows.join('\n')
          });
        }
      })['catch'](function (err) {
        atom.notifications.addError('Ooops. Something went wrong.', {
          detail: err.message + (err.stack ? '\n' + err.stack : ''),
          dismissable: true
        });
      });
    }
  }, {
    key: 'fillTargets',
    value: function fillTargets(path) {
      var _this3 = this;

      if (!this.targetsView) {
        return;
      }

      var activeTarget = this.getActiveTarget(path);
      activeTarget && this.targetsView.setActiveTarget(activeTarget.name);

      this.getTargets(path).then(function (targets) {
        return targets.map(function (t) {
          return t.name;
        });
      }).then(function (targetNames) {
        return _this3.targetsView && _this3.targetsView.setItems(targetNames);
      });
    }
  }, {
    key: 'selectActiveTarget',
    value: function selectActiveTarget() {
      var _this4 = this;

      if (atom.config.get('build.refreshOnShowTargetList')) {
        this.refreshTargets();
      }

      var path = require('./utils').activePath();
      if (!path) {
        atom.notifications.addWarning('Unable to build.', {
          detail: 'Open file is not part of any open project in Atom'
        });
        return;
      }

      var TargetsView = require('./targets-view');
      this.targetsView = new TargetsView();

      if (this.isLoading(path)) {
        this.targetsView.setLoading('Loading project build targets…');
      } else {
        this.fillTargets(path);
      }

      this.targetsView.awaitSelection().then(function (newTarget) {
        _this4.setActiveTarget(path, newTarget);

        _this4.targetsView = null;
      })['catch'](function (err) {
        _this4.targetsView.setError(err.message);
        _this4.targetsView = null;
      });
    }
  }, {
    key: 'getTargets',
    value: function getTargets(path) {
      var pathTarget = this.pathTargets.find(function (pt) {
        return pt.path === path;
      });
      if (!pathTarget) {
        return Promise.resolve([]);
      }

      if (pathTarget.targets.length === 0) {
        return this.refreshTargets([pathTarget.path]).then(function () {
          return pathTarget.targets;
        });
      }
      return Promise.resolve(pathTarget.targets);
    }
  }, {
    key: 'getActiveTarget',
    value: function getActiveTarget(path) {
      var pathTarget = this.pathTargets.find(function (pt) {
        return pt.path === path;
      });
      if (!pathTarget) {
        return null;
      }
      return pathTarget.targets.find(function (target) {
        return target.name === pathTarget.activeTarget;
      });
    }
  }, {
    key: 'setActiveTarget',
    value: function setActiveTarget(path, targetName) {
      this.pathTargets.find(function (pt) {
        return pt.path === path;
      }).activeTarget = targetName;
      this.emit('new-active-target', path, this.getActiveTarget(path));
    }
  }, {
    key: 'isLoading',
    value: function isLoading(path) {
      return this.pathTargets.find(function (pt) {
        return pt.path === path;
      }).loading;
    }
  }]);

  return TargetManager;
})(_events2['default']);

exports['default'] = TargetManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvdGFyZ2V0LW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRXlCLFFBQVE7Ozs7QUFGakMsV0FBVyxDQUFDOztJQUlOLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxHQUNIOzs7MEJBRFYsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVQOztBQUVSLFFBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRTNDLFFBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7YUFBSSxNQUFLLGtCQUFrQixDQUFDLElBQUksQ0FBQztLQUFBLENBQUMsQ0FBQzs7QUFFM0UsUUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFBLGVBQWUsRUFBSTtBQUMvQyxVQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRTtlQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ2pGLFVBQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBQSxFQUFFO2VBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDbkYsZ0JBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2VBQUksTUFBSyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQUssa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDakYsWUFBSyxXQUFXLEdBQUcsTUFBSyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRTtlQUFJLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUks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QUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxZQUFZO09BQUEsQ0FBQyxDQUFDO0tBQ25GOzs7V0FFYyx5QkFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQ2hDLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRTtlQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssSUFBSTtPQUFBLENBQUMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDO0FBQ3hFLFVBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNsRTs7O1dBRVEsbUJBQUMsSUFBSSxFQUFFO0FBQ2QsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUU7ZUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUk7T0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDO0tBQzlEOzs7U0FuT0csYUFBYTs7O3FCQXNPSixhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvdGFyZ2V0LW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuXG5jbGFzcyBUYXJnZXRNYW5hZ2VyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGxldCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcblxuICAgIHRoaXMucGF0aFRhcmdldHMgPSBwcm9qZWN0UGF0aHMubWFwKHBhdGggPT4gdGhpcy5fZGVmYXVsdFBhdGhUYXJnZXQocGF0aCkpO1xuXG4gICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMobmV3UHJvamVjdFBhdGhzID0+IHtcbiAgICAgIGNvbnN0IGFkZGVkUGF0aHMgPSBuZXdQcm9qZWN0UGF0aHMuZmlsdGVyKGVsID0+IHByb2plY3RQYXRocy5pbmRleE9mKGVsKSA9PT0gLTEpO1xuICAgICAgY29uc3QgcmVtb3ZlZFBhdGhzID0gcHJvamVjdFBhdGhzLmZpbHRlcihlbCA9PiBuZXdQcm9qZWN0UGF0aHMuaW5kZXhPZihlbCkgPT09IC0xKTtcbiAgICAgIGFkZGVkUGF0aHMuZm9yRWFjaChwYXRoID0+IHRoaXMucGF0aFRhcmdldHMucHVzaCh0aGlzLl9kZWZhdWx0UGF0aFRhcmdldChwYXRoKSkpO1xuICAgICAgdGhpcy5wYXRoVGFyZ2V0cyA9IHRoaXMucGF0aFRhcmdldHMuZmlsdGVyKHB0ID0+IC0xID09PSByZW1vdmVkUGF0aHMuaW5kZXhPZihwdC5wYXRoKSk7XG4gICAgICB0aGlzLnJlZnJlc2hUYXJnZXRzKGFkZGVkUGF0aHMpO1xuICAgICAgcHJvamVjdFBhdGhzID0gbmV3UHJvamVjdFBhdGhzO1xuICAgIH0pO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnJlZnJlc2gtdGFyZ2V0cycsICgpID0+IHRoaXMucmVmcmVzaFRhcmdldHMoKSk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnNlbGVjdC1hY3RpdmUtdGFyZ2V0JywgKCkgPT4gdGhpcy5zZWxlY3RBY3RpdmVUYXJnZXQoKSk7XG4gIH1cblxuICBzZXRCdXN5UmVnaXN0cnkocmVnaXN0cnkpIHtcbiAgICB0aGlzLmJ1c3lSZWdpc3RyeSA9IHJlZ2lzdHJ5O1xuICB9XG5cbiAgX2RlZmF1bHRQYXRoVGFyZ2V0KHBhdGgpIHtcbiAgICBjb25zdCBDb21wb3NpdGVEaXNwb3NhYmxlID0gcmVxdWlyZSgnYXRvbScpLkNvbXBvc2l0ZURpc3Bvc2FibGU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIHRhcmdldHM6IFtdLFxuICAgICAgaW5zdGFuY2VkVG9vbHM6IFtdLFxuICAgICAgYWN0aXZlVGFyZ2V0OiBudWxsLFxuICAgICAgdG9vbHM6IFtdLFxuICAgICAgc3Vic2NyaXB0aW9uczogbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIH07XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMucGF0aFRhcmdldHMuZm9yRWFjaChwYXRoVGFyZ2V0ID0+IHBhdGhUYXJnZXQudG9vbHMubWFwKHRvb2wgPT4ge1xuICAgICAgdG9vbC5yZW1vdmVBbGxMaXN0ZW5lcnMgJiYgdG9vbC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlZnJlc2gnKTtcbiAgICAgIHRvb2wuZGVzdHJ1Y3RvciAmJiB0b29sLmRlc3RydWN0b3IoKTtcbiAgICB9KSk7XG4gIH1cblxuICBzZXRUb29scyh0b29scykge1xuICAgIHRoaXMudG9vbHMgPSB0b29scyB8fCBbXTtcbiAgfVxuXG4gIHJlZnJlc2hUYXJnZXRzKHJlZnJlc2hQYXRocykge1xuICAgIHJlZnJlc2hQYXRocyA9IHJlZnJlc2hQYXRocyB8fCBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcblxuICAgIHRoaXMuYnVzeVJlZ2lzdHJ5ICYmIHRoaXMuYnVzeVJlZ2lzdHJ5LmJlZ2luKCdidWlsZC5yZWZyZXNoLXRhcmdldHMnLCBgUmVmcmVzaGluZyB0YXJnZXRzIGZvciAke3JlZnJlc2hQYXRocy5qb2luKCcsJyl9YCk7XG4gICAgY29uc3QgcGF0aFByb21pc2VzID0gcmVmcmVzaFBhdGhzLm1hcCgocGF0aCkgPT4ge1xuICAgICAgY29uc3QgcGF0aFRhcmdldCA9IHRoaXMucGF0aFRhcmdldHMuZmluZChwdCA9PiBwdC5wYXRoID09PSBwYXRoKTtcbiAgICAgIHBhdGhUYXJnZXQubG9hZGluZyA9IHRydWU7XG5cbiAgICAgIHBhdGhUYXJnZXQuaW5zdGFuY2VkVG9vbHMgPSBwYXRoVGFyZ2V0Lmluc3RhbmNlZFRvb2xzXG4gICAgICAgIC5tYXAodCA9PiB0LnJlbW92ZUFsbExpc3RlbmVycyAmJiB0LnJlbW92ZUFsbExpc3RlbmVycygncmVmcmVzaCcpKVxuICAgICAgICAuZmlsdGVyKCgpID0+IGZhbHNlKTsgLy8gSnVzdCBlbXB0eSB0aGUgYXJyYXlcblxuICAgICAgY29uc3Qgc2V0dGluZ3NQcm9taXNlID0gdGhpcy50b29sc1xuICAgICAgICAubWFwKFRvb2wgPT4gbmV3IFRvb2wocGF0aCkpXG4gICAgICAgIC5maWx0ZXIodG9vbCA9PiB0b29sLmlzRWxpZ2libGUoKSlcbiAgICAgICAgLm1hcCh0b29sID0+IHtcbiAgICAgICAgICBwYXRoVGFyZ2V0Lmluc3RhbmNlZFRvb2xzLnB1c2godG9vbCk7XG4gICAgICAgICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdidWlsZCcsICd0b29sIGVsaWdpYmxlJywgdG9vbC5nZXROaWNlTmFtZSgpKTtcblxuICAgICAgICAgIHRvb2wub24gJiYgdG9vbC5vbigncmVmcmVzaCcsIHRoaXMucmVmcmVzaFRhcmdldHMuYmluZCh0aGlzLCBbIHBhdGggXSkpO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdG9vbC5zZXR0aW5ncygpKVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignSW52YWxpZCBidWlsZCBmaWxlLicsIHtcbiAgICAgICAgICAgICAgICAgIGRldGFpbDogJ1lvdSBoYXZlIGEgc3ludGF4IGVycm9yIGluIHlvdXIgYnVpbGQgZmlsZTogJyArIGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ09vb3BzLiBTb21ldGhpbmcgd2VudCB3cm9uZy4nLCB7XG4gICAgICAgICAgICAgICAgICBkZXRhaWw6IGVyci5tZXNzYWdlICsgKGVyci5zdGFjayA/ICdcXG4nICsgZXJyLnN0YWNrIDogJycpLFxuICAgICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBDb21wb3NpdGVEaXNwb3NhYmxlID0gcmVxdWlyZSgnYXRvbScpLkNvbXBvc2l0ZURpc3Bvc2FibGU7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoc2V0dGluZ3NQcm9taXNlKS50aGVuKChzZXR0aW5ncykgPT4ge1xuICAgICAgICBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vdXRpbHMnKS51bmlxdWlmeVNldHRpbmdzKFtdLmNvbmNhdC5hcHBseShbXSwgc2V0dGluZ3MpXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgIC5tYXAoc2V0dGluZyA9PiByZXF1aXJlKCcuL3V0aWxzJykuZ2V0RGVmYXVsdFNldHRpbmdzKHBhdGgsIHNldHRpbmcpKSk7XG5cbiAgICAgICAgaWYgKG51bGwgPT09IHBhdGhUYXJnZXQuYWN0aXZlVGFyZ2V0IHx8ICFzZXR0aW5ncy5maW5kKHMgPT4gcy5uYW1lID09PSBwYXRoVGFyZ2V0LmFjdGl2ZVRhcmdldCkpIHtcbiAgICAgICAgICAvKiBBY3RpdmUgdGFyZ2V0IGhhcyBiZWVuIHJlbW92ZWQgb3Igbm90IHNldC4gU2V0IGl0IHRvIHRoZSBoaWdoZXN0IHByaW8gdGFyZ2V0ICovXG4gICAgICAgICAgcGF0aFRhcmdldC5hY3RpdmVUYXJnZXQgPSBzZXR0aW5nc1swXSA/IHNldHRpbmdzWzBdLm5hbWUgOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb21wb3NpdGVEaXNwb3NhYmxlIGNhbm5vdCBiZSByZXVzZWQsIHNvIHdlIG11c3QgY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9uIGV2ZXJ5IHJlZnJlc2hcbiAgICAgICAgcGF0aFRhcmdldC5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICAgICAgcGF0aFRhcmdldC5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgICAgICBzZXR0aW5ncy5mb3JFYWNoKChzZXR0aW5nLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChzZXR0aW5nLmtleW1hcCAmJiAhc2V0dGluZy5hdG9tQ29tbWFuZE5hbWUpIHtcbiAgICAgICAgICAgIHNldHRpbmcuYXRvbUNvbW1hbmROYW1lID0gYGJ1aWxkOnRyaWdnZXI6JHtzZXR0aW5nLm5hbWV9YDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwYXRoVGFyZ2V0LnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHNldHRpbmcuYXRvbUNvbW1hbmROYW1lLCBhdG9tQ29tbWFuZE5hbWUgPT4gdGhpcy5lbWl0KCd0cmlnZ2VyJywgYXRvbUNvbW1hbmROYW1lKSkpO1xuXG4gICAgICAgICAgaWYgKHNldHRpbmcua2V5bWFwKSB7XG4gICAgICAgICAgICByZXF1aXJlKCcuL2dvb2dsZS1hbmFseXRpY3MnKS5zZW5kRXZlbnQoJ2tleW1hcCcsICdyZWdpc3RlcmVkJywgc2V0dGluZy5rZXltYXApO1xuICAgICAgICAgICAgY29uc3Qga2V5bWFwU3BlYyA9IHsgJ2F0b20td29ya3NwYWNlLCBhdG9tLXRleHQtZWRpdG9yJzoge30gfTtcbiAgICAgICAgICAgIGtleW1hcFNwZWNbJ2F0b20td29ya3NwYWNlLCBhdG9tLXRleHQtZWRpdG9yJ11bc2V0dGluZy5rZXltYXBdID0gc2V0dGluZy5hdG9tQ29tbWFuZE5hbWU7XG4gICAgICAgICAgICBwYXRoVGFyZ2V0LnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ua2V5bWFwcy5hZGQoc2V0dGluZy5uYW1lLCBrZXltYXBTcGVjKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBwYXRoVGFyZ2V0LnRhcmdldHMgPSBzZXR0aW5ncztcbiAgICAgICAgcGF0aFRhcmdldC5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ09vb3BzLiBTb21ldGhpbmcgd2VudCB3cm9uZy4nLCB7XG4gICAgICAgICAgZGV0YWlsOiBlcnIubWVzc2FnZSArIChlcnIuc3RhY2sgPyAnXFxuJyArIGVyci5zdGFjayA6ICcnKSxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHBhdGhQcm9taXNlcykudGhlbihlbnRyaWVzID0+IHtcbiAgICAgIHRoaXMuZmlsbFRhcmdldHMocmVxdWlyZSgnLi91dGlscycpLmFjdGl2ZVBhdGgoKSk7XG4gICAgICB0aGlzLmVtaXQoJ3JlZnJlc2gtY29tcGxldGUnKTtcbiAgICAgIHRoaXMuYnVzeVJlZ2lzdHJ5ICYmIHRoaXMuYnVzeVJlZ2lzdHJ5LmVuZCgnYnVpbGQucmVmcmVzaC10YXJnZXRzJyk7XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLm5vdGlmaWNhdGlvbk9uUmVmcmVzaCcpKSB7XG4gICAgICAgIGNvbnN0IHJvd3MgPSByZWZyZXNoUGF0aHMubWFwKHBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IHBhdGhUYXJnZXQgPSB0aGlzLnBhdGhUYXJnZXRzLmZpbmQocHQgPT4gcHQucGF0aCA9PT0gcGF0aCk7XG4gICAgICAgICAgaWYgKCFwYXRoVGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gYFRhcmdldHMgJHtwYXRofSBubyBsb25nZXIgZXhpc3RzLiBJcyBidWlsZCBkZWFjdGl2YXRlZD9gO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYCR7cGF0aFRhcmdldC50YXJnZXRzLmxlbmd0aH0gdGFyZ2V0cyBhdDogJHtwYXRofWA7XG4gICAgICAgIH0pO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnQnVpbGQgdGFyZ2V0cyBwYXJzZWQuJywge1xuICAgICAgICAgIGRldGFpbDogcm93cy5qb2luKCdcXG4nKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdPb29wcy4gU29tZXRoaW5nIHdlbnQgd3JvbmcuJywge1xuICAgICAgICBkZXRhaWw6IGVyci5tZXNzYWdlICsgKGVyci5zdGFjayA/ICdcXG4nICsgZXJyLnN0YWNrIDogJycpLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmaWxsVGFyZ2V0cyhwYXRoKSB7XG4gICAgaWYgKCF0aGlzLnRhcmdldHNWaWV3KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlVGFyZ2V0ID0gdGhpcy5nZXRBY3RpdmVUYXJnZXQocGF0aCk7XG4gICAgYWN0aXZlVGFyZ2V0ICYmIHRoaXMudGFyZ2V0c1ZpZXcuc2V0QWN0aXZlVGFyZ2V0KGFjdGl2ZVRhcmdldC5uYW1lKTtcblxuICAgIHRoaXMuZ2V0VGFyZ2V0cyhwYXRoKVxuICAgICAgLnRoZW4odGFyZ2V0cyA9PiB0YXJnZXRzLm1hcCh0ID0+IHQubmFtZSkpXG4gICAgICAudGhlbih0YXJnZXROYW1lcyA9PiB0aGlzLnRhcmdldHNWaWV3ICYmIHRoaXMudGFyZ2V0c1ZpZXcuc2V0SXRlbXModGFyZ2V0TmFtZXMpKTtcbiAgfVxuXG4gIHNlbGVjdEFjdGl2ZVRhcmdldCgpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5yZWZyZXNoT25TaG93VGFyZ2V0TGlzdCcpKSB7XG4gICAgICB0aGlzLnJlZnJlc2hUYXJnZXRzKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJy4vdXRpbHMnKS5hY3RpdmVQYXRoKCk7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnVW5hYmxlIHRvIGJ1aWxkLicsIHtcbiAgICAgICAgZGV0YWlsOiAnT3BlbiBmaWxlIGlzIG5vdCBwYXJ0IG9mIGFueSBvcGVuIHByb2plY3QgaW4gQXRvbSdcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IFRhcmdldHNWaWV3ID0gcmVxdWlyZSgnLi90YXJnZXRzLXZpZXcnKTtcbiAgICB0aGlzLnRhcmdldHNWaWV3ID0gbmV3IFRhcmdldHNWaWV3KCk7XG5cbiAgICBpZiAodGhpcy5pc0xvYWRpbmcocGF0aCkpIHtcbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcuc2V0TG9hZGluZygnTG9hZGluZyBwcm9qZWN0IGJ1aWxkIHRhcmdldHNcXHUyMDI2Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsbFRhcmdldHMocGF0aCk7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXRzVmlldy5hd2FpdFNlbGVjdGlvbigpLnRoZW4obmV3VGFyZ2V0ID0+IHtcbiAgICAgIHRoaXMuc2V0QWN0aXZlVGFyZ2V0KHBhdGgsIG5ld1RhcmdldCk7XG5cbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcgPSBudWxsO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcuc2V0RXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgdGhpcy50YXJnZXRzVmlldyA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBnZXRUYXJnZXRzKHBhdGgpIHtcbiAgICBjb25zdCBwYXRoVGFyZ2V0ID0gdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpO1xuICAgIGlmICghcGF0aFRhcmdldCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgfVxuXG4gICAgaWYgKHBhdGhUYXJnZXQudGFyZ2V0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hUYXJnZXRzKFsgcGF0aFRhcmdldC5wYXRoIF0pLnRoZW4oKCkgPT4gcGF0aFRhcmdldC50YXJnZXRzKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXRoVGFyZ2V0LnRhcmdldHMpO1xuICB9XG5cbiAgZ2V0QWN0aXZlVGFyZ2V0KHBhdGgpIHtcbiAgICBjb25zdCBwYXRoVGFyZ2V0ID0gdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpO1xuICAgIGlmICghcGF0aFRhcmdldCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBwYXRoVGFyZ2V0LnRhcmdldHMuZmluZCh0YXJnZXQgPT4gdGFyZ2V0Lm5hbWUgPT09IHBhdGhUYXJnZXQuYWN0aXZlVGFyZ2V0KTtcbiAgfVxuXG4gIHNldEFjdGl2ZVRhcmdldChwYXRoLCB0YXJnZXROYW1lKSB7XG4gICAgdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpLmFjdGl2ZVRhcmdldCA9IHRhcmdldE5hbWU7XG4gICAgdGhpcy5lbWl0KCduZXctYWN0aXZlLXRhcmdldCcsIHBhdGgsIHRoaXMuZ2V0QWN0aXZlVGFyZ2V0KHBhdGgpKTtcbiAgfVxuXG4gIGlzTG9hZGluZyhwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0aFRhcmdldHMuZmluZChwdCA9PiBwdC5wYXRoID09PSBwYXRoKS5sb2FkaW5nO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhcmdldE1hbmFnZXI7XG4iXX0=
//# sourceURL=/Users/naver/.atom/packages/build/lib/target-manager.js
