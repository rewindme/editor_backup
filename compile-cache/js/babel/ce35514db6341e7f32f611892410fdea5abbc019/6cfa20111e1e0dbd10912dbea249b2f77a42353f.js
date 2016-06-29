'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Linter = (function () {
  function Linter(registry) {
    _classCallCheck(this, Linter);

    this.linter = registry.register({ name: 'Build' });
  }

  _createClass(Linter, [{
    key: 'destroy',
    value: function destroy() {
      this.linter.dispose();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.linter.deleteMessages();
    }
  }, {
    key: 'processMessages',
    value: function processMessages(messages, cwd) {
      function extractRange(json) {
        return [[(json.line || 1) - 1, (json.col || 1) - 1], [(json.line_end || json.line || 1) - 1, (json.col_end || json.col || 1) - 1]];
      }
      function normalizePath(p) {
        return require('path').isAbsolute(p) ? p : require('path').join(cwd, p);
      }
      function typeToSeverity(type) {
        switch (type && type.toLowerCase()) {
          case 'err':
          case 'error':
            return 'error';
          case 'warn':
          case 'warning':
            return 'warning';
          default:
            return null;
        }
      }
      this.linter.setMessages(messages.map(function (match) {
        return {
          type: match.type || 'Error',
          text: match.message || 'Error from build',
          filePath: normalizePath(match.file),
          severity: typeToSeverity(match.type),
          range: extractRange(match),
          trace: match.trace && match.trace.map(function (trace) {
            return {
              type: trace.type || 'Trace',
              text: trace.message || 'Trace in build',
              filePath: trace.file && normalizePath(trace.file),
              severity: typeToSeverity(trace.type) || 'info',
              range: extractRange(trace)
            };
          })
        };
      }));
    }
  }]);

  return Linter;
})();

exports['default'] = Linter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvbGludGVyLWludGVncmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztJQUVOLE1BQU07QUFDQyxXQURQLE1BQU0sQ0FDRSxRQUFRLEVBQUU7MEJBRGxCLE1BQU07O0FBRVIsUUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7R0FDcEQ7O2VBSEcsTUFBTTs7V0FJSCxtQkFBRztBQUNSLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDdkI7OztXQUNJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUM5Qjs7O1dBQ2MseUJBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtBQUM3QixlQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7QUFDMUIsZUFBTyxDQUNMLENBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQSxHQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFFLEVBQzdDLENBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFBLEdBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBRSxDQUMvRSxDQUFDO09BQ0g7QUFDRCxlQUFTLGFBQWEsQ0FBQyxDQUFDLEVBQUU7QUFDeEIsZUFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUN6RTtBQUNELGVBQVMsY0FBYyxDQUFDLElBQUksRUFBRTtBQUM1QixnQkFBUSxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNoQyxlQUFLLEtBQUssQ0FBQztBQUNYLGVBQUssT0FBTztBQUFFLG1CQUFPLE9BQU8sQ0FBQztBQUFBLEFBQzdCLGVBQUssTUFBTSxDQUFDO0FBQ1osZUFBSyxTQUFTO0FBQUUsbUJBQU8sU0FBUyxDQUFDO0FBQUEsQUFDakM7QUFBUyxtQkFBTyxJQUFJLENBQUM7QUFBQSxTQUN0QjtPQUNGO0FBQ0QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7ZUFBSztBQUM3QyxjQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxPQUFPO0FBQzNCLGNBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLGtCQUFrQjtBQUN6QyxrQkFBUSxFQUFFLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ25DLGtCQUFRLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDcEMsZUFBSyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUM7QUFDMUIsZUFBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO21CQUFLO0FBQzlDLGtCQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxPQUFPO0FBQzNCLGtCQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSxnQkFBZ0I7QUFDdkMsc0JBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2pELHNCQUFRLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNO0FBQzlDLG1CQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQzthQUMzQjtXQUFDLENBQUM7U0FDSjtPQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ047OztTQTNDRyxNQUFNOzs7cUJBOENHLE1BQU0iLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9saW50ZXItaW50ZWdyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY2xhc3MgTGludGVyIHtcbiAgY29uc3RydWN0b3IocmVnaXN0cnkpIHtcbiAgICB0aGlzLmxpbnRlciA9IHJlZ2lzdHJ5LnJlZ2lzdGVyKHsgbmFtZTogJ0J1aWxkJyB9KTtcbiAgfVxuICBkZXN0cm95KCkge1xuICAgIHRoaXMubGludGVyLmRpc3Bvc2UoKTtcbiAgfVxuICBjbGVhcigpIHtcbiAgICB0aGlzLmxpbnRlci5kZWxldGVNZXNzYWdlcygpO1xuICB9XG4gIHByb2Nlc3NNZXNzYWdlcyhtZXNzYWdlcywgY3dkKSB7XG4gICAgZnVuY3Rpb24gZXh0cmFjdFJhbmdlKGpzb24pIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIFsgKGpzb24ubGluZSB8fCAxKSAtIDEsIChqc29uLmNvbCB8fCAxKSAtIDEgXSxcbiAgICAgICAgWyAoanNvbi5saW5lX2VuZCB8fCBqc29uLmxpbmUgfHwgMSkgLSAxLCAoanNvbi5jb2xfZW5kIHx8IGpzb24uY29sIHx8IDEpIC0gMSBdXG4gICAgICBdO1xuICAgIH1cbiAgICBmdW5jdGlvbiBub3JtYWxpemVQYXRoKHApIHtcbiAgICAgIHJldHVybiByZXF1aXJlKCdwYXRoJykuaXNBYnNvbHV0ZShwKSA/IHAgOiByZXF1aXJlKCdwYXRoJykuam9pbihjd2QsIHApO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0eXBlVG9TZXZlcml0eSh0eXBlKSB7XG4gICAgICBzd2l0Y2ggKHR5cGUgJiYgdHlwZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgJ2Vycic6XG4gICAgICAgIGNhc2UgJ2Vycm9yJzogcmV0dXJuICdlcnJvcic7XG4gICAgICAgIGNhc2UgJ3dhcm4nOlxuICAgICAgICBjYXNlICd3YXJuaW5nJzogcmV0dXJuICd3YXJuaW5nJztcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGludGVyLnNldE1lc3NhZ2VzKG1lc3NhZ2VzLm1hcChtYXRjaCA9PiAoe1xuICAgICAgdHlwZTogbWF0Y2gudHlwZSB8fCAnRXJyb3InLFxuICAgICAgdGV4dDogbWF0Y2gubWVzc2FnZSB8fCAnRXJyb3IgZnJvbSBidWlsZCcsXG4gICAgICBmaWxlUGF0aDogbm9ybWFsaXplUGF0aChtYXRjaC5maWxlKSxcbiAgICAgIHNldmVyaXR5OiB0eXBlVG9TZXZlcml0eShtYXRjaC50eXBlKSxcbiAgICAgIHJhbmdlOiBleHRyYWN0UmFuZ2UobWF0Y2gpLFxuICAgICAgdHJhY2U6IG1hdGNoLnRyYWNlICYmIG1hdGNoLnRyYWNlLm1hcCh0cmFjZSA9PiAoe1xuICAgICAgICB0eXBlOiB0cmFjZS50eXBlIHx8ICdUcmFjZScsXG4gICAgICAgIHRleHQ6IHRyYWNlLm1lc3NhZ2UgfHwgJ1RyYWNlIGluIGJ1aWxkJyxcbiAgICAgICAgZmlsZVBhdGg6IHRyYWNlLmZpbGUgJiYgbm9ybWFsaXplUGF0aCh0cmFjZS5maWxlKSxcbiAgICAgICAgc2V2ZXJpdHk6IHR5cGVUb1NldmVyaXR5KHRyYWNlLnR5cGUpIHx8ICdpbmZvJyxcbiAgICAgICAgcmFuZ2U6IGV4dHJhY3RSYW5nZSh0cmFjZSlcbiAgICAgIH0pKVxuICAgIH0pKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGludGVyO1xuIl19
//# sourceURL=/Users/naver/.atom/packages/build/lib/linter-integration.js
