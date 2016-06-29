(function() {
  var scopeForFenceName;

  scopeForFenceName = require('../lib/highlights-helper').scopeForFenceName;

  describe('Highlights helper', function() {
    return it('should return grammar name "source.shell" when fence name is "bash"', function() {
      var scope;
      scope = scopeForFenceName('bash');
      return expect(scope).toBe('source.shell');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvc3BlYy9oaWdobGlnaHRzLWhlbHBlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFDLG9CQUFxQixPQUFBLENBQVEsMEJBQVIsRUFBckIsaUJBQUQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7V0FFNUIsRUFBQSxDQUFHLHFFQUFILEVBQTBFLFNBQUEsR0FBQTtBQUN4RSxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxpQkFBQSxDQUFrQixNQUFsQixDQUFSLENBQUE7YUFDQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsSUFBZCxDQUFtQixjQUFuQixFQUZ3RTtJQUFBLENBQTFFLEVBRjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/spec/highlights-helper-spec.coffee
