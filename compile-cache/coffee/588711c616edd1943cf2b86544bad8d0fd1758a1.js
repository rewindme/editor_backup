(function() {
  var OptionsView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = OptionsView = (function(_super) {
    __extends(OptionsView, _super);

    function OptionsView() {
      this.selectRenderer = __bind(this.selectRenderer, this);
      this.close = __bind(this.close, this);
      this.toggle = __bind(this.toggle, this);
      this.attach = __bind(this.attach, this);
      return OptionsView.__super__.constructor.apply(this, arguments);
    }

    OptionsView.content = function() {
      return this.div((function(_this) {
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
                  return _this.span('Preview Options');
                });
                return _this.div({
                  "class": "panel-body padded"
                }, function() {
                  return _this.button({
                    "class": 'btn btn-primary inline-block-tight',
                    click: 'selectRenderer'
                  }, 'Select Renderer');
                });
              });
            });
          });
        };
      })(this));
    };

    OptionsView.prototype.initialize = function(previewView) {
      this.previewView = previewView;
    };

    OptionsView.prototype.attach = function() {
      this.previewView.self.append(this);
      return this.previewView.hideMessage();
    };

    OptionsView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        return this.attach();
      }
    };

    OptionsView.prototype.close = function(event, element) {
      return this.detach();
    };

    OptionsView.prototype.selectRenderer = function() {
      return this.previewView.selectRenderer();
    };

    return OptionsView;

  })(View);

}).call(this);
