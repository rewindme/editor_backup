(function() {
  var $, CompositeDisposable, ConflictedEditor, MergeConflictsView, MergeState, ResolverView, View, handleErr, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  MergeState = require('../merge-state').MergeState;

  ConflictedEditor = require('../conflicted-editor').ConflictedEditor;

  ResolverView = require('./resolver-view').ResolverView;

  handleErr = require('./error-view').handleErr;

  MergeConflictsView = (function(_super) {
    __extends(MergeConflictsView, _super);

    function MergeConflictsView() {
      return MergeConflictsView.__super__.constructor.apply(this, arguments);
    }

    MergeConflictsView.instance = null;

    MergeConflictsView.contextApis = [];

    MergeConflictsView.content = function(state, pkg) {
      return this.div({
        "class": 'merge-conflicts tool-panel panel-bottom padded clearfix'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.text('Conflicts');
            _this.span({
              "class": 'pull-right icon icon-fold',
              click: 'minimize'
            }, 'Hide');
            return _this.span({
              "class": 'pull-right icon icon-unfold',
              click: 'restore'
            }, 'Show');
          });
          return _this.div({
            outlet: 'body'
          }, function() {
            _this.div({
              "class": 'conflict-list'
            }, function() {
              return _this.ul({
                "class": 'block list-group',
                outlet: 'pathList'
              }, function() {
                var message, p, _i, _len, _ref1, _ref2, _results;
                _ref1 = state.conflicts;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  _ref2 = _ref1[_i], p = _ref2.path, message = _ref2.message;
                  _results.push(_this.li({
                    click: 'navigate',
                    "data-path": p,
                    "class": 'list-item navigate'
                  }, function() {
                    _this.span({
                      "class": 'inline-block icon icon-diff-modified status-modified path'
                    }, p);
                    return _this.div({
                      "class": 'pull-right'
                    }, function() {
                      _this.button({
                        click: 'resolveFile',
                        "class": 'btn btn-xs btn-success inline-block-tight stage-ready',
                        style: 'display: none'
                      }, state.context.resolveText);
                      _this.span({
                        "class": 'inline-block text-subtle'
                      }, message);
                      _this.progress({
                        "class": 'inline-block',
                        max: 100,
                        value: 0
                      });
                      return _this.span({
                        "class": 'inline-block icon icon-dash staged'
                      });
                    });
                  }));
                }
                return _results;
              });
            });
            return _this.div({
              "class": 'footer block pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-sm',
                click: 'quit'
              }, 'Quit');
            });
          });
        };
      })(this));
    };

    MergeConflictsView.prototype.initialize = function(state, pkg) {
      this.state = state;
      this.pkg = pkg;
      this.subs = new CompositeDisposable;
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(event) {
          var found, li, listElement, p, progress, _i, _len, _ref1;
          p = _this.state.relativize(event.file);
          found = false;
          _ref1 = _this.pathList.children();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            listElement = _ref1[_i];
            li = $(listElement);
            if (li.data('path') === p) {
              found = true;
              progress = li.find('progress')[0];
              progress.max = event.total;
              progress.value = event.resolved;
              if (event.total === event.resolved) {
                li.find('.stage-ready').show();
              }
            }
          }
          if (!found) {
            return console.error("Unrecognized conflict path: " + p);
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidResolveFile((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, {
        'merge-conflicts:entire-file-ours': this.sideResolver('ours'),
        'merge-conflicts:entire-file-theirs': this.sideResolver('theirs')
      }));
    };

    MergeConflictsView.prototype.navigate = function(event, element) {
      var fullPath, repoPath;
      repoPath = element.find(".path").text();
      fullPath = this.state.join(repoPath);
      return atom.workspace.open(fullPath);
    };

    MergeConflictsView.prototype.minimize = function() {
      this.addClass('minimized');
      return this.body.hide('fast');
    };

    MergeConflictsView.prototype.restore = function() {
      this.removeClass('minimized');
      return this.body.show('fast');
    };

    MergeConflictsView.prototype.quit = function() {
      this.pkg.didQuitConflictResolution();
      this.finish();
      return this.state.context.quit(this.state.isRebase);
    };

    MergeConflictsView.prototype.refresh = function() {
      return this.state.reread()["catch"](handleErr).then((function(_this) {
        return function() {
          var icon, item, p, _i, _len, _ref1;
          _ref1 = _this.pathList.find('li');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            p = $(item).data('path');
            icon = $(item).find('.staged');
            icon.removeClass('icon-dash icon-check text-success');
            if (_.contains(_this.state.conflictPaths(), p)) {
              icon.addClass('icon-dash');
            } else {
              icon.addClass('icon-check text-success');
              _this.pathList.find("li[data-path='" + p + "'] .stage-ready").hide();
            }
          }
          if (!_this.state.isEmpty()) {
            return;
          }
          _this.pkg.didCompleteConflictResolution();
          _this.finish();
          return _this.state.context.complete(_this.state.isRebase);
        };
      })(this));
    };

    MergeConflictsView.prototype.finish = function() {
      this.subs.dispose();
      return this.hide('fast', (function(_this) {
        return function() {
          MergeConflictsView.instance = null;
          return _this.remove();
        };
      })(this));
    };

    MergeConflictsView.prototype.sideResolver = function(side) {
      return (function(_this) {
        return function(event) {
          var p;
          p = $(event.target).closest('li').data('path');
          return _this.state.context.checkoutSide(side, p).then(function() {
            var full;
            full = _this.state.join(p);
            _this.pkg.didResolveConflict({
              file: full,
              total: 1,
              resolved: 1
            });
            return atom.workspace.open(p);
          })["catch"](function(err) {
            return handleErr(err);
          });
        };
      })(this);
    };

    MergeConflictsView.prototype.resolveFile = function(event, element) {
      var e, filePath, repoPath, _i, _len, _ref1;
      repoPath = element.closest('li').data('path');
      filePath = this.state.join(repoPath);
      _ref1 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        if (e.getPath() === filePath) {
          e.save();
        }
      }
      return this.state.context.resolveFile(repoPath).then((function(_this) {
        return function() {
          return _this.pkg.didResolveFile({
            file: filePath
          });
        };
      })(this))["catch"](function(err) {
        return handleErr(err);
      });
    };

    MergeConflictsView.registerContextApi = function(contextApi) {
      return this.contextApis.push(contextApi);
    };

    MergeConflictsView.showForContext = function(context, pkg) {
      if (this.instance) {
        this.instance.finish();
      }
      return MergeState.read(context).then((function(_this) {
        return function(state) {
          if (state.isEmpty()) {
            return;
          }
          return _this.openForState(state, pkg);
        };
      })(this))["catch"](handleErr);
    };

    MergeConflictsView.hideForContext = function(context) {
      if (!this.instance) {
        return;
      }
      if (this.instance.state.context !== context) {
        return;
      }
      return this.instance.finish();
    };

    MergeConflictsView.detect = function(pkg) {
      if (this.instance != null) {
        return;
      }
      return Promise.all(this.contextApis.map((function(_this) {
        return function(contextApi) {
          return contextApi.getContext();
        };
      })(this))).then((function(_this) {
        return function(contexts) {
          return Promise.all(_.filter(contexts, Boolean).sort(function(context1, context2) {
            return context2.priority - context1.priority;
          }).map(function(context) {
            return MergeState.read(context);
          }));
        };
      })(this)).then((function(_this) {
        return function(states) {
          var state;
          state = states.find(function(state) {
            return !state.isEmpty();
          });
          if (state == null) {
            atom.notifications.addInfo("Nothing to Merge", {
              detail: "No conflicts here!",
              dismissable: true
            });
            return;
          }
          return _this.openForState(state, pkg);
        };
      })(this))["catch"](handleErr);
    };

    MergeConflictsView.openForState = function(state, pkg) {
      var view;
      view = new MergeConflictsView(state, pkg);
      this.instance = view;
      atom.workspace.addBottomPanel({
        item: view
      });
      return this.instance.subs.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.markConflictsIn(state, editor, pkg);
        };
      })(this)));
    };

    MergeConflictsView.markConflictsIn = function(state, editor, pkg) {
      var e, fullPath, repoPath;
      if (state.isEmpty()) {
        return;
      }
      fullPath = editor.getPath();
      repoPath = state.relativize(fullPath);
      if (repoPath == null) {
        return;
      }
      if (!_.contains(state.conflictPaths(), repoPath)) {
        return;
      }
      e = new ConflictedEditor(state, pkg, editor);
      return e.mark();
    };

    return MergeConflictsView;

  })(View);

  module.exports = {
    MergeConflictsView: MergeConflictsView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvdmlldy9tZXJnZS1jb25mbGljdHMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0hBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlDLGFBQWMsT0FBQSxDQUFRLGdCQUFSLEVBQWQsVUFKRCxDQUFBOztBQUFBLEVBS0MsbUJBQW9CLE9BQUEsQ0FBUSxzQkFBUixFQUFwQixnQkFMRCxDQUFBOztBQUFBLEVBT0MsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSLEVBQWhCLFlBUEQsQ0FBQTs7QUFBQSxFQVFDLFlBQWEsT0FBQSxDQUFRLGNBQVIsRUFBYixTQVJELENBQUE7O0FBQUEsRUFVTTtBQUVKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGtCQUFDLENBQUEsUUFBRCxHQUFXLElBQVgsQ0FBQTs7QUFBQSxJQUNBLGtCQUFDLENBQUEsV0FBRCxHQUFjLEVBRGQsQ0FBQTs7QUFBQSxJQUdBLGtCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsS0FBRCxFQUFRLEdBQVIsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx5REFBUDtPQUFMLEVBQXVFLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDckUsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFB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

//# sourceURL=/Users/naver/.atom/packages/merge-conflicts/lib/view/merge-conflicts-view.coffee
