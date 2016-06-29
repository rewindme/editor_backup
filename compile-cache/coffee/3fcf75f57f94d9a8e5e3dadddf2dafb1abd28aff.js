(function() {
  var scopesByFenceName;

  scopesByFenceName = {
    'bash': 'source.shell',
    'c': 'source.c',
    'c++': 'source.cpp',
    'clojure': 'source.clojure',
    'coffee': 'source.coffee',
    'coffeescript': 'source.coffee',
    'coffee-script': 'source.coffee',
    'cpp': 'source.cpp',
    'cs': 'source.cs',
    'csharp': 'source.cs',
    'css': 'source.css',
    'erlang': 'source.erl',
    'go': 'source.go',
    'golang': 'source.go',
    'html': 'text.html.basic',
    'java': 'source.java',
    'javascript': 'source.js',
    'js': 'source.js',
    'json': 'source.json',
    'less': 'source.css.less',
    'make': 'source.makefile',
    'makefile': 'source.makefile',
    'markdown': 'source.gfm',
    'md': 'source.gfm',
    'mdown': 'source.gfm',
    'mustache': 'text.html.mustache',
    'objc': 'source.objc',
    'objective-c': 'source.objc',
    'perl': 'source.perl',
    'php': 'text.html.php',
    'plist': 'text.xml.plist',
    'properties': 'source.git-config',
    'py': 'source.python',
    'python': 'source.python',
    'rb': 'source.ruby',
    'ruby': 'source.ruby',
    'sass': 'source.sass',
    'scss': 'source.css.scss',
    'sh': 'source.shell',
    'shell': 'source.shell',
    'sql': 'source.sql',
    'text': 'text.plain',
    'todo': 'text.todo',
    'toml': 'source.toml',
    'xml': 'text.xml',
    'yaml': 'source.yaml',
    'yml': 'source.yaml',
    'csv': 'text.csv',
    'diff': 'source.diff',
    'docker': 'source.dockerfile',
    'dockerfile': 'source.dockerfile',
    'elixir': 'source.elixir',
    'elm': 'source.elm',
    'groovy': 'source.groovy',
    'haskell': 'source.haskell',
    'jsx': 'source.js.jsx',
    'julia': 'source.julia',
    'ocaml': 'source.ocaml',
    'patch': 'source.diff',
    'r': 'source.r',
    'rej': 'source.diff',
    'rs': 'source.rust',
    'rust': 'source.rust',
    'scala': 'source.scala',
    'swift': 'source.swift',
    'typescript': 'source.ts',
    'ts': 'source.ts'
  };

  module.exports = {
    scopeForFenceName: function(fenceName) {
      var _ref;
      fenceName = fenceName.toLowerCase();
      return (_ref = scopesByFenceName[fenceName]) != null ? _ref : "source." + fenceName;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL2hpZ2hsaWdodHMtaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFBLGlCQUFBLEdBRUU7QUFBQSxJQUFBLE1BQUEsRUFBUSxjQUFSO0FBQUEsSUFDQSxHQUFBLEVBQUssVUFETDtBQUFBLElBRUEsS0FBQSxFQUFPLFlBRlA7QUFBQSxJQUdBLFNBQUEsRUFBVyxnQkFIWDtBQUFBLElBSUEsUUFBQSxFQUFVLGVBSlY7QUFBQSxJQUtBLGNBQUEsRUFBZ0IsZUFMaEI7QUFBQSxJQU1BLGVBQUEsRUFBaUIsZUFOakI7QUFBQSxJQU9BLEtBQUEsRUFBTyxZQVBQO0FBQUEsSUFRQSxJQUFBLEVBQU0sV0FSTjtBQUFBLElBU0EsUUFBQSxFQUFVLFdBVFY7QUFBQSxJQVVBLEtBQUEsRUFBTyxZQVZQO0FBQUEsSUFXQSxRQUFBLEVBQVUsWUFYVjtBQUFBLElBWUEsSUFBQSxFQUFNLFdBWk47QUFBQSxJQWFBLFFBQUEsRUFBVSxXQWJWO0FBQUEsSUFjQSxNQUFBLEVBQVEsaUJBZFI7QUFBQSxJQWVBLE1BQUEsRUFBUSxhQWZSO0FBQUEsSUFnQkEsWUFBQSxFQUFjLFdBaEJkO0FBQUEsSUFpQkEsSUFBQSxFQUFNLFdBakJOO0FBQUEsSUFrQkEsTUFBQSxFQUFRLGFBbEJSO0FBQUEsSUFtQkEsTUFBQSxFQUFRLGlCQW5CUjtBQUFBLElBb0JBLE1BQUEsRUFBUSxpQkFwQlI7QUFBQSxJQXFCQSxVQUFBLEVBQVksaUJBckJaO0FBQUEsSUFzQkEsVUFBQSxFQUFZLFlBdEJaO0FBQUEsSUF1QkEsSUFBQSxFQUFNLFlBdkJOO0FBQUEsSUF3QkEsT0FBQSxFQUFTLFlBeEJUO0FBQUEsSUF5QkEsVUFBQSxFQUFZLG9CQXpCWjtBQUFBLElBMEJBLE1BQUEsRUFBUSxhQTFCUjtBQUFBLElBMkJBLGFBQUEsRUFBZSxhQTNCZjtBQUFBLElBNEJBLE1BQUEsRUFBUSxhQTVCUjtBQUFBLElBNkJBLEtBQUEsRUFBTyxlQTdCUDtBQUFBLElBOEJBLE9BQUEsRUFBUyxnQkE5QlQ7QUFBQSxJQStCQSxZQUFBLEVBQWMsbUJBL0JkO0FBQUEsSUFnQ0EsSUFBQSxFQUFNLGVBaENOO0FBQUEsSUFpQ0EsUUFBQSxFQUFVLGVBakNWO0FBQUEsSUFrQ0EsSUFBQSxFQUFNLGFBbENOO0FBQUEsSUFtQ0EsTUFBQSxFQUFRLGFBbkNSO0FBQUEsSUFvQ0EsTUFBQSxFQUFRLGFBcENSO0FBQUEsSUFxQ0EsTUFBQSxFQUFRLGlCQXJDUjtBQUFBLElBc0NBLElBQUEsRUFBTSxjQXRDTjtBQUFBLElBdUNBLE9BQUEsRUFBUyxjQXZDVDtBQUFBLElBd0NBLEtBQUEsRUFBTyxZQXhDUDtBQUFBLElBeUNBLE1BQUEsRUFBUSxZQXpDUjtBQUFBLElBMENBLE1BQUEsRUFBUSxXQTFDUjtBQUFBLElBMkNBLE1BQUEsRUFBUSxhQTNDUjtBQUFBLElBNENBLEtBQUEsRUFBTyxVQTVDUDtBQUFBLElBNkNBLE1BQUEsRUFBUSxhQTdDUjtBQUFBLElBOENBLEtBQUEsRUFBTyxhQTlDUDtBQUFBLElBZ0RBLEtBQUEsRUFBTyxVQWhEUDtBQUFBLElBaURBLE1BQUEsRUFBUSxhQWpEUjtBQUFBLElBa0RBLFFBQUEsRUFBVSxtQkFsRFY7QUFBQSxJQW1EQSxZQUFBLEVBQWMsbUJBbkRkO0FBQUEsSUFvREEsUUFBQSxFQUFVLGVBcERWO0FBQUEsSUFxREEsS0FBQSxFQUFPLFlBckRQO0FBQUEsSUFzREEsUUFBQSxFQUFVLGVBdERWO0FBQUEsSUF1REEsU0FBQSxFQUFXLGdCQXZEWDtBQUFBLElBd0RBLEtBQUEsRUFBTyxlQXhEUDtBQUFBLElBeURBLE9BQUEsRUFBUyxjQXpEVDtBQUFBLElBMERBLE9BQUEsRUFBUyxjQTFEVDtBQUFBLElBMkRBLE9BQUEsRUFBUyxhQTNEVDtBQUFBLElBNERBLEdBQUEsRUFBSyxVQTVETDtBQUFBLElBNkRBLEtBQUEsRUFBTyxhQTdEUDtBQUFBLElBOERBLElBQUEsRUFBTSxhQTlETjtBQUFBLElBK0RBLE1BQUEsRUFBUSxhQS9EUjtBQUFBLElBZ0VBLE9BQUEsRUFBUyxjQWhFVDtBQUFBLElBaUVBLE9BQUEsRUFBUyxjQWpFVDtBQUFBLElBa0VBLFlBQUEsRUFBYyxXQWxFZDtBQUFBLElBbUVBLElBQUEsRUFBTSxXQW5FTjtHQUZGLENBQUE7O0FBQUEsRUF1RUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsaUJBQUEsRUFBbUIsU0FBQyxTQUFELEdBQUE7QUFDakIsVUFBQSxJQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksU0FBUyxDQUFDLFdBQVYsQ0FBQSxDQUFaLENBQUE7b0VBQ2dDLFNBQUEsR0FBUyxVQUZ4QjtJQUFBLENBQW5CO0dBeEVGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/highlights-helper.coffee
