(function() {
  var CompositeDisposable, Emitter, GitOps, MergeConflictsView, pkgApi, pkgEmitter, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  MergeConflictsView = require('./view/merge-conflicts-view').MergeConflictsView;

  GitOps = require('./git').GitOps;

  pkgEmitter = null;

  pkgApi = null;

  module.exports = {
    activate: function(state) {
      this.subs = new CompositeDisposable;
      this.emitter = new Emitter;
      MergeConflictsView.registerContextApi(GitOps);
      pkgEmitter = {
        onDidResolveConflict: (function(_this) {
          return function(callback) {
            return _this.onDidResolveConflict(callback);
          };
        })(this),
        didResolveConflict: (function(_this) {
          return function(event) {
            return _this.emitter.emit('did-resolve-conflict', event);
          };
        })(this),
        onDidResolveFile: (function(_this) {
          return function(callback) {
            return _this.onDidResolveFile(callback);
          };
        })(this),
        didResolveFile: (function(_this) {
          return function(event) {
            return _this.emitter.emit('did-resolve-file', event);
          };
        })(this),
        onDidQuitConflictResolution: (function(_this) {
          return function(callback) {
            return _this.onDidQuitConflictResolution(callback);
          };
        })(this),
        didQuitConflictResolution: (function(_this) {
          return function() {
            return _this.emitter.emit('did-quit-conflict-resolution');
          };
        })(this),
        onDidCompleteConflictResolution: (function(_this) {
          return function(callback) {
            return _this.onDidCompleteConflictResolution(callback);
          };
        })(this),
        didCompleteConflictResolution: (function(_this) {
          return function() {
            return _this.emitter.emit('did-complete-conflict-resolution');
          };
        })(this)
      };
      return this.subs.add(atom.commands.add('atom-workspace', 'merge-conflicts:detect', function() {
        return MergeConflictsView.detect(pkgEmitter);
      }));
    },
    deactivate: function() {
      this.subs.dispose();
      return this.emitter.dispose();
    },
    config: {
      gitPath: {
        type: 'string',
        "default": '',
        description: 'Absolute path to your git executable.'
      }
    },
    onDidResolveConflict: function(callback) {
      return this.emitter.on('did-resolve-conflict', callback);
    },
    onDidResolveFile: function(callback) {
      return this.emitter.on('did-resolve-file', callback);
    },
    onDidQuitConflictResolution: function(callback) {
      return this.emitter.on('did-quit-conflict-resolution', callback);
    },
    onDidCompleteConflictResolution: function(callback) {
      return this.emitter.on('did-complete-conflict-resolution', callback);
    },
    registerContextApi: function(contextApi) {
      return MergeConflictsView.registerContextApi(contextApi);
    },
    showForContext: function(context) {
      return MergeConflictsView.showForContext(context, pkgEmitter);
    },
    hideForContext: function(context) {
      return MergeConflictsView.hideForContext(context);
    },
    provideApi: function() {
      if (pkgApi === null) {
        pkgApi = Object.freeze({
          registerContextApi: this.registerContextApi,
          showForContext: this.showForContext,
          hideForContext: this.hideForContext,
          onDidResolveConflict: pkgEmitter.onDidResolveConflict,
          onDidResolveFile: pkgEmitter.onDidResolveConflict,
          onDidQuitConflictResolution: pkgEmitter.onDidQuitConflictResolution,
          onDidCompleteConflictResolution: pkgEmitter.onDidCompleteConflictResolution
        });
      }
      return pkgApi;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FBdEIsQ0FBQTs7QUFBQSxFQUVDLHFCQUFzQixPQUFBLENBQVEsNkJBQVIsRUFBdEIsa0JBRkQsQ0FBQTs7QUFBQSxFQUdDLFNBQVUsT0FBQSxDQUFRLE9BQVIsRUFBVixNQUhELENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsSUFMYixDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLElBTlQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxHQUFBLENBQUEsbUJBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FEWCxDQUFBO0FBQUEsTUFHQSxrQkFBa0IsQ0FBQyxrQkFBbkIsQ0FBc0MsTUFBdEMsQ0FIQSxDQUFBO0FBQUEsTUFLQSxVQUFBLEdBQ0U7QUFBQSxRQUFBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxRQUFELEdBQUE7bUJBQWMsS0FBQyxDQUFBLG9CQUFELENBQXNCLFFBQXRCLEVBQWQ7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QjtBQUFBLFFBQ0Esa0JBQUEsRUFBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTttQkFBVyxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQs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

//# sourceURL=/Users/naver/.atom/packages/merge-conflicts/lib/main.coffee
