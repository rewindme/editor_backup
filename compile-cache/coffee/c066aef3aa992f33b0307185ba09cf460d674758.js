(function() {
  var Conflict, util;

  Conflict = require('../lib/conflict').Conflict;

  util = require('./util');

  describe("Conflict", function() {
    describe('a single two-way diff', function() {
      var conflict;
      conflict = [][0];
      beforeEach(function() {
        return util.openPath('single-2way-diff.txt', function(editorView) {
          return conflict = Conflict.all({
            isRebase: false
          }, editorView.getModel())[0];
        });
      });
      it('identifies the correct rows', function() {
        expect(util.rowRangeFrom(conflict.ours.marker)).toEqual([1, 2]);
        expect(conflict.ours.ref).toBe('HEAD');
        expect(util.rowRangeFrom(conflict.theirs.marker)).toEqual([3, 4]);
        return expect(conflict.theirs.ref).toBe('master');
      });
      it('finds the ref banners', function() {
        expect(util.rowRangeFrom(conflict.ours.refBannerMarker)).toEqual([0, 1]);
        return expect(util.rowRangeFrom(conflict.theirs.refBannerMarker)).toEqual([4, 5]);
      });
      it('finds the separator', function() {
        return expect(util.rowRangeFrom(conflict.navigator.separatorMarker)).toEqual([2, 3]);
      });
      it('marks "ours" as the top and "theirs" as the bottom', function() {
        expect(conflict.ours.position).toBe('top');
        return expect(conflict.theirs.position).toBe('bottom');
      });
      it('links each side to the following marker', function() {
        expect(conflict.ours.followingMarker).toBe(conflict.navigator.separatorMarker);
        return expect(conflict.theirs.followingMarker).toBe(conflict.theirs.refBannerMarker);
      });
      return it('does not have base side', function() {
        return expect(conflict.base).toBeNull();
      });
    });
    describe('a single three-way diff', function() {
      var conflict;
      conflict = [][0];
      beforeEach(function() {
        return util.openPath('single-3way-diff.txt', function(editorView) {
          return conflict = Conflict.all({
            isRebase: false
          }, editorView.getModel())[0];
        });
      });
      it('identifies the correct rows', function() {
        expect(util.rowRangeFrom(conflict.ours.marker)).toEqual([1, 2]);
        expect(conflict.ours.ref).toBe('HEAD');
        expect(util.rowRangeFrom(conflict.base.marker)).toEqual([3, 4]);
        expect(conflict.base.ref).toBe('merged common ancestors');
        expect(util.rowRangeFrom(conflict.theirs.marker)).toEqual([5, 6]);
        return expect(conflict.theirs.ref).toBe('master');
      });
      it('finds the ref banners', function() {
        expect(util.rowRangeFrom(conflict.ours.refBannerMarker)).toEqual([0, 1]);
        expect(util.rowRangeFrom(conflict.base.refBannerMarker)).toEqual([2, 3]);
        return expect(util.rowRangeFrom(conflict.theirs.refBannerMarker)).toEqual([6, 7]);
      });
      it('finds the separator', function() {
        return expect(util.rowRangeFrom(conflict.navigator.separatorMarker)).toEqual([4, 5]);
      });
      it('marks "ours" as the top and "theirs" as the bottom', function() {
        expect(conflict.ours.position).toBe('top');
        expect(conflict.base.position).toBe('base');
        return expect(conflict.theirs.position).toBe('bottom');
      });
      return it('links each side to the following marker', function() {
        expect(conflict.ours.followingMarker).toBe(conflict.base.refBannerMarker);
        expect(conflict.base.followingMarker).toBe(conflict.navigator.separatorMarker);
        return expect(conflict.theirs.followingMarker).toBe(conflict.theirs.refBannerMarker);
      });
    });
    it("identifies the correct rows for complex three-way diff", function() {
      return util.openPath('single-3way-diff-complex.txt', function(editorView) {
        var conflict;
        conflict = Conflict.all({
          isRebase: false
        }, editorView.getModel())[0];
        expect(util.rowRangeFrom(conflict.ours.marker)).toEqual([1, 2]);
        expect(conflict.ours.ref).toBe('HEAD');
        expect(util.rowRangeFrom(conflict.base.marker)).toEqual([3, 18]);
        expect(conflict.base.ref).toBe('merged common ancestors');
        expect(util.rowRangeFrom(conflict.theirs.marker)).toEqual([19, 20]);
        return expect(conflict.theirs.ref).toBe('master');
      });
    });
    it("finds multiple conflict markings", function() {
      return util.openPath('multi-2way-diff.txt', function(editorView) {
        var cs;
        cs = Conflict.all({}, editorView.getModel());
        expect(cs.length).toBe(2);
        expect(util.rowRangeFrom(cs[0].ours.marker)).toEqual([5, 7]);
        expect(util.rowRangeFrom(cs[0].theirs.marker)).toEqual([8, 9]);
        expect(util.rowRangeFrom(cs[1].ours.marker)).toEqual([14, 15]);
        return expect(util.rowRangeFrom(cs[1].theirs.marker)).toEqual([16, 17]);
      });
    });
    describe('when rebasing', function() {
      var conflict;
      conflict = [][0];
      beforeEach(function() {
        return util.openPath('rebase-2way-diff.txt', function(editorView) {
          return conflict = Conflict.all({
            isRebase: true
          }, editorView.getModel())[0];
        });
      });
      it('swaps the lines for "ours" and "theirs"', function() {
        expect(util.rowRangeFrom(conflict.theirs.marker)).toEqual([3, 4]);
        return expect(util.rowRangeFrom(conflict.ours.marker)).toEqual([5, 6]);
      });
      it('recognizes banner lines with commit shortlog messages', function() {
        expect(util.rowRangeFrom(conflict.theirs.refBannerMarker)).toEqual([2, 3]);
        return expect(util.rowRangeFrom(conflict.ours.refBannerMarker)).toEqual([6, 7]);
      });
      it('marks "theirs" as the top and "ours" as the bottom', function() {
        expect(conflict.theirs.position).toBe('top');
        return expect(conflict.ours.position).toBe('bottom');
      });
      return it('links each side to the following marker', function() {
        expect(conflict.theirs.followingMarker).toBe(conflict.navigator.separatorMarker);
        return expect(conflict.ours.followingMarker).toBe(conflict.ours.refBannerMarker);
      });
    });
    describe('sides', function() {
      var conflict, editor, _ref;
      _ref = [], editor = _ref[0], conflict = _ref[1];
      beforeEach(function() {
        return util.openPath('single-2way-diff.txt', function(editorView) {
          var _ref1;
          editor = editorView.getModel();
          return _ref1 = Conflict.all({}, editor), conflict = _ref1[0], _ref1;
        });
      });
      it('retains a reference to conflict', function() {
        expect(conflict.ours.conflict).toBe(conflict);
        return expect(conflict.theirs.conflict).toBe(conflict);
      });
      it('remembers its initial text', function() {
        editor.setCursorBufferPosition([1, 0]);
        editor.insertText("I prefer this text! ");
        return expect(conflict.ours.originalText).toBe("These are my changes\n");
      });
      it('resolves as "ours"', function() {
        conflict.ours.resolve();
        expect(conflict.resolution).toBe(conflict.ours);
        expect(conflict.ours.wasChosen()).toBe(true);
        return expect(conflict.theirs.wasChosen()).toBe(false);
      });
      it('resolves as "theirs"', function() {
        conflict.theirs.resolve();
        expect(conflict.resolution).toBe(conflict.theirs);
        expect(conflict.ours.wasChosen()).toBe(false);
        return expect(conflict.theirs.wasChosen()).toBe(true);
      });
      return it('broadcasts an event on resolution', function() {
        var resolved;
        resolved = false;
        conflict.onDidResolveConflict(function() {
          return resolved = true;
        });
        conflict.ours.resolve();
        return expect(resolved).toBe(true);
      });
    });
    return describe('navigator', function() {
      var conflicts, navigator, _ref;
      _ref = [], conflicts = _ref[0], navigator = _ref[1];
      beforeEach(function() {
        return util.openPath('triple-2way-diff.txt', function(editorView) {
          conflicts = Conflict.all({}, editorView.getModel());
          return navigator = conflicts[1].navigator;
        });
      });
      it('knows its conflict', function() {
        return expect(navigator.conflict).toBe(conflicts[1]);
      });
      it('links to the previous conflict', function() {
        return expect(navigator.previous).toBe(conflicts[0]);
      });
      it('links to the next conflict', function() {
        return expect(navigator.next).toBe(conflicts[2]);
      });
      it('skips resolved conflicts', function() {
        var nav;
        nav = conflicts[0].navigator;
        conflicts[1].ours.resolve();
        return expect(nav.nextUnresolved()).toBe(conflicts[2]);
      });
      return it('returns null at the end', function() {
        var nav;
        nav = conflicts[2].navigator;
        expect(nav.next).toBeNull();
        return expect(nav.nextUnresolved()).toBeNull();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL2NvbmZsaWN0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxpQkFBUixFQUFaLFFBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFFbkIsSUFBQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsUUFBQTtBQUFBLE1BQUMsV0FBWSxLQUFiLENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxJQUFJLENBQUMsUUFBTCxDQUFjLHNCQUFkLEVBQXNDLFNBQUMsVUFBRCxHQUFBO2lCQUNwQyxRQUFBLEdBQVcsUUFBUSxDQUFDLEdBQVQsQ0FBYTtBQUFBLFlBQUUsUUFBQSxFQUFVLEtBQVo7V0FBYixFQUFrQyxVQUFVLENBQUMsUUFBWCxDQUFBLENBQWxDLENBQXlELENBQUEsQ0FBQSxFQURoQztRQUFBLENBQXRDLEVBRFM7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BTUEsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxRQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsWUFBTCxDQUFrQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQWhDLENBQVAsQ0FBOEMsQ0FBQyxPQUEvQyxDQUF1RCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXZELENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBckIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixN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

//# sourceURL=/Users/naver/.atom/packages/merge-conflicts/spec/conflict-spec.coffee
