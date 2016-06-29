'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GoogleAnalytics = (function () {
  function GoogleAnalytics() {
    _classCallCheck(this, GoogleAnalytics);
  }

  _createClass(GoogleAnalytics, null, [{
    key: 'getCid',
    value: function getCid(cb) {
      var _this = this;

      if (this.cid) {
        cb(this.cid);
        return;
      }

      require('getmac').getMac(function (error, macAddress) {
        return error ? cb(_this.cid = require('node-uuid').v4()) : cb(_this.cid = require('crypto').createHash('sha1').update(macAddress, 'utf8').digest('hex'));
      });
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(category, action, label, value) {
      var params = {
        t: 'event',
        ec: category,
        ea: action
      };
      if (label) {
        params.el = label;
      }
      if (value) {
        params.ev = value;
      }

      this.send(params);
    }
  }, {
    key: 'send',
    value: function send(params) {
      var _this2 = this;

      if (!atom.packages.getActivePackage('metrics')) {
        // If the metrics package is disabled, then user has opted out.
        return;
      }

      GoogleAnalytics.getCid(function (cid) {
        Object.assign(params, { cid: cid }, GoogleAnalytics.defaultParams());
        _this2.request('https://www.google-analytics.com/collect?' + require('querystring').stringify(params));
      });
    }
  }, {
    key: 'request',
    value: function request(url) {
      if (!navigator.onLine) {
        return;
      }
      this.post(url);
    }
  }, {
    key: 'post',
    value: function post(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.send(null);
    }
  }, {
    key: 'defaultParams',
    value: function defaultParams() {
      // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
      return {
        v: 1,
        tid: 'UA-47615700-5'
      };
    }
  }]);

  return GoogleAnalytics;
})();

exports['default'] = GoogleAnalytics;

atom.packages.onDidActivatePackage(function (pkg) {
  if ('metrics' === pkg.name) {
    var buildPackage = atom.packages.getLoadedPackage('build');
    require('./google-analytics').sendEvent('core', 'activated', buildPackage.metadata.version);
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvZ29vZ2xlLWFuYWx5dGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFUyxlQUFlO1dBQWYsZUFBZTswQkFBZixlQUFlOzs7ZUFBZixlQUFlOztXQUNyQixnQkFBQyxFQUFFLEVBQUU7OztBQUNoQixVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDWixVQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsZUFBTztPQUNSOztBQUVELGFBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFLO0FBQzlDLGVBQU8sS0FBSyxHQUNWLEVBQUUsQ0FBQyxNQUFLLEdBQUcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FDeEMsRUFBRSxDQUFDLE1BQUssR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztPQUNoRyxDQUFDLENBQUM7S0FDSjs7O1dBRWUsbUJBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQy9DLFVBQU0sTUFBTSxHQUFHO0FBQ2IsU0FBQyxFQUFFLE9BQU87QUFDVixVQUFFLEVBQUUsUUFBUTtBQUNaLFVBQUUsRUFBRSxNQUFNO09BQ1gsQ0FBQztBQUNGLFVBQUksS0FBSyxFQUFFO0FBQ1QsY0FBTSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7T0FDbkI7QUFDRCxVQUFJLEtBQUssRUFBRTtBQUNULGNBQU0sQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO09BQ25COztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbkI7OztXQUVVLGNBQUMsTUFBTSxFQUFFOzs7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEVBQUU7O0FBRTlDLGVBQU87T0FDUjs7QUFFRCxxQkFBZSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUM5QixjQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUNyRSxlQUFLLE9BQU8sQ0FBQywyQ0FBMkMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7T0FDdEcsQ0FBQyxDQUFDO0tBQ0o7OztXQUVhLGlCQUFDLEdBQUcsRUFBRTtBQUNsQixVQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUNyQixlQUFPO09BQ1I7QUFDRCxVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hCOzs7V0FFVSxjQUFDLEdBQUcsRUFBRTtBQUNmLFVBQU0sR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7QUFDakMsU0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEIsU0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNoQjs7O1dBRW1CLHlCQUFHOztBQUVyQixhQUFPO0FBQ0wsU0FBQyxFQUFFLENBQUM7QUFDSixXQUFHLEVBQUUsZUFBZTtPQUNyQixDQUFDO0tBQ0g7OztTQTdEa0IsZUFBZTs7O3FCQUFmLGVBQWU7O0FBZ0VwQyxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQzFDLE1BQUksU0FBUyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUU7QUFDMUIsUUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3RCxXQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQzdGO0NBQ0YsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvZ29vZ2xlLWFuYWx5dGljcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHb29nbGVBbmFseXRpY3Mge1xuICBzdGF0aWMgZ2V0Q2lkKGNiKSB7XG4gICAgaWYgKHRoaXMuY2lkKSB7XG4gICAgICBjYih0aGlzLmNpZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVxdWlyZSgnZ2V0bWFjJykuZ2V0TWFjKChlcnJvciwgbWFjQWRkcmVzcykgPT4ge1xuICAgICAgcmV0dXJuIGVycm9yID9cbiAgICAgICAgY2IodGhpcy5jaWQgPSByZXF1aXJlKCdub2RlLXV1aWQnKS52NCgpKSA6XG4gICAgICAgIGNiKHRoaXMuY2lkID0gcmVxdWlyZSgnY3J5cHRvJykuY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShtYWNBZGRyZXNzLCAndXRmOCcpLmRpZ2VzdCgnaGV4JykpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHNlbmRFdmVudChjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUpIHtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICB0OiAnZXZlbnQnLFxuICAgICAgZWM6IGNhdGVnb3J5LFxuICAgICAgZWE6IGFjdGlvblxuICAgIH07XG4gICAgaWYgKGxhYmVsKSB7XG4gICAgICBwYXJhbXMuZWwgPSBsYWJlbDtcbiAgICB9XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBwYXJhbXMuZXYgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbmQocGFyYW1zKTtcbiAgfVxuXG4gIHN0YXRpYyBzZW5kKHBhcmFtcykge1xuICAgIGlmICghYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdtZXRyaWNzJykpIHtcbiAgICAgIC8vIElmIHRoZSBtZXRyaWNzIHBhY2thZ2UgaXMgZGlzYWJsZWQsIHRoZW4gdXNlciBoYXMgb3B0ZWQgb3V0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIEdvb2dsZUFuYWx5dGljcy5nZXRDaWQoKGNpZCkgPT4ge1xuICAgICAgT2JqZWN0LmFzc2lnbihwYXJhbXMsIHsgY2lkOiBjaWQgfSwgR29vZ2xlQW5hbHl0aWNzLmRlZmF1bHRQYXJhbXMoKSk7XG4gICAgICB0aGlzLnJlcXVlc3QoJ2h0dHBzOi8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2NvbGxlY3Q/JyArIHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJykuc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHJlcXVlc3QodXJsKSB7XG4gICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucG9zdCh1cmwpO1xuICB9XG5cbiAgc3RhdGljIHBvc3QodXJsKSB7XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwpO1xuICAgIHhoci5zZW5kKG51bGwpO1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQYXJhbXMoKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vYW5hbHl0aWNzL2Rldmd1aWRlcy9jb2xsZWN0aW9uL3Byb3RvY29sL3YxL3BhcmFtZXRlcnNcbiAgICByZXR1cm4ge1xuICAgICAgdjogMSxcbiAgICAgIHRpZDogJ1VBLTQ3NjE1NzAwLTUnXG4gICAgfTtcbiAgfVxufVxuXG5hdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVQYWNrYWdlKChwa2cpID0+IHtcbiAgaWYgKCdtZXRyaWNzJyA9PT0gcGtnLm5hbWUpIHtcbiAgICBjb25zdCBidWlsZFBhY2thZ2UgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ2J1aWxkJyk7XG4gICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdjb3JlJywgJ2FjdGl2YXRlZCcsIGJ1aWxkUGFja2FnZS5tZXRhZGF0YS52ZXJzaW9uKTtcbiAgfVxufSk7XG4iXX0=
//# sourceURL=/Users/naver/.atom/packages/build/lib/google-analytics.js
