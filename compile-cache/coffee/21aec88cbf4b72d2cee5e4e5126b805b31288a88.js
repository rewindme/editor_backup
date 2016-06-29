(function() {
  var $, Emitter, Status, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Emitter = require('atom').Emitter;

  _ref = require('space-pen'), View = _ref.View, $ = _ref.$;

  Status = (function(_super) {
    __extends(Status, _super);

    function Status() {
      this.toggleClicked = __bind(this.toggleClicked, this);
      this.setVisiblity = __bind(this.setVisiblity, this);
      return Status.__super__.constructor.apply(this, arguments);
    }

    Status.content = function(config) {
      return this.div({
        "class": 'bottom-dock-status-container inline-block',
        style: 'display: inline-block'
      }, (function(_this) {
        return function() {
          return _this.span('Bottom Dock');
        };
      })(this));
    };

    Status.prototype.initialize = function(config) {
      this.emitter = new Emitter;
      this.setVisiblity(config.visible);
      return this.on('click', this.toggleClicked);
    };

    Status.prototype.setVisiblity = function(value) {
      if (value) {
        return this.show();
      } else {
        return this.hide();
      }
    };

    Status.prototype.toggleClicked = function() {
      return this.emitter.emit('status:toggled');
    };

    Status.prototype.onDidToggle = function(callback) {
      return this.emitter.on('status:toggled', callback);
    };

    return Status;

  })(View);

  module.exports = Status;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi92aWV3cy9zdGF0dXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFlBQUEsSUFBRCxFQUFPLFNBQUEsQ0FEUCxDQUFBOztBQUFBLEVBR007QUFDSiw2QkFBQSxDQUFBOzs7Ozs7S0FBQTs7QUFBQSxJQUFBLE1BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxNQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sMkNBQVA7QUFBQSxRQUFvRCxLQUFBLEVBQU8sdUJBQTNEO09BQUwsRUFBeUYsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDdkYsS0FBQyxDQUFBLElBQUQsQ0FBTSxhQUFOLEVBRHVGO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekYsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxxQkFJQSxVQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFNLENBQUMsT0FBckIsQ0FGQSxDQUFBO2FBSUEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsSUFBQyxDQUFBLGFBQWQsRUFMVTtJQUFBLENBSlosQ0FBQTs7QUFBQSxxQkFZQSxZQUFBLEdBQWMsU0FBQyxLQUFELEdBQUE7QUFDWixNQUFBLElBQUcsS0FBSDtlQUNFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBSEY7T0FEWTtJQUFBLENBWmQsQ0FBQTs7QUFBQSxxQkFrQkEsYUFBQSxHQUFlLFNBQUEsR0FBQTthQUNiLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGdCQUFkLEVBRGE7SUFBQSxDQWxCZixDQUFBOztBQUFBLHFCQXFCQSxXQUFBLEdBQWEsU0FBQyxRQUFELEdBQUE7YUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxnQkFBWixFQUE4QixRQUE5QixFQURXO0lBQUEsQ0FyQmIsQ0FBQTs7a0JBQUE7O0tBRG1CLEtBSHJCLENBQUE7O0FBQUEsRUE0QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUE1QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/views/status.coffee
