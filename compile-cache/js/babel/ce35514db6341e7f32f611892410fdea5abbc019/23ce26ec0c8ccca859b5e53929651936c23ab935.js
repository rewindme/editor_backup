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

          (0, _child_process.exec)('"' + gulpCommand + '" --tasks-simple --gulpfile="' + _this2.file + '"', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL2xpYi9ndWxwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O3NCQUNFLFFBQVE7Ozs7NkJBQ1osZUFBZTs7QUFMcEMsV0FBVyxDQUFDOztBQU9MLFNBQVMsY0FBYyxHQUFHO0FBQy9CO2NBQWEsaUJBQWlCOztBQUNqQixhQURBLGlCQUFpQixDQUNoQixHQUFHLEVBQUU7NEJBRE4saUJBQWlCOztBQUUxQixpQ0FGUyxpQkFBaUIsNkNBRWxCO0FBQ1IsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztLQUN4Qjs7aUJBTFUsaUJBQWlCOzthQU9sQixzQkFBRztBQUNYLFlBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtpQkFBSSxFQUFFLENBQUMsS0FBSyxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzdDOzs7YUFFVSx1QkFBRztBQUNaLGVBQU8sTUFBTSxDQUFDO09BQ2Y7OzthQUVTLHNCQUFHOzs7QUFDWCxZQUFJLENBQUMsSUFBSSxHQUFHLENBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixDQUFFLENBQ2xFLEdBQUcsQ0FBQyxVQUFBLElBQUk7aUJBQUksa0JBQUssSUFBSSxDQUFDLE1BQUssR0FBRyxFQUFFLElBQUksQ0FBQztTQUFBLENBQUMsQ0FDdEMsTUFBTSxDQUFDLGdCQUFHLFVBQVUsQ0FBQyxDQUNyQixLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNYLEdBQUcsRUFBRSxDQUFDO0FBQ1QsZUFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUNwQjs7O2FBRU8sb0JBQUc7OztBQUNULFlBQU0sV0FBVyxHQUFHLENBQUEsWUFBTTtBQUN4QixjQUFNLFVBQVUsR0FBRyxPQUFP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QUFDLENBQUM7V0FDeEIsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0o7OztXQXpGVSxpQkFBaUI7MEJBMEY1QjtDQUNIIiwiZmlsZSI6Ii9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL2xpYi9ndWxwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVCdWlsZGVyKCkge1xuICByZXR1cm4gY2xhc3MgR3VscEJ1aWxkUHJvdmlkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGN3ZCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuY3dkID0gY3dkO1xuICAgICAgdGhpcy5maWxlV2F0Y2hlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBkZXN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5maWxlV2F0Y2hlcnMuZm9yRWFjaChmdyA9PiBmdy5jbG9zZSgpKTtcbiAgICB9XG5cbiAgICBnZXROaWNlTmFtZSgpIHtcbiAgICAgIHJldHVybiAnZ3VscCc7XG4gICAgfVxuXG4gICAgaXNFbGlnaWJsZSgpIHtcbiAgICAgIHRoaXMuZmlsZSA9IFsgJ2d1bHBmaWxlLmpzJywgJ2d1bHBmaWxlLmNvZmZlZScsICdndWxwZmlsZS5iYWJlbC5qcycgXVxuICAgICAgICAubWFwKGZpbGUgPT4gcGF0aC5qb2luKHRoaXMuY3dkLCBmaWxlKSlcbiAgICAgICAgLmZpbHRlcihmcy5leGlzdHNTeW5jKVxuICAgICAgICAuc2xpY2UoMCwgMSlcbiAgICAgICAgLnBvcCgpO1xuICAgICAgcmV0dXJuICEhdGhpcy5maWxlO1xuICAgIH1cblxuICAgIHNldHRpbmdzKCkge1xuICAgICAgY29uc3QgZ3VscENvbW1hbmQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gJ2d1bHAuY21kJyA6ICdndWxwJztcbiAgICAgICAgY29uc3QgbG9jYWxQYXRoID0gcGF0aC5qb2luKHRoaXMuY3dkLCAnbm9kZV9tb2R1bGVzJywgJy5iaW4nLCBleGVjdXRhYmxlKTtcbiAgICAgICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMobG9jYWxQYXRoKSA/IGxvY2FsUGF0aCA6IGV4ZWN1dGFibGU7XG4gICAgICB9KCk7XG5cbiAgICAgIGNvbnN0IGNyZWF0ZUNvbmZpZyA9IChuYW1lLCBhcmdzKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBleGVjOiBndWxwQ29tbWFuZCxcbiAgICAgICAgICBzaDogZmFsc2UsXG4gICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgIEZPUkNFX0NPTE9SOiAnMSdcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBjaGlsZEVudiA9IE9iamVjdC5hc3NpZ24oe30sIHByb2Nlc3MuZW52KTtcblxuICAgICAgICBkZWxldGUgY2hpbGRFbnYuTk9ERV9FTlY7XG4gICAgICAgIGRlbGV0ZSBjaGlsZEVudi5OT0RFX1BBVEg7XG5cbiAgICAgICAgZXhlYyhgXCIke2d1bHBDb21tYW5kfVwiIC0tdGFza3Mtc2ltcGxlIC0tZ3VscGZpbGU9XCIke3RoaXMuZmlsZX1cImAsIHtcbiAgICAgICAgICBlbnY6IGNoaWxkRW52LFxuICAgICAgICAgIGN3ZDogdGhpcy5jd2RcbiAgICAgICAgfSwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnJvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoWyBjcmVhdGVDb25maWcoJ0d1bHA6IGRlZmF1bHQnLCBbICdkZWZhdWx0JyBdKSBdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBsYXN0UmVmcmVzaCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgdGhpcy5maWxlV2F0Y2hlcnMuZm9yRWFjaChmdyA9PiBmdy5jbG9zZSgpKTtcbiAgICAgICAgICB0aGlzLmZpbGVXYXRjaGVycy5wdXNoKGZzLndhdGNoKHRoaXMuZmlsZSwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKG5ldyBEYXRlKCkgLSBsYXN0UmVmcmVzaCA+IDMwMDApIHRoaXMuZW1pdCgncmVmcmVzaCcpO1xuICAgICAgICAgIH0pKTtcblxuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IFtdO1xuICAgICAgICAgIGxldCB0YXNrcyA9IHN0ZG91dC50b1N0cmluZygpLnRyaW0oKTtcblxuICAgICAgICAgIGlmICh0YXNrcyA9PT0gJycpIHtcbiAgICAgICAgICAgIHRhc2tzID0gW107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhc2tzID0gdGFza3Muc3BsaXQoJ1xcbicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8qIE1ha2Ugc3VyZSAnZGVmYXVsdCcgaXMgdGhlIGZpcnN0IGFzIHRoaXMgd2lsbCBiZSB0aGUgcHJpb3JpdGl6ZWQgdGFyZ2V0ICovXG4gICAgICAgICAgdGFza3Muc29ydCgodDEsIHQyKSA9PiB7XG4gICAgICAgICAgICBpZiAoJ2RlZmF1bHQnID09PSB0MSkge1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJ2RlZmF1bHQnID09PSB0Mikge1xuICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0MS5sb2NhbGVDb21wYXJlKHQyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0YXNrcy5mb3JFYWNoKCh0YXNrKSA9PiB7XG4gICAgICAgICAgICBjb25maWcucHVzaChjcmVhdGVDb25maWcoJ0d1bHA6ICcgKyB0YXNrLCBbIHRhc2sgXSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoY29uZmlnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG4iXX0=
//# sourceURL=/Users/naver/.atom/packages/build-gulp/lib/gulp.js
