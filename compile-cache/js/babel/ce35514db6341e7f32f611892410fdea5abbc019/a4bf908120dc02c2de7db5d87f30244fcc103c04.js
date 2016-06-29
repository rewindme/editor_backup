Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var StatusBarView = (function (_View) {
  _inherits(StatusBarView, _View);

  function StatusBarView(statusBar) {
    var _this = this;

    _classCallCheck(this, StatusBarView);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _get(Object.getPrototypeOf(StatusBarView.prototype), 'constructor', this).apply(this, args);
    this.statusBar = statusBar;
    atom.config.observe('build.statusBar', function () {
      return _this.attach();
    });
    atom.config.observe('build.statusBarPriority', function () {
      return _this.attach();
    });
  }

  _createClass(StatusBarView, [{
    key: 'attach',
    value: function attach() {
      var _this2 = this;

      this.destroy();

      var orientation = atom.config.get('build.statusBar');
      if ('Disable' === orientation) {
        return;
      }

      this.statusBarTile = this.statusBar['add' + orientation + 'Tile']({
        item: this,
        priority: atom.config.get('build.statusBarPriority')
      });

      this.tooltip = atom.tooltips.add(this, {
        title: function title() {
          return _this2.tooltipMessage();
        }
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.statusBarTile) {
        this.statusBarTile.destroy();
        this.statusBarTile = null;
      }

      if (this.tooltip) {
        this.tooltip.dispose();
        this.tooltip = null;
      }
    }
  }, {
    key: 'tooltipMessage',
    value: function tooltipMessage() {
      var statusMessage = undefined === this.success ? '' : 'Last build ' + (this.success ? 'succeeded' : 'failed') + '!';
      return 'Current build target is \'' + this.element.textContent + '\'<br />' + statusMessage;
    }
  }, {
    key: 'setClasses',
    value: function setClasses(classes) {
      this.targetView.removeClass('status-unknown status-success status-error spin icon-gear icon-check icon-flame');
      this.targetView.addClass(classes);
    }
  }, {
    key: 'setTarget',
    value: function setTarget(t) {
      if (this.target === t) {
        return;
      }

      this.target = t;
      this.message.text(t || '');
      this.setClasses();
    }
  }, {
    key: 'buildAborted',
    value: function buildAborted() {
      this.setBuildSuccess(false);
    }
  }, {
    key: 'setBuildSuccess',
    value: function setBuildSuccess(success) {
      this.success = success;
      this.setClasses(success ? 'status-success icon-check' : 'status-error icon-flame');
    }
  }, {
    key: 'buildStarted',
    value: function buildStarted() {
      this.setClasses('icon-gear spin');
    }
  }, {
    key: 'onClick',
    value: function onClick(cb) {
      this.onClick = cb;
    }
  }, {
    key: 'clicked',
    value: function clicked() {
      this.onClick && this.onClick();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      this.div({ id: 'build-status-bar', 'class': 'inline-block' }, function () {
        _this3.span({ outlet: 'targetView' });
        _this3.a({ click: 'clicked', outlet: 'message' });
      });
    }
  }]);

  return StatusBarView;
})(_atomSpacePenViews.View);

exports['default'] = StatusBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvc3RhdHVzLWJhci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztpQ0FFcUIsc0JBQXNCOztBQUYzQyxXQUFXLENBQUM7O0lBSVMsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxDQUNwQixTQUFTLEVBQVc7OzswQkFEYixhQUFhOztzQ0FDTixJQUFJO0FBQUosVUFBSTs7O0FBQzVCLCtCQUZpQixhQUFhLDhDQUVyQixJQUFJLEVBQUU7QUFDZixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTthQUFNLE1BQUssTUFBTSxFQUFFO0tBQUEsQ0FBQyxDQUFDO0FBQzVELFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUF5QixFQUFFO2FBQU0sTUFBSyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUM7R0FDckU7O2VBTmtCLGFBQWE7O1dBUTFCLGtCQUFHOzs7QUFDUCxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRWYsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2RCxVQUFJLFNBQVMsS0FBSyxXQUFXLEVBQUU7QUFDN0IsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsU0FBTyxXQUFXLFVBQU8sQ0FBQztBQUMzRCxZQUFJLEVBQUUsSUFBSTtBQUNWLGdCQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7T0FDckQsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO0FBQ3JDLGFBQUssRUFBRTtpQkFBTSxPQUFLLGNBQWMsRUFBRTtTQUFBO09BQ25DLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO09BQzNCOztBQUVELFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO09BQ3JCO0tBQ0Y7OztXQVNhLDBCQUFHO0FBQ2YsVUFBTSxhQUFhLEdBQUcsU0FBUyxLQUFLLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxvQkFBaUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLEdBQUcsUUFBUSxDQUFBLE1BQUcsQ0FBQztBQUMvRyw0Q0FBbUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLGdCQUFVLGFBQWEsQ0FBRztLQUN0Rjs7O1dBRVMsb0JBQUMsT0FBTyxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGlGQUFpRixDQUFDLENBQUM7QUFDL0csVUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbkM7OztXQUVRLG1CQUFDLENBQUMsRUFBRTtBQUNYLFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckIsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMzQixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbkI7OztXQUVXLHdCQUFHO0FBQ2IsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3Qjs7O1dBRWMseUJBQUMsT0FBTyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLDJCQUEyQixHQUFHLHlCQUF5QixDQUFDLENBQUM7S0FDcEY7OztXQUVXLHdCQUFHO0FBQ2IsVUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ25DOzs7V0FFTSxpQkFBQyxFQUFFLEVBQUU7QUFDVixVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztLQUNuQjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNoQzs7O1dBOUNhLG1CQUFHOzs7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixFQUFFLFNBQU8sY0FBYyxFQUFFLEVBQUUsWUFBTTtBQUNoRSxlQUFLLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLGVBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztPQUNoRCxDQUFDLENBQUM7S0FDSjs7O1NBM0NrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL3N0YXR1cy1iYXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNCYXJWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHN0YXR1c0JhciwgLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2J1aWxkLnN0YXR1c0JhcicsICgpID0+IHRoaXMuYXR0YWNoKCkpO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2J1aWxkLnN0YXR1c0JhclByaW9yaXR5JywgKCkgPT4gdGhpcy5hdHRhY2goKSk7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG5cbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGF0b20uY29uZmlnLmdldCgnYnVpbGQuc3RhdHVzQmFyJyk7XG4gICAgaWYgKCdEaXNhYmxlJyA9PT0gb3JpZW50YXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXR1c0JhclRpbGUgPSB0aGlzLnN0YXR1c0JhcltgYWRkJHtvcmllbnRhdGlvbn1UaWxlYF0oe1xuICAgICAgaXRlbTogdGhpcyxcbiAgICAgIHByaW9yaXR5OiBhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnN0YXR1c0JhclByaW9yaXR5JylcbiAgICB9KTtcblxuICAgIHRoaXMudG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkKHRoaXMsIHtcbiAgICAgIHRpdGxlOiAoKSA9PiB0aGlzLnRvb2x0aXBNZXNzYWdlKClcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzQmFyVGlsZSkge1xuICAgICAgdGhpcy5zdGF0dXNCYXJUaWxlLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuc3RhdHVzQmFyVGlsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMudG9vbHRpcCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgdGhpcy5kaXYoeyBpZDogJ2J1aWxkLXN0YXR1cy1iYXInLCBjbGFzczogJ2lubGluZS1ibG9jaycgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5zcGFuKHsgb3V0bGV0OiAndGFyZ2V0VmlldycgfSk7XG4gICAgICB0aGlzLmEoeyBjbGljazogJ2NsaWNrZWQnLCBvdXRsZXQ6ICdtZXNzYWdlJ30pO1xuICAgIH0pO1xuICB9XG5cbiAgdG9vbHRpcE1lc3NhZ2UoKSB7XG4gICAgY29uc3Qgc3RhdHVzTWVzc2FnZSA9IHVuZGVmaW5lZCA9PT0gdGhpcy5zdWNjZXNzID8gJycgOiBgTGFzdCBidWlsZCAke3RoaXMuc3VjY2VzcyA/ICdzdWNjZWVkZWQnIDogJ2ZhaWxlZCd9IWA7XG4gICAgcmV0dXJuIGBDdXJyZW50IGJ1aWxkIHRhcmdldCBpcyAnJHt0aGlzLmVsZW1lbnQudGV4dENvbnRlbnR9JzxiciAvPiR7c3RhdHVzTWVzc2FnZX1gO1xuICB9XG5cbiAgc2V0Q2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgdGhpcy50YXJnZXRWaWV3LnJlbW92ZUNsYXNzKCdzdGF0dXMtdW5rbm93biBzdGF0dXMtc3VjY2VzcyBzdGF0dXMtZXJyb3Igc3BpbiBpY29uLWdlYXIgaWNvbi1jaGVjayBpY29uLWZsYW1lJyk7XG4gICAgdGhpcy50YXJnZXRWaWV3LmFkZENsYXNzKGNsYXNzZXMpO1xuICB9XG5cbiAgc2V0VGFyZ2V0KHQpIHtcbiAgICBpZiAodGhpcy50YXJnZXQgPT09IHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldCA9IHQ7XG4gICAgdGhpcy5tZXNzYWdlLnRleHQodCB8fCAnJyk7XG4gICAgdGhpcy5zZXRDbGFzc2VzKCk7XG4gIH1cblxuICBidWlsZEFib3J0ZWQoKSB7XG4gICAgdGhpcy5zZXRCdWlsZFN1Y2Nlc3MoZmFsc2UpO1xuICB9XG5cbiAgc2V0QnVpbGRTdWNjZXNzKHN1Y2Nlc3MpIHtcbiAgICB0aGlzLnN1Y2Nlc3MgPSBzdWNjZXNzO1xuICAgIHRoaXMuc2V0Q2xhc3NlcyhzdWNjZXNzID8gJ3N0YXR1cy1zdWNjZXNzIGljb24tY2hlY2snIDogJ3N0YXR1cy1lcnJvciBpY29uLWZsYW1lJyk7XG4gIH1cblxuICBidWlsZFN0YXJ0ZWQoKSB7XG4gICAgdGhpcy5zZXRDbGFzc2VzKCdpY29uLWdlYXIgc3BpbicpO1xuICB9XG5cbiAgb25DbGljayhjYikge1xuICAgIHRoaXMub25DbGljayA9IGNiO1xuICB9XG5cbiAgY2xpY2tlZCgpIHtcbiAgICB0aGlzLm9uQ2xpY2sgJiYgdGhpcy5vbkNsaWNrKCk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build/lib/status-bar-view.js
