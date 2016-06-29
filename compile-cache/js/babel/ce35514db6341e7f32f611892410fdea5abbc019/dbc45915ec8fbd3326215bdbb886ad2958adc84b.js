Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.provideBuilder = provideBuilder;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _child_process = require('child_process');

'use babel';

function provideBuilder() {
  return (function (_EventEmitter) {
    _inherits(GulpBuildProvider, _EventEmitter);

    function GulpBuildProvider(cwd) {
      _classCallCheck(this, GulpBuildProvider);

      _get(Object.getPrototypeOf(GulpBuildProvider.prototype), 'constructor', this).call(this);
      this.cwd = cwd;
      this.fileWatchers = [];
    }

    _createClass(GulpBuildProvider, [{
      key: 'destructor',
      value: function destructor() {
        this.fileWatchers.forEach(function (fw) {
          return fw.close();
        });
      }
    }, {
      key: 'getNiceName',
      value: function getNiceName() {
        return 'gulp';
      }
    }, {
      key: 'isEligible',
      value: function isEligible() {
        var _this = this;

        this.file = ['gulpfile.js', 'gulpfile.coffee', 'gulpfile.babel.js'].map(function (file) {
          return _path2['default'].join(_this.cwd, file);
        }).filter(_fs2['default'].existsSync).slice(0, 1).pop();
        return !!this.file;
      }
    }, {
      key: 'settings',
      value: function settings() {
        var _this2 = this;

        var gulpCommand = (function () {
          var executable = process.platform === 'win32' ? 'gulp.cmd' : 'gulp';
          var localPath = _path2['default'].join(_this2.cwd, 'node_modules', '.bin', executable);
          return _fs2['default'].existsSync(localPath) ? localPath : executable;
        })();

        var createConfig = function createConfig(name, args) {
          return {
            name: name,
            exec: gulpCommand,
            sh: false,
            args: args,
            env: {
              NODE_ENV: '',
              FORCE_COLOR: '1'
            }
          };
        };

        return new Promise(function (resolve, reject) {
          var childEnv = Object.assign({}, process.env);

          delete childEnv.NODE_ENV;
          delete childEnv.NODE_PATH;

          (0, _child_process.exec)('"' + gulpCommand + '" --tasks-simple --gulpfile="' + _this2.file + '"', {
            env: childEnv,
            cwd: _this2.cwd
          }, function (error, stdout, stderr) {
            if (error !== null) {
              atom.notifications.addError('Failed to parse gulpfile to parse gulpfile for targets', {
                detail: (stdout ? 'Output:\n' + stdout + '\n' : '') + 'Error:\n' + stderr,
                dismissable: true,
                icon: 'bug'
              });
              return resolve([createConfig('Gulp: default', ['default'])]);
            }

            var lastRefresh = new Date();
            _this2.fileWatchers.forEach(function (fw) {
              return fw.close();
            });
            _this2.fileWatchers.push(_fs2['default'].watch(_this2.file, function () {
              if (new Date() - lastRefresh > 3000) _this2.emit('refresh');
            }));

            var config = [];
            var tasks = stdout.toString().trim();

            if (tasks === '') {
              tasks = [];
            } else {
              tasks = tasks.split('\n');
            }

            /* Make sure 'default' is the first as this will be the prioritized target */
            tasks.sort(function (t1, t2) {
              if ('default' === t1) {
                return -1;
              }
              if ('default' === t2) {
                return 1;
              }
              return t1.localeCompare(t2);
            });
            tasks.forEach(function (task) {
              config.push(createConfig('Gulp: ' + task, [task]));
            });

            return resolve(config);
          });
        });
      }
    }]);

    return GulpBuildProvider;
  })(_events2['default']);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL2xpYi9ndWxwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O3NCQUNFLFFBQVE7Ozs7NkJBQ1osZUFBZTs7QUFMcEMsV0FBVyxDQUFDOztBQU9MLFNBQVMsY0FBYyxHQUFHO0FBQy9CO2NBQWEsaUJBQWlCOztBQUNqQixhQURBLGlCQUFpQixDQUNoQixHQUFHLEVBQUU7NEJBRE4saUJBQWlCOztBQUUxQixpQ0FGUyxpQkFBaUIsNkNBRWxCO0FBQ1IsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztLQUN4Qjs7aUJBTFUsaUJBQWlCOzthQU9sQixzQkFBRztBQUNYLFlBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtpQkFBSSxFQUFFLENBQUMsS0FBSyxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzdDOzs7YUFFVSx1QkFBRztBQUNaLGVBQU8sTUFBTSxDQUFDO09BQ2Y7OzthQUVTLHNCQUFHOzs7QUFDWCxZQUFJLENBQUMsSUFBSSxHQUFHLENBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixDQUFFLENBQ2xFLEdBQUcsQ0FBQyxVQUFBLElBQUk7aUJBQUksa0JBQUssSUFBSSxDQUFDLE1BQUssR0FBRyxFQUFFLElBQUksQ0FBQztTQUFBLENBQUMsQ0FDdEMsTUFBTSxDQUFDLGdCQUFHLFVBQVUsQ0FBQyxDQUNyQixLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNYLEdBQUcsRUFBRSxDQUFDO0FBQ1QsZUFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUNwQjs7O2FBRU8sb0JBQUc7OztBQUNULFlBQU0sV0FBVyxHQUFHLENBQUEsWUFBTTtBQUN4QixjQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sR0FBRyxVQUFVLEdBQUcsTUFBTSxDQUFDO0FBQ3RFLGNBQU0sU0FBUyxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFLLEdBQUcsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzFFLGlCQUFPLGdCQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO1NBQzFELENBQUEsRUFBRSxDQUFDOztBQUVKLFlBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLElBQUksRUFBRSxJQUFJLEVBQUs7QUFDbkMsaUJBQU87QUFDTCxnQkFBSSxFQUFFLElBQUk7QUFDVixnQkFBSSxFQUFFLFdBQVc7QUFDakIsY0FBRSxFQUFFLEtBQUs7QUFDVCxnQkFBSSxFQUFFLElBQUk7QUFDVixlQUFHLEVBQUU7QUFDSCxzQkFBUSxFQUFFLEVBQUU7QUFDWix5QkFBVyxFQUFFLEdBQUc7YUFDakI7V0FDRixDQUFDO1NBQ0gsQ0FBQzs7QUFFRixlQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxjQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWhELGlCQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDekIsaUJBQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQzs7QUFFMUIseUNBQVMsV0FBVyxxQ0FBZ0MsT0FBSyxJQUFJLFFBQUs7QUFDaEUsZUFBRyxFQUFFLFFBQVE7QUFDYixlQUFHLEVBQUUsT0FBSyxHQUFHO1dBQ2QsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQzVCLGdCQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDbEIsa0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLHdEQUF3RCxFQUFFO0FBQ3BGLHNCQUFNLEVBQUUsQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBLEdBQUksVUFBVSxHQUFHLE1BQU07QUFDekUsMkJBQVcsRUFBRSxJQUFJO0FBQ2pCLG9CQUFJLEVBQUUsS0FBSztlQUNaLENBQUMsQ0FBQztBQUNILHFCQUFPLE9BQU8sQ0FBQyxDQUFFLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBRSxTQUFTLENBQUUsQ0FBQyxDQUFFLENBQUMsQ0FBQzthQUNsRTs7QUFFRCxnQkFBTSxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUMvQixtQkFBSyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtxQkFBSSxFQUFFLENBQUMsS0FBSyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQzVDLG1CQUFLLFlBQVksQ0FBQyxJQUFJLENBQUMsZ0JBQUcsS0FBSyxDQUFDLE9BQUssSUFBSSxFQUFFLFlBQU07QUFDL0Msa0JBQUksSUFBSSxJQUFJLEVBQUUsR0FBRyxXQUFXLEdBQUcsSUFBSSxFQUFFLE9BQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzNELENBQUMsQ0FBQyxDQUFDOztBQUVKLGdCQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsZ0JBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFckMsZ0JBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtBQUNoQixtQkFBSyxHQUFHLEVBQUUsQ0FBQzthQUNaLE1BQU07QUFDTCxtQkFBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0I7OztBQUdELGlCQUFLLENBQUMsSUFBSSxDQUFDLFVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNyQixrQkFBSSxTQUFTLEtBQUssRUFBRSxFQUFFO0FBQ3BCLHVCQUFPLENBQUMsQ0FBQyxDQUFDO2VBQ1g7QUFDRCxrQkFBSSxTQUFTLEtBQUssRUFBRSxFQUFFO0FBQ3BCLHVCQUFPLENBQUMsQ0FBQztlQUNWO0FBQ0QscUJBQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUM3QixDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN0QixvQkFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxDQUFFLElBQUksQ0FBRSxDQUFDLENBQUMsQ0FBQzthQUN0RCxDQUFDLENBQUM7O0FBRUgsbUJBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1dBQ3hCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKOzs7V0EvRlUsaUJBQWlCOzBCQWdHNUI7Q0FDSCIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQtZ3VscC9saWIvZ3VscC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlQnVpbGRlcigpIHtcbiAgcmV0dXJuIGNsYXNzIEd1bHBCdWlsZFByb3ZpZGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjd2QpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLmN3ZCA9IGN3ZDtcbiAgICAgIHRoaXMuZmlsZVdhdGNoZXJzID0gW107XG4gICAgfVxuXG4gICAgZGVzdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMuZmlsZVdhdGNoZXJzLmZvckVhY2goZncgPT4gZncuY2xvc2UoKSk7XG4gICAgfVxuXG4gICAgZ2V0TmljZU5hbWUoKSB7XG4gICAgICByZXR1cm4gJ2d1bHAnO1xuICAgIH1cblxuICAgIGlzRWxpZ2libGUoKSB7XG4gICAgICB0aGlzLmZpbGUgPSBbICdndWxwZmlsZS5qcycsICdndWxwZmlsZS5jb2ZmZWUnLCAnZ3VscGZpbGUuYmFiZWwuanMnIF1cbiAgICAgICAgLm1hcChmaWxlID0+IHBhdGguam9pbih0aGlzLmN3ZCwgZmlsZSkpXG4gICAgICAgIC5maWx0ZXIoZnMuZXhpc3RzU3luYylcbiAgICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICAgIC5wb3AoKTtcbiAgICAgIHJldHVybiAhIXRoaXMuZmlsZTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncygpIHtcbiAgICAgIGNvbnN0IGd1bHBDb21tYW5kID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBleGVjdXRhYmxlID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICdndWxwLmNtZCcgOiAnZ3VscCc7XG4gICAgICAgIGNvbnN0IGxvY2FsUGF0aCA9IHBhdGguam9pbih0aGlzLmN3ZCwgJ25vZGVfbW9kdWxlcycsICcuYmluJywgZXhlY3V0YWJsZSk7XG4gICAgICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGxvY2FsUGF0aCkgPyBsb2NhbFBhdGggOiBleGVjdXRhYmxlO1xuICAgICAgfSgpO1xuXG4gICAgICBjb25zdCBjcmVhdGVDb25maWcgPSAobmFtZSwgYXJncykgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgZXhlYzogZ3VscENvbW1hbmQsXG4gICAgICAgICAgc2g6IGZhbHNlLFxuICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICBOT0RFX0VOVjogJycsXG4gICAgICAgICAgICBGT1JDRV9DT0xPUjogJzEnXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGRFbnYgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9jZXNzLmVudik7XG5cbiAgICAgICAgZGVsZXRlIGNoaWxkRW52Lk5PREVfRU5WO1xuICAgICAgICBkZWxldGUgY2hpbGRFbnYuTk9ERV9QQVRIO1xuXG4gICAgICAgIGV4ZWMoYFwiJHtndWxwQ29tbWFuZH1cIiAtLXRhc2tzLXNpbXBsZSAtLWd1bHBmaWxlPVwiJHt0aGlzLmZpbGV9XCJgLCB7XG4gICAgICAgICAgZW52OiBjaGlsZEVudixcbiAgICAgICAgICBjd2Q6IHRoaXMuY3dkXG4gICAgICAgIH0sIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRmFpbGVkIHRvIHBhcnNlIGd1bHBmaWxlIHRvIHBhcnNlIGd1bHBmaWxlIGZvciB0YXJnZXRzJywge1xuICAgICAgICAgICAgICBkZXRhaWw6IChzdGRvdXQgPyAnT3V0cHV0OlxcbicgKyBzdGRvdXQgKyAnXFxuJyA6ICcnKSArICdFcnJvcjpcXG4nICsgc3RkZXJyLFxuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWNvbjogJ2J1ZydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoWyBjcmVhdGVDb25maWcoJ0d1bHA6IGRlZmF1bHQnLCBbICdkZWZhdWx0JyBdKSBdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBsYXN0UmVmcmVzaCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgdGhpcy5maWxlV2F0Y2hlcnMuZm9yRWFjaChmdyA9PiBmdy5jbG9zZSgpKTtcbiAgICAgICAgICB0aGlzLmZpbGVXYXRjaGVycy5wdXNoKGZzLndhdGNoKHRoaXMuZmlsZSwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKG5ldyBEYXRlKCkgLSBsYXN0UmVmcmVzaCA+IDMwMDApIHRoaXMuZW1pdCgncmVmcmVzaCcpO1xuICAgICAgICAgIH0pKTtcblxuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IFtdO1xuICAgICAgICAgIGxldCB0YXNrcyA9IHN0ZG91dC50b1N0cmluZygpLnRyaW0oKTtcblxuICAgICAgICAgIGlmICh0YXNrcyA9PT0gJycpIHtcbiAgICAgICAgICAgIHRhc2tzID0gW107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhc2tzID0gdGFza3Muc3BsaXQoJ1xcbicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8qIE1ha2Ugc3VyZSAnZGVmYXVsdCcgaXMgdGhlIGZpcnN0IGFzIHRoaXMgd2lsbCBiZSB0aGUgcHJpb3JpdGl6ZWQgdGFyZ2V0ICovXG4gICAgICAgICAgdGFza3Muc29ydCgodDEsIHQyKSA9PiB7XG4gICAgICAgICAgICBpZiAoJ2RlZmF1bHQnID09PSB0MSkge1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJ2RlZmF1bHQnID09PSB0Mikge1xuICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0MS5sb2NhbGVDb21wYXJlKHQyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0YXNrcy5mb3JFYWNoKCh0YXNrKSA9PiB7XG4gICAgICAgICAgICBjb25maWcucHVzaChjcmVhdGVDb25maWcoJ0d1bHA6ICcgKyB0YXNrLCBbIHRhc2sgXSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoY29uZmlnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG4iXX0=
//# sourceURL=/Users/naver/.atom/packages/build-gulp/lib/gulp.js
