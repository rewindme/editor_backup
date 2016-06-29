(function() {
  describe('AsciiDoc preview', function() {
    var pack;
    pack = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('asciidoc-preview').then(function(p) {
          return pack = p;
        });
      });
    });
    return it('should load the package', function() {
      return expect(pack.name).toBe('asciidoc-preview');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvc3BlYy9hY3NpaWRvYy1wcmV2aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsa0JBQTlCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxDQUFELEdBQUE7aUJBQ0osSUFBQSxHQUFPLEVBREg7UUFBQSxDQURSLEVBRGM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FRQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO2FBQzVCLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLElBQWxCLENBQXVCLGtCQUF2QixFQUQ0QjtJQUFBLENBQTlCLEVBVDJCO0VBQUEsQ0FBN0IsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/spec/acsiidoc-preview-spec.coffee
