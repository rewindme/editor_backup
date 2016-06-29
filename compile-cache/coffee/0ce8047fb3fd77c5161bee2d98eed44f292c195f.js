(function() {
  var calculateTocType, makeBaseDirectory, path, sectionNumbering;

  path = require('path');

  module.exports = {
    makeAttributes: function(filePath) {
      var attributes;
      return attributes = {
        defaultAttributes: atom.config.get('asciidoc-preview.defaultAttributes'),
        numbered: sectionNumbering(),
        skipFrontMatter: atom.config.get('asciidoc-preview.frontMatter') ? '' : 'skip-front-matter',
        showTitle: atom.config.get('asciidoc-preview.showTitle') ? 'showtitle' : 'showtitle!',
        compatMode: atom.config.get('asciidoc-preview.compatMode') ? 'compat-mode=@' : '',
        forceExperimental: atom.config.get('asciidoc-preview.forceExperimental') ? 'experimental' : '',
        tocType: calculateTocType(),
        safeMode: atom.config.get('asciidoc-preview.safeMode' || 'safe'),
        baseDir: filePath ? makeBaseDirectory(filePath) : void 0,
        opalPwd: window.location.href
      };
    }
  };

  calculateTocType = function() {
    var tocType;
    tocType = atom.config.get('asciidoc-preview.tocType');
    if (tocType === 'none') {
      return '';
    } else if (tocType === 'auto') {
      return 'toc=toc! toc2!';
    } else {
      return "toc=" + tocType + " toc2!";
    }
  };

  sectionNumbering = function() {
    var numberedOption;
    numberedOption = atom.config.get('asciidoc-preview.sectionNumbering');
    if (numberedOption === 'always-enabled') {
      return 'sectnums';
    } else if (numberedOption === 'always-disabled') {
      return 'sectnums!';
    } else if (numberedOption === 'enabled-by-default') {
      return 'sectnums=@';
    } else {
      return '';
    }
  };

  makeBaseDirectory = function(filePath) {
    var baseBir;
    baseBir = atom.config.get('asciidoc-preview.baseDir');
    if (baseBir === '{docdir}') {
      return path.dirname(filePath);
    } else if (baseBir !== '-') {
      return baseBir;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL2F0dHJpYnV0ZXMtYnVpbGRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkRBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUFnQixTQUFDLFFBQUQsR0FBQTtBQUNkLFVBQUEsVUFBQTthQUFBLFVBQUEsR0FDRTtBQUFBLFFBQUEsaUJBQUEsRUFBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFuQjtBQUFBLFFBQ0EsUUFBQSxFQUFVLGdCQUFBLENBQUEsQ0FEVjtBQUFBLFFBRUEsZUFBQSxFQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQUgsR0FBdUQsRUFBdkQsR0FBK0QsbUJBRmhGO0FBQUEsUUFHQSxTQUFBLEVBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFILEdBQXFELFdBQXJELEdBQXNFLFlBSGpGO0FBQUEsUUFJQSxVQUFBLEVBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFILEdBQXNELGVBQXRELEdBQTJFLEVBSnZGO0FBQUEsUUFLQSxpQkFBQSxFQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLENBQUgsR0FBNkQsY0FBN0QsR0FBaUYsRUFMcEc7QUFBQSxRQU1BLE9BQUEsRUFBUyxnQkFBQSxDQUFBLENBTlQ7QUFBQSxRQU9BLFFBQUEsRUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQUEsSUFBK0IsTUFBL0MsQ0FQVjtBQUFBLFFBUUEsT0FBQSxFQUF1QyxRQUE5QixHQUFBLGlCQUFBLENBQWtCLFFBQWxCLENBQUEsR0FBQSxNQVJUO0FBQUEsUUFTQSxPQUFBLEVBQVMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQVR6QjtRQUZZO0lBQUEsQ0FBaEI7R0FIRixDQUFBOztBQUFBLEVBZ0JBLGdCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQVYsQ0FBQTtBQUNBLElBQUEsSUFBRyxPQUFBLEtBQVcsTUFBZDthQUNFLEdBREY7S0FBQSxNQUVLLElBQUcsT0FBQSxLQUFXLE1BQWQ7YUFHSCxpQkFIRztLQUFBLE1BQUE7YUFLRixNQUFBLEdBQU0sT0FBTixHQUFjLFNBTFo7S0FKWTtFQUFBLENBaEJuQixDQUFBOztBQUFBLEVBMkJBLGdCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixRQUFBLGNBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQixDQUFqQixDQUFBO0FBQ0EsSUFBQSxJQUFHLGNBQUEsS0FBa0IsZ0JBQXJCO2FBQ0UsV0FERjtLQUFBLE1BRUssSUFBRyxjQUFBLEtBQWtCLGlCQUFyQjthQUNILFlBREc7S0FBQSxNQUVBLElBQUcsY0FBQSxLQUFrQixvQkFBckI7YUFDSCxhQURHO0tBQUEsTUFBQTthQUdILEdBSEc7S0FOWTtFQUFBLENBM0JuQixDQUFBOztBQUFBLEVBc0NBLGlCQUFBLEdBQW9CLFNBQUMsUUFBRCxHQUFBO0FBQ2xCLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBVixDQUFBO0FBQ0EsSUFBQSxJQUFHLE9BQUEsS0FBVyxVQUFkO2FBQ0UsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLEVBREY7S0FBQSxNQUVLLElBQUcsT0FBQSxLQUFhLEdBQWhCO2FBQ0gsUUFERztLQUphO0VBQUEsQ0F0Q3BCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/attributes-builder.coffee
