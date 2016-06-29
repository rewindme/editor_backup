(function() {
  var $, Emitter, Header, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Emitter = require('atom').Emitter;

  _ref = require('space-pen'), View = _ref.View, $ = _ref.$;

  Header = (function(_super) {
    __extends(Header, _super);

    function Header() {
      this.onDidFinishResizing = __bind(this.onDidFinishResizing, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      this.setTitle = __bind(this.setTitle, this);
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.content = function(title) {
      return this.div({
        "class": 'bottom-dock-header'
      }, (function(_this) {
        return function() {
          _this.div({
            outlet: 'resizeHandle',
            "class": 'dock-resize-handle'
          });
          return _this.span({
            outlet: 'title',
            "class": 'title'
          });
        };
      })(this));
    };

    Header.prototype.setTitle = function(title) {
      return this.title.text(title);
    };

    Header.prototype.initialize = function(title) {
      if (title != null) {
        this.setTitle(title);
      }
      this.handleEvents();
      return this.emitter = new Emitter();
    };

    Header.prototype.resizeStarted = function() {
      $(document).on('mousemove', this.resizePane);
      return $(document).on('mouseup', this.resizeStopped);
    };

    Header.prototype.resizeStopped = function() {
      $(document).off('mousemove', this.resizePane);
      $(document).off('mouseup', this.resizeStopped);
      return this.emitter.emit('header:resize:finished');
    };

    Header.prototype.onDidFinishResizing = function(callback) {
      return this.emitter.on('header:resize:finished', callback);
    };

    Header.prototype.resizePane = function(_arg) {
      var height, pageY, which;
      pageY = _arg.pageY, which = _arg.which;
      height = $(document.body).height() - pageY - $('.tab-manager').height() - $('.bottom-dock-header').height();
      if ($('.status-bar')) {
        height -= $('.status-bar').height();
      }
      $('.pane-manager').height(height);
      $('.pane-manager').trigger('update');
      return $('.pane-manager').on('update', function() {});
    };

    Header.prototype.handleEvents = function() {
      return this.on('mousedown', '.dock-resize-handle', (function(_this) {
        return function(e) {
          return _this.resizeStarted(e);
        };
      })(this));
    };

    Header.prototype.destroy = function() {
      this.resizeStopped();
      return this.remove();
    };

    return Header;

  })(View);

  module.exports = Header;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi92aWV3cy9oZWFkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFlBQUEsSUFBRCxFQUFPLFNBQUEsQ0FEUCxDQUFBOztBQUFBLEVBR007QUFDSiw2QkFBQSxDQUFBOzs7Ozs7OztLQUFBOztBQUFBLElBQUEsTUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxvQkFBUDtPQUFMLEVBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDaEMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxNQUFBLEVBQVEsY0FBUjtBQUFBLFlBQXdCLE9BQUEsRUFBTyxvQkFBL0I7V0FBTCxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsTUFBQSxFQUFRLE9BQVI7QUFBQSxZQUFpQixPQUFBLEVBQU8sT0FBeEI7V0FBTixFQUZnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEscUJBS0EsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksS0FBWixFQURRO0lBQUEsQ0FMVixDQUFBOztBQUFBLHFCQVFBLFVBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtBQUNWLE1BQUEsSUFBbUIsYUFBbkI7QUFBQSxRQUFBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixDQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsT0FBQSxDQUFBLEVBSEw7SUFBQSxDQVJaLENBQUE7O0FBQUEscUJBYUEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLEVBQVosQ0FBZSxXQUFmLEVBQTRCLElBQUMsQ0FBQSxVQUE3QixDQUFBLENBQUE7YUFDQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsRUFBWixDQUFlLFNBQWYsRUFBMEIsSUFBQyxDQUFBLGFBQTNCLEVBRmE7SUFBQSxDQWJmLENBQUE7O0FBQUEscUJBaUJBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQWdCLFdBQWhCLEVBQTZCLElBQUMsQ0FBQSxVQUE5QixDQUFBLENBQUE7QUFBQSxNQUNBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQWdCLFNBQWhCLEVBQTJCLElBQUMsQ0FBQSxhQUE1QixDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyx3QkFBZCxFQUhhO0lBQUEsQ0FqQmYsQ0FBQTs7QUFBQSxxQkFzQkEsbUJBQUEsR0FBcUIsU0FBQyxRQUFELEdBQUE7YUFDbkIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksd0JBQVosRUFBc0MsUUFBdEMsRUFEbUI7SUFBQSxDQXRCckIsQ0FBQTs7QUFBQSxxQkF5QkEsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsVUFBQSxvQkFBQTtBQUFBLE1BRFksYUFBQSxPQUFPLGFBQUEsS0FDbkIsQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLENBQUEsQ0FBRSxRQUFRLENBQUMsSUFBWCxDQUFnQixDQUFDLE1BQWpCLENBQUEsQ0FBQSxHQUE0QixLQUE1QixHQUFvQyxDQUFBLENBQUUsY0FBRixDQUFpQixDQUFDLE1BQWxCLENBQUEsQ0FBcEMsR0FBaUUsQ0FBQSxDQUFFLHFCQUFGLENBQXdCLENBQUMsTUFBekIsQ0FBQSxDQUExRSxDQUFBO0FBQ0EsTUFBQSxJQUF1QyxDQUFBLENBQUUsYUFBRixDQUF2QztBQUFBLFFBQUEsTUFBQSxJQUFVLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsTUFBakIsQ0FBQSxDQUFWLENBQUE7T0FEQTtBQUFBLE1BR0EsQ0FBQSxDQUFFLGVBQUYsQ0FBa0IsQ0FBQyxNQUFuQixDQUEwQixNQUExQixDQUhBLENBQUE7QUFBQSxNQUlBLENBQUEsQ0FBRSxlQUFGLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsUUFBM0IsQ0FKQSxDQUFBO2FBS0EsQ0FBQSxDQUFFLGVBQUYsQ0FBa0IsQ0FBQyxFQUFuQixDQUFzQixRQUF0QixFQUFnQyxTQUFBLEdBQUEsQ0FBaEMsRUFOVTtJQUFBLENBekJaLENBQUE7O0FBQUEscUJBaUNBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixJQUFDLENBQUEsRUFBRCxDQUFJLFdBQUosRUFBaUIscUJBQWpCLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtpQkFBTyxLQUFDLENBQUEsYUFBRCxDQUFlLENBQWYsRUFBUDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDLEVBRFk7SUFBQSxDQWpDZCxDQUFBOztBQUFBLHFCQW9DQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsYUFBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFGTztJQUFBLENBcENULENBQUE7O2tCQUFBOztLQURtQixLQUhyQixDQUFBOztBQUFBLEVBNENBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BNUNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/views/header.coffee
