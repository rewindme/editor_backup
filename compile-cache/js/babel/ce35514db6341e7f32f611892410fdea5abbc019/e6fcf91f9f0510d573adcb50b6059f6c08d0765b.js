Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

'use babel';

function getConfig(file) {
  var fs = require('fs');
  var realFile = fs.realpathSync(file);
  delete require.cache[realFile];
  switch (require('path').extname(file)) {
    case '.json':
    case '.js':
      return require(realFile);

    case '.cson':
      return require('cson-parser').parse(fs.readFileSync(realFile));

    case '.yml':
      return require('js-yaml').safeLoad(fs.readFileSync(realFile));
  }

  return {};
}

function createBuildConfig(build, name) {
  var conf = {
    name: 'Custom: ' + name,
    exec: build.cmd,
    env: build.env,
    args: build.args,
    cwd: build.cwd,
    sh: build.sh,
    errorMatch: build.errorMatch,
    atomCommandName: build.atomCommandName,
    keymap: build.keymap
  };

  if (typeof build.postBuild === 'function') {
    conf.postBuild = build.postBuild;
  }

  if (typeof build.preBuild === 'function') {
    conf.preBuild = build.preBuild;
  }

  return conf;
}

var CustomFile = (function (_EventEmitter) {
  _inherits(CustomFile, _EventEmitter);

  function CustomFile(cwd) {
    _classCallCheck(this, CustomFile);

    _get(Object.getPrototypeOf(CustomFile.prototype), 'constructor', this).call(this);
    this.cwd = cwd;
    this.fileWatchers = [];
  }

  _createClass(CustomFile, [{
    key: 'destructor',
    value: function destructor() {
      this.fileWatchers.forEach(function (fw) {
        return fw.close();
      });
    }
  }, {
    key: 'getNiceName',
    value: function getNiceName() {
      return 'Custom file';
    }
  }, {
    key: 'isEligible',
    value: function isEligible() {
      var _this = this;

      var os = require('os');
      var fs = require('fs');
      var path = require('path');
      this.files = [].concat.apply([], ['json', 'cson', 'yml', 'js'].map(function (ext) {
        return [path.join(_this.cwd, '.atom-build.' + ext), path.join(os.homedir(), '.atom-build.' + ext)];
      })).filter(fs.existsSync);
      return 0 < this.files.length;
    }
  }, {
    key: 'settings',
    value: function settings() {
      var _this2 = this;

      var fs = require('fs');
      this.fileWatchers.forEach(function (fw) {
        return fw.close();
      });
      this.fileWatchers = this.files.map(function (file) {
        return fs.watch(file, function () {
          return _this2.emit('refresh');
        });
      });

      var config = [];
      this.files.map(getConfig).forEach(function (build) {
        config.push.apply(config, [createBuildConfig(build, build.name || 'default')].concat(_toConsumableArray(Object.keys(build.targets || {}).map(function (name) {
          return createBuildConfig(build.targets[name], name);
        }))));
      });

      return config;
    }
  }]);

  return CustomFile;
})(_events2['default']);

exports['default'] = CustomFile;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvYXRvbS1idWlsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUV5QixRQUFROzs7O0FBRmpDLFdBQVcsQ0FBQzs7QUFJWixTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUU7QUFDdkIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsU0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLFVBQVEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDbkMsU0FBSyxPQUFPLENBQUM7QUFDYixTQUFLLEtBQUs7QUFDUixhQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFBQSxBQUUzQixTQUFLLE9BQU87QUFDVixhQUFPLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOztBQUFBLEFBRWpFLFNBQUssTUFBTTtBQUNULGFBQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFBQSxHQUNqRTs7QUFFRCxTQUFPLEVBQUUsQ0FBQztDQUNYOztBQUVELFNBQVMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN0QyxNQUFNLElBQUksR0FBRztBQUNYLFFBQUksRUFBRSxVQUFVLEdBQUcsSUFBSTtBQUN2QixRQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUc7QUFDZixPQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7QUFDZCxRQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7QUFDaEIsT0FB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QUFDLFVBQUEsSUFBSTtpQkFBSSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQztTQUFBLENBQUMsR0FDOUYsQ0FBQztPQUNILENBQUMsQ0FBQzs7QUFFSCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7U0F4Q2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvYXRvbS1idWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5cbmZ1bmN0aW9uIGdldENvbmZpZyhmaWxlKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgY29uc3QgcmVhbEZpbGUgPSBmcy5yZWFscGF0aFN5bmMoZmlsZSk7XG4gIGRlbGV0ZSByZXF1aXJlLmNhY2hlW3JlYWxGaWxlXTtcbiAgc3dpdGNoIChyZXF1aXJlKCdwYXRoJykuZXh0bmFtZShmaWxlKSkge1xuICAgIGNhc2UgJy5qc29uJzpcbiAgICBjYXNlICcuanMnOlxuICAgICAgcmV0dXJuIHJlcXVpcmUocmVhbEZpbGUpO1xuXG4gICAgY2FzZSAnLmNzb24nOlxuICAgICAgcmV0dXJuIHJlcXVpcmUoJ2Nzb24tcGFyc2VyJykucGFyc2UoZnMucmVhZEZpbGVTeW5jKHJlYWxGaWxlKSk7XG5cbiAgICBjYXNlICcueW1sJzpcbiAgICAgIHJldHVybiByZXF1aXJlKCdqcy15YW1sJykuc2FmZUxvYWQoZnMucmVhZEZpbGVTeW5jKHJlYWxGaWxlKSk7XG4gIH1cblxuICByZXR1cm4ge307XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1aWxkQ29uZmlnKGJ1aWxkLCBuYW1lKSB7XG4gIGNvbnN0IGNvbmYgPSB7XG4gICAgbmFtZTogJ0N1c3RvbTogJyArIG5hbWUsXG4gICAgZXhlYzogYnVpbGQuY21kLFxuICAgIGVudjogYnVpbGQuZW52LFxuICAgIGFyZ3M6IGJ1aWxkLmFyZ3MsXG4gICAgY3dkOiBidWlsZC5jd2QsXG4gICAgc2g6IGJ1aWxkLnNoLFxuICAgIGVycm9yTWF0Y2g6IGJ1aWxkLmVycm9yTWF0Y2gsXG4gICAgYXRvbUNvbW1hbmROYW1lOiBidWlsZC5hdG9tQ29tbWFuZE5hbWUsXG4gICAga2V5bWFwOiBidWlsZC5rZXltYXBcbiAgfTtcblxuICBpZiAodHlwZW9mIGJ1aWxkLnBvc3RCdWlsZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbmYucG9zdEJ1aWxkID0gYnVpbGQucG9zdEJ1aWxkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBidWlsZC5wcmVCdWlsZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbmYucHJlQnVpbGQgPSBidWlsZC5wcmVCdWlsZDtcbiAgfVxuXG4gIHJldHVybiBjb25mO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21GaWxlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY3dkKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmN3ZCA9IGN3ZDtcbiAgICB0aGlzLmZpbGVXYXRjaGVycyA9IFtdO1xuICB9XG5cbiAgZGVzdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmZpbGVXYXRjaGVycy5mb3JFYWNoKGZ3ID0+IGZ3LmNsb3NlKCkpO1xuICB9XG5cbiAgZ2V0TmljZU5hbWUoKSB7XG4gICAgcmV0dXJuICdDdXN0b20gZmlsZSc7XG4gIH1cblxuICBpc0VsaWdpYmxlKCkge1xuICAgIGNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKTtcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICB0aGlzLmZpbGVzID0gW10uY29uY2F0LmFwcGx5KFtdLCBbICdqc29uJywgJ2Nzb24nLCAneW1sJywgJ2pzJyBdLm1hcChleHQgPT4gW1xuICAgICAgcGF0aC5qb2luKHRoaXMuY3dkLCBgLmF0b20tYnVpbGQuJHtleHR9YCksXG4gICAgICBwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCBgLmF0b20tYnVpbGQuJHtleHR9YClcbiAgICBdKSkuZmlsdGVyKGZzLmV4aXN0c1N5bmMpO1xuICAgIHJldHVybiAwIDwgdGhpcy5maWxlcy5sZW5ndGg7XG4gIH1cblxuICBzZXR0aW5ncygpIHtcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgdGhpcy5maWxlV2F0Y2hlcnMuZm9yRWFjaChmdyA9PiBmdy5jbG9zZSgpKTtcbiAgICB0aGlzLmZpbGVXYXRjaGVycyA9IHRoaXMuZmlsZXMubWFwKGZpbGUgPT4gZnMud2F0Y2goZmlsZSwgKCkgPT4gdGhpcy5lbWl0KCdyZWZyZXNoJykpKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IFtdO1xuICAgIHRoaXMuZmlsZXMubWFwKGdldENvbmZpZykuZm9yRWFjaChidWlsZCA9PiB7XG4gICAgICBjb25maWcucHVzaChcbiAgICAgICAgY3JlYXRlQnVpbGRDb25maWcoYnVpbGQsIGJ1aWxkLm5hbWUgfHwgJ2RlZmF1bHQnKSxcbiAgICAgICAgLi4uT2JqZWN0LmtleXMoYnVpbGQudGFyZ2V0cyB8fCB7fSkubWFwKG5hbWUgPT4gY3JlYXRlQnVpbGRDb25maWcoYnVpbGQudGFyZ2V0c1tuYW1lXSwgbmFtZSkpXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfVxufVxuIl19
//# sourceURL=/Users/naver/.atom/packages/build/lib/atom-build.js
