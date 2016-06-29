(function() {
  var SelectListView, SelectRendererView, renderers,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectListView = require('atom-space-pen-views').SelectListView;

  renderers = require('./renderer');

  module.exports = SelectRendererView = (function(_super) {
    __extends(SelectRendererView, _super);

    function SelectRendererView() {
      this.toggle = __bind(this.toggle, this);
      this.attach = __bind(this.attach, this);
      return SelectRendererView.__super__.constructor.apply(this, arguments);
    }

    SelectRendererView.prototype.initialize = function(previewView) {
      var grammars;
      this.previewView = previewView;
      SelectRendererView.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      grammars = Object.keys(renderers.grammars);
      this.setItems(grammars);
      return this.focusFilterEditor();
    };

    SelectRendererView.prototype.viewForItem = function(item) {
      return "<li>" + item + "</li>";
    };

    SelectRendererView.prototype.confirmed = function(item) {
      var e;
      this.previewView.renderPreviewWithRenderer(item);
      try {
        return this.detach();
      } catch (_error) {
        e = _error;
      }
    };

    SelectRendererView.prototype.attach = function() {
      return atom.workspace.addTopPanel({
        item: this
      });
    };

    SelectRendererView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        return this.attach();
      }
    };

    return SelectRendererView;

  })(SelectListView);

}).call(this);
