(function() {
  var $, CompositeDisposable, DockPaneManager, Emitter, View, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), View = _ref.View, $ = _ref.$;

  _ref1 = require('atom'), Emitter = _ref1.Emitter, CompositeDisposable = _ref1.CompositeDisposable;

  DockPaneManager = (function(_super) {
    __extends(DockPaneManager, _super);

    function DockPaneManager() {
      return DockPaneManager.__super__.constructor.apply(this, arguments);
    }

    DockPaneManager.content = function(params) {
      return this.div({
        "class": 'pane-manager'
      });
    };

    DockPaneManager.prototype.initialize = function(params) {
      var pane, _i, _len, _ref2, _ref3, _results;
      this.panes = [];
      this.currPane = null;
      this.subscriptions = new CompositeDisposable();
      this.emitter = new Emitter();
      if (params != null ? (_ref2 = params.panes) != null ? _ref2.length : void 0 : void 0) {
        _ref3 = params.panes;
        _results = [];
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          pane = _ref3[_i];
          _results.push(this.addPane(pane));
        }
        return _results;
      }
    };

    DockPaneManager.prototype.addPane = function(pane) {
      this.panes.push(pane);
      this.append(pane);
      if (this.panes.length === 2) {
        this.height(this.height() - $('.tab-manager').height());
      }
      return pane;
    };

    DockPaneManager.prototype.changePane = function(id) {
      var pane, _i, _len, _ref2, _results;
      _ref2 = this.panes;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        pane = _ref2[_i];
        if (pane.getId() === String(id)) {
          pane.setActive(true);
          _results.push(this.currPane = pane);
        } else {
          _results.push(pane.setActive(false));
        }
      }
      return _results;
    };

    DockPaneManager.prototype.getPane = function(id) {
      var pane;
      return ((function() {
        var _i, _len, _ref2, _results;
        _ref2 = this.panes;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          pane = _ref2[_i];
          if (pane.getId() === String(id)) {
            _results.push(pane);
          }
        }
        return _results;
      }).call(this))[0];
    };

    DockPaneManager.prototype.getCurrentPane = function() {
      return this.currPane;
    };

    DockPaneManager.prototype.deletePane = function(id) {
      var pane;
      pane = ((function() {
        var _i, _len, _ref2, _results;
        _ref2 = this.panes;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          pane = _ref2[_i];
          if (pane.getId() === String(id)) {
            _results.push(pane);
          }
        }
        return _results;
      }).call(this))[0];
      if (!pane) {
        return false;
      }
      if (this.currPane.getId() === String(id)) {
        this.currPane = null;
      }
      pane.destroy();
      this.panes = (function() {
        var _i, _len, _ref2, _results;
        _ref2 = this.panes;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          pane = _ref2[_i];
          if (pane.getId() !== String(id)) {
            _results.push(pane);
          }
        }
        return _results;
      }).call(this);
      if (!this.currPane && this.panes.length) {
        this.changePane(this.panes[this.panes.length - 1].getId());
      }
      if (this.panes.length === 1) {
        this.height(this.height() + $('.tab-manager').height());
      }
      return true;
    };

    DockPaneManager.prototype.paneCount = function() {
      return this.panes.length;
    };

    DockPaneManager.prototype.destroy = function() {
      var pane, _i, _len, _ref2, _results;
      this.subscriptions.dispose();
      _ref2 = this.panes;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        pane = _ref2[_i];
        _results.push(pane.destroy());
      }
      return _results;
    };

    return DockPaneManager;

  })(View);

  module.exports = DockPaneManager;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL2xpYi92aWV3cy9kb2NrLXBhbmUtbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFlBQUEsSUFBRCxFQUFPLFNBQUEsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsUUFBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxnQkFBQSxPQUFELEVBQVUsNEJBQUEsbUJBRFYsQ0FBQTs7QUFBQSxFQUdNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxjQUFQO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw4QkFHQSxVQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixVQUFBLHNDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQURaLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsbUJBQUEsQ0FBQSxDQUZyQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsT0FBQSxDQUFBLENBSGYsQ0FBQTtBQUtBLE1BQUEsMkRBQWdCLENBQUUsd0JBQWxCO0FBQ0U7QUFBQTthQUFBLDRDQUFBOzJCQUFBO0FBQUEsd0JBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULEVBQUEsQ0FBQTtBQUFBO3dCQURGO09BTlU7SUFBQSxDQUhaLENBQUE7O0FB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

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/lib/views/dock-pane-manager.coffee
