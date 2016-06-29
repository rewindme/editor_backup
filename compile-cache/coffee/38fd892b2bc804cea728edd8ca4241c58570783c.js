(function() {
  var Emitter, TabButton, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Emitter = require('atom').Emitter;

  View = require('space-pen').View;

  TabButton = (function(_super) {
    __extends(TabButton, _super);

    function TabButton() {
      this.clicked = __bind(this.clicked, this);
      return TabButton.__super__.constructor.apply(this, arguments);
    }

    TabButton.content = function(config) {
      return this.button({
        click: 'clicked',
        "class": 'tab-button'
      }, config.title);
    };

    TabButton.prototype.clicked = function() {
      return this.emitter.emit('tab:button:clicked', this.getId());
    };

    TabButton.prototype.initialize = function(config) {
      this.title = config.title;
      this.id = "tab-button-" + config.id;
      this.setActive(config.active);
      return this.emitter = new Emitter();
    };

    TabButton.prototype.getId = function() {
      return this.id.split('tab-button-')[1];
    };

    TabButton.prototype.isActive = function() {
      return this.active;
    };

    TabButton.prototype.setActive = function(value) {
      this.active = value;
      if (this.active) {
        return this.addClass('selected');
      } else {
        return this.removeClass('selected');
      }
    };

    TabButton.prototype.onDidClick = function(callback) {
      return this.emitter.on('tab:button:clicked', callback);
    };

    TabButton.prototype.destroy = function() {
      return this.remove();
    };

    return TabButton;

  })(View);

  module.exports = TabButton;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi92aWV3cy90YWItYnV0dG9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR007QUFDSixnQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxRQUFBLEtBQUEsRUFBTyxTQUFQO0FBQUEsUUFBa0IsT0FBQSxFQUFPLFlBQXpCO09BQVIsRUFBK0MsTUFBTSxDQUFDLEtBQXRELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsd0JBR0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLG9CQUFkLEVBQW9DLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBcEMsRUFETztJQUFBLENBSFQsQ0FBQTs7QUFBQSx3QkFNQSxVQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsTUFBTSxDQUFDLEtBQWhCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxFQUFELEdBQU8sYUFBQSxHQUFhLE1BQU0sQ0FBQyxFQUQzQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQU0sQ0FBQyxNQUFsQixDQUZBLENBQUE7YUFJQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsT0FBQSxDQUFBLEVBTEw7SUFBQSxDQU5aLENBQUE7O0FBQUEsd0JBYUEsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxFQUFFLENBQUMsS0FBSixDQUFVLGFBQVYsQ0FBeUIsQ0FBQSxDQUFBLEVBRHBCO0lBQUEsQ0FiUCxDQUFBOztBQUFBLHdCQWdCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLE9BRE87SUFBQSxDQWhCVixDQUFBOztBQUFBLHdCQW1CQSxTQUFBLEdBQVcsU0FBQyxLQUFELEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FBVixDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFKO2VBQWdCLElBQUMsQ0FBQSxRQUFELENBQVUsVUFBVixFQUFoQjtPQUFBLE1BQUE7ZUFBMEMsSUFBQyxDQUFBLFdBQUQsQ0FBYSxVQUFiLEVBQTFDO09BRlM7SUFBQSxDQW5CWCxDQUFBOztBQUFBLHdCQXVCQSxVQUFBLEdBQVksU0FBQyxRQUFELEdBQUE7YUFDVixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxvQkFBWixFQUFrQyxRQUFsQyxFQURVO0lBQUEsQ0F2QlosQ0FBQTs7QUFBQSx3QkEwQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxNQUFELENBQUEsRUFETztJQUFBLENBMUJULENBQUE7O3FCQUFBOztLQURzQixLQUh4QixDQUFBOztBQUFBLEVBaUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBakNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/views/tab-button.coffee
