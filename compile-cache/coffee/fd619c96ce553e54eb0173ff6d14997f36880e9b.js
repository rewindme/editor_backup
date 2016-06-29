(function() {
  var DeprecationView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = DeprecationView = (function(_super) {
    __extends(DeprecationView, _super);

    function DeprecationView() {
      this.close = __bind(this.close, this);
      return DeprecationView.__super__.constructor.apply(this, arguments);
    }

    DeprecationView.content = function() {
      return this.div({
        "class": 'coffeescript-preview deprecation-notice'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top'
          }, function() {
            return _this.div({
              "class": "tool-panel panel-bottom"
            }, function() {
              return _this.div({
                "class": "inset-panel"
              }, function() {
                _this.div({
                  "class": "panel-heading"
                }, function() {
                  _this.div({
                    "class": 'btn-toolbar pull-right'
                  }, function() {
                    return _this.button({
                      "class": 'btn',
                      click: 'close'
                    }, 'Close');
                  });
                  return _this.span({
                    "class": 'text-error'
                  }, 'IMPORTANT: CoffeeScript Preview has been Deprecated!');
                });
                return _this.div({
                  "class": "panel-body padded"
                }, function() {
                  _this.span({
                    "class": 'text-warning'
                  }, 'CoffeeScript Preview has been deprecated. Please migrate to the Preview package for Atom. ');
                  return _this.a({
                    href: 'https://github.com/Glavin001/atom-preview'
                  }, "Click here to see the Preview package for Atom");
                });
              });
            });
          });
        };
      })(this));
    };

    DeprecationView.prototype.close = function(event, element) {
      return this.detach();
    };

    return DeprecationView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3ByZXZpZXcvc3BlYy9zYW1wbGVzL3NwYWNlcGVuLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBTyx5Q0FBUDtPQURGLEVBQ29ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2hELEtBQUMsQ0FBQSxHQUFELENBQ0U7QUFBQSxZQUFBLE9BQUEsRUFBTyxrQkFBUDtXQURGLEVBQzZCLFNBQUEsR0FBQTttQkFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLHlCQUFQO2FBQUwsRUFBdUMsU0FBQSxHQUFBO3FCQUNyQyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGFBQVA7ZUFBTCxFQUEyQixTQUFBLEdBQUE7QUFDekIsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLFNBQUEsR0FBQTtBQUMzQixrQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsb0JBQUEsT0FBQSxFQUFPLHdCQUFQO21CQUFMLEVBQXNDLFNBQUEsR0FBQTsyQkFDcEMsS0FBQyxDQUFBLE1BQUQsQ0FDRTtBQUFBLHNCQUFBLE9BQUEsRUFBTyxLQUFQO0FBQUEsc0JBQ0EsS0FBQSxFQUFPLE9BRFA7cUJBREYsRUFHRSxPQUhGLEVBRG9DO2tCQUFBLENBQXRDLENBQUEsQ0FBQTt5QkFLQSxLQUFDLENBQUEsSUFBRCxDQUNFO0FBQUEsb0JBQUEsT0FBQSxFQUFPLFlBQVA7bUJBREYsRUFFRSxzREFGRixFQU4yQjtnQkFBQSxDQUE3QixDQUFBLENBQUE7dUJBU0EsS0FBQyxDQUFBLEdBQUQsQ0FDRTtBQUFBLGtCQUFBLE9BQUEsRUFBTyxtQkFBUDtpQkFERixFQUVFLFNBQUEsR0FBQTtBQUNFLGtCQUFBLEtBQUMsQ0FBQSxJQUFELENBQ0U7QUFBQSxvQkFBQSxPQUFBLEVBQU8sY0FBUDttQkFERixFQUVFLDRGQUZGLENBQUEsQ0FBQTt5QkFHQSxLQUFDLENBQUEsQ0FBRCxDQUNFO0FBQUEsb0JBQUEsSUFBQSxFQUFNLDJDQUFOO21CQURGLEVBRUUsZ0RBRkYsRUFKRjtnQkFBQSxDQUZGLEVBVnlCO2NBQUEsQ0FBM0IsRUFEcUM7WUFBQSxDQUF2QyxFQUR5QjtVQUFBLENBRDdCLEVBRGdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEcEQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw4QkF5QkEsS0FBQSxHQUFPLFNBQUMsS0FBRCxFQUFRLE9BQVIsR0FBQTthQUNMLElBQUMsQ0FBQSxNQUFELENBQUEsRUFESztJQUFBLENBekJQLENBQUE7OzJCQUFBOztLQUQ0QixLQUg5QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/preview/spec/samples/spacepen.coffee
