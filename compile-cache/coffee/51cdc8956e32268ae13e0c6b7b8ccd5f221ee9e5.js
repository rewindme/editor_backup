(function() {
  var $, CompositeDisposable, Conflict, ConflictedEditor, Emitter, NavigationView, ResolverView, SideView, _, _ref;

  $ = require('space-pen').$;

  _ = require('underscore-plus');

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  Conflict = require('./conflict').Conflict;

  SideView = require('./view/side-view').SideView;

  NavigationView = require('./view/navigation-view').NavigationView;

  ResolverView = require('./view/resolver-view').ResolverView;

  ConflictedEditor = (function() {
    function ConflictedEditor(state, pkg, editor) {
      this.state = state;
      this.pkg = pkg;
      this.editor = editor;
      this.subs = new CompositeDisposable;
      this.coveringViews = [];
      this.conflicts = [];
    }

    ConflictedEditor.prototype.mark = function() {
      var c, cv, _i, _j, _len, _len1, _ref1, _ref2;
      this.conflicts = Conflict.all(this.state, this.editor);
      this.coveringViews = [];
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        this.coveringViews.push(new SideView(c.ours, this.editor));
        if (c.base != null) {
          this.coveringViews.push(new SideView(c.base, this.editor));
        }
        this.coveringViews.push(new NavigationView(c.navigator, this.editor));
        this.coveringViews.push(new SideView(c.theirs, this.editor));
        this.subs.add(c.onDidResolveConflict((function(_this) {
          return function() {
            var resolvedCount, unresolved, v;
            unresolved = (function() {
              var _j, _len1, _ref2, _results;
              _ref2 = this.coveringViews;
              _results = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                v = _ref2[_j];
                if (!v.conflict().isResolved()) {
                  _results.push(v);
                }
              }
              return _results;
            }).call(_this);
            resolvedCount = _this.conflicts.length - Math.floor(unresolved.length / 3);
            return _this.pkg.didResolveConflict({
              file: _this.editor.getPath(),
              total: _this.conflicts.length,
              resolved: resolvedCount,
              source: _this
            });
          };
        })(this)));
      }
      if (this.conflicts.length > 0) {
        atom.views.getView(this.editor).classList.add('conflicted');
        _ref2 = this.coveringViews;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          cv = _ref2[_j];
          cv.decorate();
        }
        this.installEvents();
        return this.focusConflict(this.conflicts[0]);
      } else {
        this.pkg.didResolveConflict({
          file: this.editor.getPath(),
          total: 1,
          resolved: 1,
          source: this
        });
        return this.conflictsResolved();
      }
    };

    ConflictedEditor.prototype.installEvents = function() {
      this.subs.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.detectDirty();
        };
      })(this)));
      this.subs.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      this.subs.add(atom.commands.add('atom-text-editor', {
        'merge-conflicts:accept-current': (function(_this) {
          return function() {
            return _this.acceptCurrent();
          };
        })(this),
        'merge-conflicts:accept-ours': (function(_this) {
          return function() {
            return _this.acceptOurs();
          };
        })(this),
        'merge-conflicts:accept-theirs': (function(_this) {
          return function() {
            return _this.acceptTheirs();
          };
        })(this),
        'merge-conflicts:ours-then-theirs': (function(_this) {
          return function() {
            return _this.acceptOursThenTheirs();
          };
        })(this),
        'merge-conflicts:theirs-then-ours': (function(_this) {
          return function() {
            return _this.acceptTheirsThenOurs();
          };
        })(this),
        'merge-conflicts:next-unresolved': (function(_this) {
          return function() {
            return _this.nextUnresolved();
          };
        })(this),
        'merge-conflicts:previous-unresolved': (function(_this) {
          return function() {
            return _this.previousUnresolved();
          };
        })(this),
        'merge-conflicts:revert-current': (function(_this) {
          return function() {
            return _this.revertCurrent();
          };
        })(this)
      }));
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(_arg) {
          var file, resolved, total;
          total = _arg.total, resolved = _arg.resolved, file = _arg.file;
          if (file === _this.editor.getPath() && total === resolved) {
            return _this.conflictsResolved();
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidCompleteConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      return this.subs.add(this.pkg.onDidQuitConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
    };

    ConflictedEditor.prototype.cleanup = function() {
      var c, m, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      if (this.editor != null) {
        atom.views.getView(this.editor).classList.remove('conflicted');
      }
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _ref2 = c.markers();
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          m = _ref2[_j];
          m.destroy();
        }
      }
      _ref3 = this.coveringViews;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        v.remove();
      }
      return this.subs.dispose();
    };

    ConflictedEditor.prototype.conflictsResolved = function() {
      return atom.workspace.addTopPanel({
        item: new ResolverView(this.editor, this.state, this.pkg)
      });
    };

    ConflictedEditor.prototype.detectDirty = function() {
      var c, potentials, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
      potentials = [];
      _ref1 = this.editor.getCursors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _ref2 = this.coveringViews;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          v = _ref2[_j];
          if (v.includesCursor(c)) {
            potentials.push(v);
          }
        }
      }
      _ref3 = _.uniq(potentials);
      _results = [];
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        _results.push(v.detectDirty());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptCurrent = function() {
      var duplicates, seen, side, sides, _i, _len;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      sides = this.active();
      duplicates = [];
      seen = {};
      for (_i = 0, _len = sides.length; _i < _len; _i++) {
        side = sides[_i];
        if (side.conflict in seen) {
          duplicates.push(side);
          duplicates.push(seen[side.conflict]);
        }
        seen[side.conflict] = side;
      }
      sides = _.difference(sides, duplicates);
      return this.editor.transact(function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = sides.length; _j < _len1; _j++) {
          side = sides[_j];
          _results.push(side.resolve());
        }
        return _results;
      });
    };

    ConflictedEditor.prototype.acceptOurs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var side, _i, _len, _ref1, _results;
          _ref1 = _this.active();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            side = _ref1[_i];
            _results.push(side.conflict.ours.resolve());
          }
          return _results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptTheirs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var side, _i, _len, _ref1, _results;
          _ref1 = _this.active();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            side = _ref1[_i];
            _results.push(side.conflict.theirs.resolve());
          }
          return _results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptOursThenTheirs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var side, _i, _len, _ref1, _results;
          _ref1 = _this.active();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            side = _ref1[_i];
            _results.push(_this.combineSides(side.conflict.ours, side.conflict.theirs));
          }
          return _results;
        };
      })(this));
    };

    ConflictedEditor.prototype.acceptTheirsThenOurs = function() {
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var side, _i, _len, _ref1, _results;
          _ref1 = _this.active();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            side = _ref1[_i];
            _results.push(_this.combineSides(side.conflict.theirs, side.conflict.ours));
          }
          return _results;
        };
      })(this));
    };

    ConflictedEditor.prototype.nextUnresolved = function() {
      var c, final, firstAfter, lastCursor, n, orderedCursors, p, pos, target, _i, _len, _ref1;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      final = _.last(this.active());
      if (final != null) {
        n = final.conflict.navigator.nextUnresolved();
        if (n != null) {
          return this.focusConflict(n);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        lastCursor = _.last(orderedCursors);
        if (lastCursor == null) {
          return;
        }
        pos = lastCursor.getBufferPosition();
        firstAfter = null;
        _ref1 = this.conflicts;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isGreaterThanOrEqual(pos) && (firstAfter == null)) {
            firstAfter = c;
          }
        }
        if (firstAfter == null) {
          return;
        }
        if (firstAfter.isResolved()) {
          target = firstAfter.navigator.nextUnresolved();
        } else {
          target = firstAfter;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.previousUnresolved = function() {
      var c, firstCursor, initial, lastBefore, orderedCursors, p, pos, target, _i, _len, _ref1;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      initial = _.first(this.active());
      if (initial != null) {
        p = initial.conflict.navigator.previousUnresolved();
        if (p != null) {
          return this.focusConflict(p);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        firstCursor = _.first(orderedCursors);
        if (firstCursor == null) {
          return;
        }
        pos = firstCursor.getBufferPosition();
        lastBefore = null;
        _ref1 = this.conflicts;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isLessThanOrEqual(pos)) {
            lastBefore = c;
          }
        }
        if (lastBefore == null) {
          return;
        }
        if (lastBefore.isResolved()) {
          target = lastBefore.navigator.previousUnresolved();
        } else {
          target = lastBefore;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.revertCurrent = function() {
      var side, view, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push((function() {
          var _j, _len1, _ref2, _results1;
          _ref2 = this.coveringViews;
          _results1 = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            view = _ref2[_j];
            if (view.conflict() === side.conflict) {
              if (view.isDirty()) {
                _results1.push(view.revert());
              } else {
                _results1.push(void 0);
              }
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    ConflictedEditor.prototype.active = function() {
      var c, matching, p, positions, _i, _j, _len, _len1, _ref1;
      positions = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.editor.getCursors();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          _results.push(c.getBufferPosition());
        }
        return _results;
      }).call(this);
      matching = [];
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        for (_j = 0, _len1 = positions.length; _j < _len1; _j++) {
          p = positions[_j];
          if (c.ours.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.ours);
          }
          if (c.theirs.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.theirs);
          }
        }
      }
      return matching;
    };

    ConflictedEditor.prototype.combineSides = function(first, second) {
      var e, insertPoint, text;
      text = this.editor.getTextInBufferRange(second.marker.getBufferRange());
      e = first.marker.getBufferRange().end;
      insertPoint = this.editor.setTextInBufferRange([e, e], text).end;
      first.marker.setHeadBufferPosition(insertPoint);
      first.followingMarker.setTailBufferPosition(insertPoint);
      return first.resolve();
    };

    ConflictedEditor.prototype.focusConflict = function(conflict) {
      var st;
      st = conflict.ours.marker.getBufferRange().start;
      this.editor.scrollToBufferPosition(st, {
        center: true
      });
      return this.editor.setCursorBufferPosition(st, {
        autoscroll: false
      });
    };

    return ConflictedEditor;

  })();

  module.exports = {
    ConflictedEditor: ConflictedEditor
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvY29uZmxpY3RlZC1lZGl0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRHQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsV0FBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFGVixDQUFBOztBQUFBLEVBSUMsV0FBWSxPQUFBLENBQVEsWUFBUixFQUFaLFFBSkQsQ0FBQTs7QUFBQSxFQU1DLFdBQVksT0FBQSxDQUFRLGtCQUFSLEVBQVosUUFORCxDQUFBOztBQUFBLEVBT0MsaUJBQWtCLE9BQUEsQ0FBUSx3QkFBUixFQUFsQixjQVBELENBQUE7O0FBQUEsRUFRQyxlQUFnQixPQUFBLENBQVEsc0JBQVIsRUFBaEIsWUFSRCxDQUFBOztBQUFBLEVBWU07QUFTUyxJQUFBLDBCQUFFLEtBQUYsRUFBVSxHQUFWLEVBQWdCLE1BQWhCLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTtBQUFBLE1BRG9CLElBQUMsQ0FBQSxNQUFBLEdBQ3JCLENBQUE7QUFBQSxNQUQwQixJQUFDLENBQUEsU0FBQSxNQUMzQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLEdBQUEsQ0FBQSxtQkFBUixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixFQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBRmIsQ0FEVztJQUFBLENBQWI7O0FBQUEsK0JBWUEsSUFBQSxHQUFNLFNBQUEs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

//# sourceURL=/Users/naver/.atom/packages/merge-conflicts/lib/conflicted-editor.coffee
