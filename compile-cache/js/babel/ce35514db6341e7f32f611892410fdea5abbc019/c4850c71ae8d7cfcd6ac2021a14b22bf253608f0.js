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
              FORCE_COLOR: '1'
            }
          };
        };

        return new Promise(function (resolve, reject) {
          var childEnv = Object.assign({}, process.env);

          delete childEnv.NODE_ENV;
          delete childEnv.NODE_PATH;

          (0, _child_process.execFile)(gulpCommand, ['--tasks-simple', '--gulpfile=' + _this2.file], {
            env: childEnv,
            cwd: _this2.cwd
          }, function (error, stdout, stderr) {
            if (error !== null) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL2xpYi9ndWxwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O3NCQUNFLFFBQVE7Ozs7NkJBQ1IsZUFBZTs7QUFMeEMsV0FBVyxDQUFDOztBQU9MLFNBQVMsY0FBYyxHQUFHO0FBQy9CO2NBQWEsaUJBQWlCOztBQUNqQixhQURBLGlCQUFpQixDQUNoQixHQUFHLEVBQUU7NEJBRE4saUJBQWlCOztBQUUxQixpQ0FGUyxpQkFBaUIsNkNBRWxCO0FBQ1IsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztLQUN4Qjs7aUJBTFUsaUJBQWlCOzthQU9sQixzQkFBRztBQUNYLFlBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtpQkFBSSxFQUFFLENBQUMsS0FBSyxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzdDOzs7YUFFVSx1QkFBRztBQUNaLGVBQU8sTUFBTSxDQUFDO09BQ2Y7OzthQUVTLHNCQUFHOzs7QUFDWCxZQUFJLENBQUMsSUFBSSxHQUFHLENBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixDQUFFLENBQ2xFLEdBQUcsQ0FBQyxVQUFBLElBQUk7aUJBQUksa0JBQUssSUFBSSxDQUFDLE1BQUssR0FBRyxFQUFFLElBQUksQ0FBQztTQUFBLENBQUMsQ0FDdEMsTUFBTSxDQUFDLGdCQUFHLFVBQVUsQ0FBQyxDQUNyQixLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNYLEdBQUcsRUFBRSxDQUFDO0FBQ1QsZUFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUNwQjs7O2FBRU8sb0JBQUc7OztBQUNULFlBQU0sV0FBVyxHQUFHLENBQUEsWUFBTTtBQUN4QixjQUFNLFVBQVUsR0FBRyxPQUFP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QUFDOztBQUVILG1CQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUN4QixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjs7O1dBNUZVLGlCQUFpQjswQkE2RjVCO0NBQ0giLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLWd1bHAvbGliL2d1bHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgZXhlY0ZpbGUgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVCdWlsZGVyKCkge1xuICByZXR1cm4gY2xhc3MgR3VscEJ1aWxkUHJvdmlkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGN3ZCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuY3dkID0gY3dkO1xuICAgICAgdGhpcy5maWxlV2F0Y2hlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBkZXN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5maWxlV2F0Y2hlcnMuZm9yRWFjaChmdyA9PiBmdy5jbG9zZSgpKTtcbiAgICB9XG5cbiAgICBnZXROaWNlTmFtZSgpIHtcbiAgICAgIHJldHVybiAnZ3VscCc7XG4gICAgfVxuXG4gICAgaXNFbGlnaWJsZSgpIHtcbiAgICAgIHRoaXMuZmlsZSA9IFsgJ2d1bHBmaWxlLmpzJywgJ2d1bHBmaWxlLmNvZmZlZScsICdndWxwZmlsZS5iYWJlbC5qcycgXVxuICAgICAgICAubWFwKGZpbGUgPT4gcGF0aC5qb2luKHRoaXMuY3dkLCBmaWxlKSlcbiAgICAgICAgLmZpbHRlcihmcy5leGlzdHNTeW5jKVxuICAgICAgICAuc2xpY2UoMCwgMSlcbiAgICAgICAgLnBvcCgpO1xuICAgICAgcmV0dXJuICEhdGhpcy5maWxlO1xuICAgIH1cblxuICAgIHNldHRpbmdzKCkge1xuICAgICAgY29uc3QgZ3VscENvbW1hbmQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gJ2d1bHAuY21kJyA6ICdndWxwJztcbiAgICAgICAgY29uc3QgbG9jYWxQYXRoID0gcGF0aC5qb2luKHRoaXMuY3dkLCAnbm9kZV9tb2R1bGVzJywgJy5iaW4nLCBleGVjdXRhYmxlKTtcbiAgICAgICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMobG9jYWxQYXRoKSA/IGxvY2FsUGF0aCA6IGV4ZWN1dGFibGU7XG4gICAgICB9KCk7XG5cbiAgICAgIGNvbnN0IGNyZWF0ZUNvbmZpZyA9IChuYW1lLCBhcmdzKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBleGVjOiBndWxwQ29tbWFuZCxcbiAgICAgICAgICBzaDogZmFsc2UsXG4gICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgIEZPUkNFX0NPTE9SOiAnMSdcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBjaGlsZEVudiA9IE9iamVjdC5hc3NpZ24oe30sIHByb2Nlc3MuZW52KTtcblxuICAgICAgICBkZWxldGUgY2hpbGRFbnYuTk9ERV9FTlY7XG4gICAgICAgIGRlbGV0ZSBjaGlsZEVudi5OT0RFX1BBVEg7XG5cbiAgICAgICAgZXhlY0ZpbGUoZ3VscENvbW1hbmQsIFtcbiAgICAgICAgICAnLS10YXNrcy1zaW1wbGUnLFxuICAgICAgICAgICctLWd1bHBmaWxlPScgKyB0aGlzLmZpbGVcbiAgICAgICAgXSwge1xuICAgICAgICAgIGVudjogY2hpbGRFbnYsXG4gICAgICAgICAgY3dkOiB0aGlzLmN3ZFxuICAgICAgICB9LCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbIGNyZWF0ZUNvbmZpZygnR3VscDogZGVmYXVsdCcsIFsgJ2RlZmF1bHQnIF0pIF0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGxhc3RSZWZyZXNoID0gbmV3IERhdGUoKTtcbiAgICAgICAgICB0aGlzLmZpbGVXYXRjaGVycy5mb3JFYWNoKGZ3ID0+IGZ3LmNsb3NlKCkpO1xuICAgICAgICAgIHRoaXMuZmlsZVdhdGNoZXJzLnB1c2goZnMud2F0Y2godGhpcy5maWxlLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAobmV3IERhdGUoKSAtIGxhc3RSZWZyZXNoID4gMzAwMCkgdGhpcy5lbWl0KCdyZWZyZXNoJyk7XG4gICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgY29uc3QgY29uZmlnID0gW107XG4gICAgICAgICAgbGV0IHRhc2tzID0gc3Rkb3V0LnRvU3RyaW5nKCkudHJpbSgpO1xuXG4gICAgICAgICAgaWYgKHRhc2tzID09PSAnJykge1xuICAgICAgICAgICAgdGFza3MgPSBbXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFza3MgPSB0YXNrcy5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLyogTWFrZSBzdXJlICdkZWZhdWx0JyBpcyB0aGUgZmlyc3QgYXMgdGhpcyB3aWxsIGJlIHRoZSBwcmlvcml0aXplZCB0YXJnZXQgKi9cbiAgICAgICAgICB0YXNrcy5zb3J0KCh0MSwgdDIpID0+IHtcbiAgICAgICAgICAgIGlmICgnZGVmYXVsdCcgPT09IHQxKSB7XG4gICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgnZGVmYXVsdCcgPT09IHQyKSB7XG4gICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHQxLmxvY2FsZUNvbXBhcmUodDIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRhc2tzLmZvckVhY2goKHRhc2spID0+IHtcbiAgICAgICAgICAgIGNvbmZpZy5wdXNoKGNyZWF0ZUNvbmZpZygnR3VscDogJyArIHRhc2ssIFsgdGFzayBdKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShjb25maWcpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build-gulp/lib/gulp.js
