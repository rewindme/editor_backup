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
            "class": 'overlay from-top',
            outlet: 'message'
          });
        };
      })(this));
    };

    return PreviewMessageView;

  })(View);

}).call(this);
