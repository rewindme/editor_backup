(function() {
  var MergeState;

  MergeState = (function() {
    function MergeState(conflicts, context, isRebase) {
      this.conflicts = conflicts;
      this.context = context;
      this.isRebase = isRebase;
    }

    MergeState.prototype.conflictPaths = function() {
      var c, _i, _len, _ref, _results;
      _ref = this.conflicts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.path);
      }
      return _results;
    };

    MergeState.prototype.reread = function() {
      return this.context.readConflicts().then((function(_this) {
        return function(conflicts) {
          _this.conflicts = conflicts;
        };
      })(this));
    };

    MergeState.prototype.isEmpty = function() {
      return this.conflicts.length === 0;
    };

    MergeState.prototype.relativize = function(filePath) {
      return this.context.workingDirectory.relativize(filePath);
    };

    MergeState.prototype.join = function(relativePath) {
      return this.context.joinPath(relativePath);
    };

    MergeState.read = function(context) {
      var isr;
      isr = context.isRebasing();
      return context.readConflicts().then(function(cs) {
        return new MergeState(cs, context, isr);
      });
    };

    return MergeState;

  })();

  module.exports = {
    MergeState: MergeState
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvbWVyZ2Utc3RhdGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBTTtBQUVTLElBQUEsb0JBQUUsU0FBRixFQUFjLE9BQWQsRUFBd0IsUUFBeEIsR0FBQTtBQUFtQyxNQUFsQyxJQUFDLENBQUEsWUFBQSxTQUFpQyxDQUFBO0FBQUEsTUFBdEIsSUFBQyxDQUFBLFVBQUEsT0FBcUIsQ0FBQTtBQUFBLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFuQztJQUFBLENBQWI7O0FBQUEseUJBRUEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUFHLFVBQUEsMkJBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7cUJBQUE7QUFBQSxzQkFBQSxDQUFDLENBQUMsS0FBRixDQUFBO0FBQUE7c0JBQUg7SUFBQSxDQUZmLENBQUE7O0FBQUEseUJBSUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUUsU0FBRixHQUFBO0FBQWMsVUFBYixLQUFDLENBQUEsWUFBQSxTQUFZLENBQWQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QixFQURNO0lBQUEsQ0FKUixDQUFBOztBQUFBLHlCQU9BLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsS0FBcUIsRUFBeEI7SUFBQSxDQVBULENBQUE7O0FBQUEseUJBU0EsVUFBQSxHQUFZLFNBQUMsUUFBRCxHQUFBO2FBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUExQixDQUFxQyxRQUFyQyxFQUFkO0lBQUEsQ0FUWixDQUFBOztBQUFBLHlCQVdBLElBQUEsR0FBTSxTQUFDLFlBQUQsR0FBQTthQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsWUFBbEIsRUFBbEI7SUFBQSxDQVhOLENBQUE7O0FBQUEsSUFhQSxVQUFDLENBQUEsSUFBRCxHQUFPLFNBQUMsT0FBRCxHQUFBO0FBQ0wsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFVBQVIsQ0FBQSxDQUFOLENBQUE7YUFDQSxPQUFPLENBQUMsYUFBUixDQUFBLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsU0FBQyxFQUFELEdBQUE7ZUFDdkIsSUFBQSxVQUFBLENBQVcsRUFBWCxFQUFlLE9BQWYsRUFBd0IsR0FBeEIsRUFEdUI7TUFBQSxDQUE3QixFQUZLO0lBQUEsQ0FiUCxDQUFBOztzQkFBQTs7TUFGRixDQUFBOztBQUFBLEVBb0JBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxVQUFaO0dBckJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/merge-conflicts/lib/merge-state.coffee
