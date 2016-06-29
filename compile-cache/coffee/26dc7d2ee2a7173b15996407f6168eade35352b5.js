(function() {
  var CompositeDisposable, ResolverView, View, handleErr,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('space-pen').View;

  handleErr = require('./error-view').handleErr;

  ResolverView = (function(_super) {
    __extends(ResolverView, _super);

    function ResolverView() {
      return ResolverView.__super__.constructor.apply(this, arguments);
    }

    ResolverView.content = function(editor, state, pkg) {
      var resolveText;
      resolveText = state.context.resolveText;
      return this.div({
        "class": 'overlay from-top resolver'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block text-highlight'
          }, "We're done here");
          _this.div({
            "class": 'block'
          }, function() {
            _this.div({
              "class": 'block text-info'
            }, function() {
              return _this.text("You've dealt with all of the conflicts in this file.");
            });
            return _this.div({
              "class": 'block text-info'
            }, function() {
              _this.span({
                outlet: 'actionText'
              }, "Save and " + resolveText);
              return _this.text(' this file?');
            });
          });
          _this.div({
            "class": 'pull-left'
          }, function() {
            return _this.button({
              "class": 'btn btn-primary',
              click: 'dismiss'
            }, 'Maybe Later');
          });
          return _this.div({
            "class": 'pull-right'
          }, function() {
            return _this.button({
              "class": 'btn btn-primary',
              click: 'resolve'
            }, resolveText);
          });
        };
      })(this));
    };

    ResolverView.prototype.initialize = function(editor, state, pkg) {
      this.editor = editor;
      this.state = state;
      this.pkg = pkg;
      this.subs = new CompositeDisposable();
      this.refresh();
      this.subs.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, 'merge-conflicts:quit', (function(_this) {
        return function() {
          return _this.dismiss();
        };
      })(this)));
    };

    ResolverView.prototype.detached = function() {
      return this.subs.dispose();
    };

    ResolverView.prototype.getModel = function() {
      return null;
    };

    ResolverView.prototype.relativePath = function() {
      return this.state.relativize(this.editor.getURI());
    };

    ResolverView.prototype.refresh = function() {
      return this.state.context.isResolvedFile(this.relativePath()).then((function(_this) {
        return function(resolved) {
          var modified, needsResolve, needsSaved, resolveText;
          modified = _this.editor.isModified();
          needsSaved = modified;
          needsResolve = modified || !resolved;
          if (!(needsSaved || needsResolve)) {
            _this.hide('fast', function() {
              return _this.remove();
            });
            _this.pkg.didResolveFile({
              file: _this.editor.getURI()
            });
            return;
          }
          resolveText = _this.state.context.resolveText;
          if (needsSaved) {
            return _this.actionText.text("Save and " + (resolveText.toLowerCase()));
          } else if (needsResolve) {
            return _this.actionText.text(resolveText);
          }
        };
      })(this))["catch"](handleErr);
    };

    ResolverView.prototype.resolve = function() {
      return Promise.resolve(this.editor.save()).then((function(_this) {
        return function() {
          return _this.state.context.resolveFile(_this.relativePath()).then(function() {
            return _this.refresh();
          })["catch"](handleErr);
        };
      })(this));
    };

    ResolverView.prototype.dismiss = function() {
      return this.hide('fast', (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this));
    };

    return ResolverView;

  })(View);

  module.exports = {
    ResolverView: ResolverView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvdmlldy9yZXNvbHZlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR0MsWUFBYSxPQUFBLENBQVEsY0FBUixFQUFiLFNBSEQsQ0FBQTs7QUFBQSxFQUtNO0FBRUosbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLEdBQWhCLEdBQUE7QUFDUixVQUFBLFdBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQTVCLENBQUE7YUFDQSxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sMkJBQVA7T0FBTCxFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3ZDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLHNCQUFQO1dBQUwsRUFBb0MsaUJBQXBDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8saUJBQVA7YUFBTCxFQUErQixTQUFBLEdBQUE7cUJBQzdCLEtBQUMsQ0FBQSxJQUFELENBQU0sc0RBQU4sRUFENkI7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

//# sourceURL=/Users/naver/.atom/packages/merge-conflicts/lib/view/resolver-view.coffee
