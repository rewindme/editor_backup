(function() {
  var CliStatusView, CompositeDisposable, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  module.exports = CliStatusView = (function(_super) {
    __extends(CliStatusView, _super);

    function CliStatusView() {
      return CliStatusView.__super__.constructor.apply(this, arguments);
    }

    CliStatusView.content = function() {
      return this.div({
        "class": 'cli-status inline-block'
      }, (function(_this) {
        return function() {
          return _this.span({
            outlet: 'termStatusContainer'
          }, function() {
            return _this.span({
              click: 'newTermClick',
              outlet: 'termStatusAdd',
              "class": "cli-status icon icon-plus"
            });
          });
        };
      })(this));
    };

    CliStatusView.prototype.commandViews = [];

    CliStatusView.prototype.activeIndex = 0;

    CliStatusView.prototype.toolTipDisposable = null;

    CliStatusView.prototype.initialize = function(serializeState) {
      var _ref;
      atom.commands.add('atom-workspace', {
        'terminal-panel:new': (function(_this) {
          return function() {
            return _this.newTermClick();
          };
        })(this),
        'terminal-panel:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'terminal-panel:next': (function(_this) {
          return function() {
            return _this.activeNextCommandView();
          };
        })(this),
        'terminal-panel:prev': (function(_this) {
          return function() {
            return _this.activePrevCommandView();
          };
        })(this),
        'terminal-panel:destroy': (function(_this) {
          return function() {
            return _this.destroyActiveTerm();
          };
        })(this)
      });
      atom.commands.add('.cli-status', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
      this.attach();
      if ((_ref = this.toolTipDisposable) != null) {
        _ref.dispose();
      }
      return this.toolTipDisposable = atom.tooltips.add(this.termStatusAdd, {
        title: "Add a terminal panel"
      });
    };

    CliStatusView.prototype.createCommandView = function() {
      var CommandOutputView, commandOutputView, domify, termStatus;
      domify = require('domify');
      CommandOutputView = require('./command-output-view');
      termStatus = domify('<span class="cli-status icon icon-terminal"></span>');
      commandOutputView = new CommandOutputView;
      commandOutputView.statusIcon = termStatus;
      commandOutputView.statusView = this;
      this.commandViews.push(commandOutputView);
      termStatus.addEventListener('click', function() {
        return commandOutputView.toggle();
      });
      this.termStatusContainer.append(termStatus);
      return commandOutputView;
    };

    CliStatusView.prototype.activeNextCommandView = function() {
      return this.activeCommandView(this.activeIndex + 1);
    };

    CliStatusView.prototype.activePrevCommandView = function() {
      return this.activeCommandView(this.activeIndex - 1);
    };

    CliStatusView.prototype.activeCommandView = function(index) {
      if (index >= this.commandViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.commandViews.length - 1;
      }
      return this.commandViews[index] && this.commandViews[index].open();
    };

    CliStatusView.prototype.setActiveCommandView = function(commandView) {
      return this.activeIndex = this.commandViews.indexOf(commandView);
    };

    CliStatusView.prototype.removeCommandView = function(commandView) {
      var index;
      index = this.commandViews.indexOf(commandView);
      return index >= 0 && this.commandViews.splice(index, 1);
    };

    CliStatusView.prototype.newTermClick = function() {
      return this.createCommandView().toggle();
    };

    CliStatusView.prototype.attach = function() {
      return document.querySelector("status-bar").addLeftTile({
        item: this,
        priority: 100
      });
    };

    CliStatusView.prototype.destroyActiveTerm = function() {
      var _ref;
      return (_ref = this.commandViews[this.activeIndex]) != null ? _ref.destroy() : void 0;
    };

    CliStatusView.prototype.destroy = function() {
      var index, _i, _ref;
      for (index = _i = _ref = this.commandViews.length; _ref <= 0 ? _i <= 0 : _i >= 0; index = _ref <= 0 ? ++_i : --_i) {
        this.removeCommandView(this.commandViews[index]);
      }
      return this.detach();
    };

    CliStatusView.prototype.toggle = function() {
      if (this.commandViews[this.activeIndex] == null) {
        this.createCommandView();
      }
      return this.commandViews[this.activeIndex].toggle();
    };

    return CliStatusView;

  })(View);

}).call(this);
