(function() {
  var PreviewMessageView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = PreviewMessageView = (function(_super) {
    __extends(PreviewMessageView, _super);

    function PreviewMessageView() {
      return PreviewMessageView.__super__.constructor.apply(this, arguments);
    }

    PreviewMessageView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay preview-overlay-full from-top',
            outlet: 'message'
          });
        };
      })(this));
    };

    return PreviewMessageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3ByZXZpZXcvbGliL3ByZXZpZXctbWVzc2FnZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxrQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ0gsS0FBQyxDQUFBLEdBQUQsQ0FDRTtBQUFBLFlBQUEsT0FBQSxFQUFPLHVDQUFQO0FBQUEsWUFDQSxNQUFBLEVBQVEsU0FEUjtXQURGLEVBREc7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7OzhCQUFBOztLQURnRCxLQURsRCxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/preview/lib/preview-message-view.coffee
