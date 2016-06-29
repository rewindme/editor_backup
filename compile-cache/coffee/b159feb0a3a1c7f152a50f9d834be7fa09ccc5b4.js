(function() {
  var makeAttributes;

  makeAttributes = require('../lib/attributes-builder').makeAttributes;

  describe("attributes-builder", function() {
    describe("TOC type", function() {
      it('when tocType option is defined to none', function() {
        var tocType;
        atom.config.set('asciidoc-preview.tocType', 'none');
        tocType = makeAttributes().tocType;
        return expect(tocType).toBe('');
      });
      it('when tocType option is defined to preamble', function() {
        var tocType;
        atom.config.set('asciidoc-preview.tocType', 'preamble');
        tocType = makeAttributes().tocType;
        return expect(tocType).toBe('toc=preamble toc2!');
      });
      return it('when tocType option is defined to macro', function() {
        var tocType;
        atom.config.set('asciidoc-preview.tocType', 'macro');
        tocType = makeAttributes().tocType;
        return expect(tocType).toBe('toc=macro toc2!');
      });
    });
    describe("Section numbering", function() {
      it('when sectionNumbering option is defined to enabled-by-default', function() {
        var numbered;
        atom.config.set('asciidoc-preview.sectionNumbering', 'enabled-by-default');
        numbered = makeAttributes().numbered;
        return expect(numbered).toBe('sectnums=@');
      });
      it('when sectionNumbering option is defined to always-enabled', function() {
        var numbered;
        atom.config.set('asciidoc-preview.sectionNumbering', 'always-enabled');
        numbered = makeAttributes().numbered;
        return expect(numbered).toBe('sectnums');
      });
      it('when sectionNumbering option is defined to always-disabled', function() {
        var numbered;
        atom.config.set('asciidoc-preview.sectionNumbering', 'always-disabled');
        numbered = makeAttributes().numbered;
        return expect(numbered).toBe('sectnums!');
      });
      return it('when sectionNumbering option is defined to not-specified', function() {
        var numbered;
        atom.config.set('asciidoc-preview.sectionNumbering', 'not-specified');
        numbered = makeAttributes().numbered;
        return expect(numbered).toBe('');
      });
    });
    describe("Default attributes", function() {
      return it('when defaultAttributes option is defined', function() {
        var defaultAttributes;
        atom.config.set('asciidoc-preview.defaultAttributes', 'asciidoctor options');
        defaultAttributes = makeAttributes().defaultAttributes;
        return expect(defaultAttributes).toBe('asciidoctor options');
      });
    });
    describe("Front matter", function() {
      it('when frontMatter option is defined to true', function() {
        var skipFrontMatter;
        atom.config.set('asciidoc-preview.frontMatter', true);
        skipFrontMatter = makeAttributes().skipFrontMatter;
        return expect(skipFrontMatter).toBeFalsy();
      });
      return it('when frontMatter option is defined to false', function() {
        var skipFrontMatter;
        atom.config.set('asciidoc-preview.frontMatter', false);
        skipFrontMatter = makeAttributes().skipFrontMatter;
        return expect(skipFrontMatter).toBeTruthy();
      });
    });
    describe("Show title", function() {
      it('when showTitle option is defined to true', function() {
        var showTitle;
        atom.config.set('asciidoc-preview.showTitle', true);
        showTitle = makeAttributes().showTitle;
        return expect(showTitle).toBe('showtitle');
      });
      return it('when showTitle option is defined to false', function() {
        var showTitle;
        atom.config.set('asciidoc-preview.showTitle', false);
        showTitle = makeAttributes().showTitle;
        return expect(showTitle).toBe('showtitle!');
      });
    });
    describe("Compat mode", function() {
      it('when compatMode option is defined to true', function() {
        var compatMode;
        atom.config.set('asciidoc-preview.compatMode', true);
        compatMode = makeAttributes().compatMode;
        return expect(compatMode).toBe('compat-mode=@');
      });
      return it('when compatMode option is defined to false', function() {
        var compatMode;
        atom.config.set('asciidoc-preview.compatMode', false);
        compatMode = makeAttributes().compatMode;
        return expect(compatMode).toBe('');
      });
    });
    describe("Force experimental", function() {
      it('when forceExperimental option is defined to true', function() {
        var forceExperimental;
        atom.config.set('asciidoc-preview.forceExperimental', true);
        forceExperimental = makeAttributes().forceExperimental;
        return expect(forceExperimental).toBe('experimental');
      });
      return it('when forceExperimental option is defined to false', function() {
        var forceExperimental;
        atom.config.set('asciidoc-preview.forceExperimental', false);
        forceExperimental = makeAttributes().forceExperimental;
        return expect(forceExperimental).toBe('');
      });
    });
    describe("Safe mode", function() {
      it('when safeMode option is defined to unsafe', function() {
        var safeMode;
        atom.config.set('asciidoc-preview.safeMode', 'unsafe');
        safeMode = makeAttributes().safeMode;
        return expect(safeMode).toBe('unsafe');
      });
      it('when safeMode option is defined to safe', function() {
        var safeMode;
        atom.config.set('asciidoc-preview.safeMode', 'safe');
        safeMode = makeAttributes().safeMode;
        return expect(safeMode).toBe('safe');
      });
      it('when safeMode option is defined to server', function() {
        var safeMode;
        atom.config.set('asciidoc-preview.safeMode', 'server');
        safeMode = makeAttributes().safeMode;
        return expect(safeMode).toBe('server');
      });
      return it('when safeMode option is defined to secure', function() {
        var safeMode;
        atom.config.set('asciidoc-preview.safeMode', 'secure');
        safeMode = makeAttributes().safeMode;
        return expect(safeMode).toBe('secure');
      });
    });
    describe("Base directory", function() {
      it('when filePath is undefined and document path as base_dir', function() {
        var baseDir;
        atom.config.set('asciidoc-preview.baseDir', '{docdir}');
        baseDir = makeAttributes().baseDir;
        return expect(baseDir).toBeUndefined();
      });
      it('when filePath is defined and document path as base_dir', function() {
        var baseDir;
        atom.config.set('asciidoc-preview.baseDir', '{docdir}');
        baseDir = makeAttributes('foo/bar.adoc').baseDir;
        return expect(baseDir).toBe('foo');
      });
      it('when filePath is defined and use absolute path', function() {
        var baseDir;
        atom.config.set('asciidoc-preview.baseDir', '-');
        baseDir = makeAttributes('foo/bar.adoc').baseDir;
        return expect(baseDir).toBeUndefined();
      });
      return it('when use a custom base_dir', function() {
        var baseDir;
        atom.config.set('asciidoc-preview.baseDir', 'fii');
        baseDir = makeAttributes('foo/bar.adoc').baseDir;
        return expect(baseDir).toBe('fii');
      });
    });
    return describe("opalPwd", function() {
      return it('should opalPwd be defined', function() {
        var opalPwd;
        opalPwd = makeAttributes().opalPwd;
        return expect(opalPwd).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvc3BlYy9hdHRyaWJ1dGVzLWJ1aWxkZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFDLGlCQUFrQixPQUFBLENBQVEsMkJBQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUU3QixJQUFBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUVuQixNQUFBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsWUFBQSxPQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLE1BQTVDLENBQUEsQ0FBQTtBQUFBLFFBQ0MsVUFBVyxjQUFBLENBQUEsRUFBWCxPQURELENBQUE7ZUFHQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsSUFBaEIsQ0FBcUIsRUFBckIsRUFKMkM7TUFBQSxDQUE3QyxDQUFBLENBQUE7QUFBQSxNQU1BLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsWUFBQSxPQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLFVBQTVDLENBQUEsQ0FBQTtBQUFBLFFBQ0MsVUFBVyxjQUFBLENBQUEsRUFBWCxPQURELENBQUE7ZUFHQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsSUFBaEIsQ0FBcUIsb0JBQXJCLEVBSitDO01BQUEsQ0FBakQsQ0FOQSxDQUFBO2FBWUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtBQUM1QyxZQUFBLE9BQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsT0FBNUMsQ0FBQSxDQUFBO0FBQUEsUUFDQyxVQUFXLGNBQUEsQ0FBQSxFQUFYLE9BREQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxJQUFoQixDQUFxQixpQkFBckIsRUFKNEM7TUFBQSxDQUE5QyxFQWRtQjtJQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBLElBb0JBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFFNUIsTUFBQSxFQUFBLENBQUcsK0RBQUgsRUFBb0UsU0FBQSxHQUFBO0FBQ2xFLFlBQUEsUUFBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQixFQUFxRCxvQkFBckQsQ0FBQSxDQUFBO0FBQUEsUUFDQyxXQUFZLGNBQUEsQ0FBQSxFQUFaLFFBREQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxRQUFQLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsWUFBdEIsRUFKa0U7TUFBQSxDQUFwRSxDQUFBLENBQUE7QUFBQSxNQU1BLEVBQUEsQ0FBRywyREFBSCxFQUFnRSxTQUFBLEdBQUE7QUFDOUQsWUFBQSxRQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLEVBQXFELGdCQUFyRCxDQUFBLENBQUE7QUFBQSxRQUNDLFdBQVksY0FBQSxDQUFBLEVBQVosUUFERCxDQUFBO2VBR0EsTUFBQSxDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixVQUF0QixFQUo4RDtNQUFBLENBQWhFLENBTkEsQ0FBQTtBQUFBLE1BWUEsRUFBQSxDQUFHLDREQUFILEVBQWlFLFNBQUEsR0FBQTtBQUMvRCxZQUFBLFFBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQ0FBaEIsRUFBcUQsaUJBQXJELENBQUEsQ0FBQTtBQUFBLFFBQ0MsV0FBWSxjQUFBLENBQUEsRUFBWixRQURELENBQUE7ZUFHQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLElBQWpCLENBQXNCLFdBQXRCLEVBSitEO01BQUEsQ0FBakUsQ0FaQSxDQUFBO2FBa0JBLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBLEdBQUE7QUFDN0QsWUFBQSxRQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLEVBQXFELGVBQXJELENBQUEsQ0FBQTtBQUFBLFFBQ0MsV0FBWSxjQUFBLENBQUEsRUFBWixRQURELENBQUE7ZUFHQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLElBQWpCLENBQXNCLEVBQXRCLEVBSjZEO01BQUEsQ0FBL0QsRUFwQjRCO0lBQUEsQ0FBOUIsQ0FwQkEsQ0FBQTtBQUFBLElBOENBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7YUFFN0IsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxZQUFBLGlCQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLEVBQXNELHFCQUF0RCxDQUFBLENBQUE7QUFBQSxRQUNDLG9CQUFxQixjQUFBLENBQUEsRUFBckIsaUJBREQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxpQkFBUCxDQUF5QixDQUFDLElBQTFCLENBQStCLHFCQUEvQixFQUo2QztNQUFBLENBQS9DLEVBRjZCO0lBQUEsQ0FBL0IsQ0E5Q0EsQ0FBQTtBQUFBLElBc0RBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUV2QixNQUFBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsWUFBQSxlQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLEVBQWdELElBQWhELENBQUEsQ0FBQTtBQUFBLFFBQ0Msa0JBQW1CLGNBQUEsQ0FBQSxFQUFuQixlQURELENBQUE7ZUFHQSxNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLFNBQXhCLENBQUEsRUFKK0M7TUFBQSxDQUFqRCxDQUFBLENBQUE7YUFNQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFlBQUEsZUFBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxLQUFoRCxDQUFBLENBQUE7QUFBQSxRQUNDLGtCQUFtQixjQUFBLENBQUEsRUFBbkIsZUFERCxDQUFBO2VBR0EsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxVQUF4QixDQUFBLEVBSmdEO01BQUEsQ0FBbEQsRUFSdUI7SUFBQSxDQUF6QixDQXREQSxDQUFBO0FBQUEsSUFvRUEsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBRXJCLE1BQUEsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxZQUFBLFNBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsRUFBOEMsSUFBOUMsQ0FBQSxDQUFBO0FBQUEsUUFDQyxZQUFhLGNBQUEsQ0FBQSxFQUFiLFNBREQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxTQUFQLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsV0FBdkIsRUFKNkM7TUFBQSxDQUEvQyxDQUFBLENBQUE7YUFNQSxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFlBQUEsU0FBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixFQUE4QyxLQUE5QyxDQUFBLENBQUE7QUFBQSxRQUNDLFlBQWEsY0FBQSxDQUFBLEVBQWIsU0FERCxDQUFBO2VBR0EsTUFBQSxDQUFPLFNBQVAsQ0FBaUIsQ0FBQyxJQUFsQixDQUF1QixZQUF2QixFQUo4QztNQUFBLENBQWhELEVBUnFCO0lBQUEsQ0FBdkIsQ0FwRUEsQ0FBQTtBQUFBLElBa0ZBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUV0QixNQUFBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsWUFBQSxVQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLEVBQStDLElBQS9DLENBQUEsQ0FBQTtBQUFBLFFBQ0MsYUFBYyxjQUFBLENBQUEsRUFBZCxVQURELENBQUE7ZUFHQSxNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLElBQW5CLENBQXdCLGVBQXhCLEVBSjhDO01BQUEsQ0FBaEQsQ0FBQSxDQUFBO2FBTUEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxZQUFBLFVBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsRUFBK0MsS0FBL0MsQ0FBQSxDQUFBO0FBQUEsUUFDQyxhQUFjLGNBQUEsQ0FBQSxFQUFkLFVBREQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxVQUFQLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsRUFBeEIsRUFKK0M7TUFBQSxDQUFqRCxFQVJzQjtJQUFBLENBQXhCLENBbEZBLENBQUE7QUFBQSxJQWdHQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBRTdCLE1BQUEsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUEsR0FBQTtBQUNyRCxZQUFBLGlCQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLEVBQXNELElBQXRELENBQUEsQ0FBQTtBQUFBLFFBQ0Msb0JBQXFCLGNBQUEsQ0FBQSxFQUFyQixpQkFERCxDQUFBO2VBR0EsTUFBQSxDQUFPLGlCQUFQLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsY0FBL0IsRUFKcUQ7TUFBQSxDQUF2RCxDQUFBLENBQUE7YUFNQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFlBQUEsaUJBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsRUFBc0QsS0FBdEQsQ0FBQSxDQUFBO0FBQUEsUUFDQyxvQkFBcUIsY0FBQSxDQUFBLEVBQXJCLGlCQURELENBQUE7ZUFHQSxNQUFBLENBQU8saUJBQVAsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixFQUEvQixFQUpzRDtNQUFBLENBQXhELEVBUjZCO0lBQUEsQ0FBL0IsQ0FoR0EsQ0FBQTtBQUFBLElBOEdBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUVwQixNQUFBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsWUFBQSxRQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLEVBQTZDLFFBQTdDLENBQUEsQ0FBQTtBQUFBLFFBQ0MsV0FBWSxjQUFBLENBQUEsRUFBWixRQURELENBQUE7ZUFHQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLElBQWpCLENBQXNCLFFBQXRCLEVBSjhDO01BQUEsQ0FBaEQsQ0FBQSxDQUFBO0FBQUEsTUFNQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFlBQUEsUUFBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixFQUE2QyxNQUE3QyxDQUFBLENBQUE7QUFBQSxRQUNDLFdBQVksY0FBQSxDQUFBLEVBQVosUUFERCxDQUFBO2VBR0EsTUFBQSxDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixNQUF0QixFQUo0QztNQUFBLENBQTlDLENBTkEsQ0FBQTtBQUFBLE1BWUEsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUM5QyxZQUFBLFFBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEIsRUFBNkMsUUFBN0MsQ0FBQSxDQUFBO0FBQUEsUUFDQyxXQUFZLGNBQUEsQ0FBQSxFQUFaLFFBREQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxRQUFQLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsUUFBdEIsRUFKOEM7TUFBQSxDQUFoRCxDQVpBLENBQUE7YUFrQkEsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUM5QyxZQUFBLFFBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEIsRUFBNkMsUUFBN0MsQ0FBQSxDQUFBO0FBQUEsUUFDQyxXQUFZLGNBQUEsQ0FBQSxFQUFaLFFBREQsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxRQUFQLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsUUFBdEIsRUFKOEM7TUFBQSxDQUFoRCxFQXBCb0I7SUFBQSxDQUF0QixDQTlHQSxDQUFBO0FBQUEsSUF3SUEsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUV6QixNQUFBLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBLEdBQUE7QUFDN0QsWUFBQSxPQUFBO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLFVBQTVDLENBQUEsQ0FBQTtBQUFBLFFBQ0MsVUFBVyxjQUFBLENBQUEsRUFBWCxPQURELENBQUE7ZUFHQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsYUFBaEIsQ0FBQSxFQUo2RDtNQUFBLENBQS9ELENBQUEsQ0FBQTtBQUFBLE1BTUEsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUEsR0FBQTtBQUMzRCxZQUFBLE9BQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsVUFBNUMsQ0FBQSxDQUFBO0FBQUEsUUFDQyxVQUFXLGNBQUEsQ0FBZSxjQUFmLEVBQVgsT0FERCxDQUFBO2VBR0EsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLElBQWhCLENBQXFCLEtBQXJCLEVBSjJEO01BQUEsQ0FBN0QsQ0FOQSxDQUFBO0FBQUEsTUFZQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFlBQUEsT0FBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxHQUE1QyxDQUFBLENBQUE7QUFBQSxRQUNDLFVBQVcsY0FBQSxDQUFlLGNBQWYsRUFBWCxPQURELENBQUE7ZUFHQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsYUFBaEIsQ0FBQSxFQUptRDtNQUFBLENBQXJELENBWkEsQ0FBQTthQWtCQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsT0FBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxLQUE1QyxDQUFBLENBQUE7QUFBQSxRQUNDLFVBQVcsY0FBQSxDQUFlLGNBQWYsRUFBWCxPQURELENBQUE7ZUFHQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsSUFBaEIsQ0FBcUIsS0FBckIsRUFKK0I7TUFBQSxDQUFqQyxFQXBCeUI7SUFBQSxDQUEzQixDQXhJQSxDQUFBO1dBa0tBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTthQUVsQixFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFlBQUEsT0FBQTtBQUFBLFFBQUMsVUFBVyxjQUFBLENBQUEsRUFBWCxPQUFELENBQUE7ZUFFQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsV0FBaEIsQ0FBQSxFQUg4QjtNQUFBLENBQWhDLEVBRmtCO0lBQUEsQ0FBcEIsRUFwSzZCO0VBQUEsQ0FBL0IsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/spec/attributes-builder-spec.coffee
