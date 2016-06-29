(function() {
  var calculateTocType, sectionNumbering;

  module.exports = {
    makeAttributes: function() {
      var attributes;
      return attributes = {
        defaultAttributes: atom.config.get('asciidoc-preview.defaultAttributes'),
        numbered: sectionNumbering(),
        skipfrontmatter: atom.config.get('asciidoc-preview.frontMatter') ? '' : 'skip-front-matter',
        showtitle: atom.config.get('asciidoc-preview.showTitle') ? 'showtitle' : 'showtitle!',
        compatmode: atom.config.get('asciidoc-preview.compatMode') ? 'compat-mode=@' : '',
        forceExperimental: atom.config.get('asciidoc-preview.forceExperimental') ? 'experimental' : '',
        toctype: calculateTocType(),
        safemode: atom.config.get('asciidoc-preview.safeMode' || 'safe'),
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

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL2F0dHJpYnV0ZXMtYnVpbGRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsa0NBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxjQUFBLEVBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsVUFBQTthQUFBLFVBQUEsR0FDRTtBQUFBLFFBQUEsaUJBQUEsRUFBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFuQjtBQUFBLFFBQ0EsUUFBQSxFQUFVLGdCQUFBLENBQUEsQ0FEVjtBQUFBLFFBRUEsZUFBQSxFQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQUgsR0FBdUQsRUFBdkQsR0FBK0QsbUJBRmhGO0FBQUEsUUFHQSxTQUFBLEVBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFILEdBQXFELFdBQXJELEdBQXNFLFlBSGpGO0FBQUEsUUFJQSxVQUFBLEVBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFILEdBQXNELGVBQXRELEdBQTJFLEVBSnZGO0FBQUEsUUFLQSxpQkFBQSxFQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLENBQUgsR0FBNkQsY0FBN0QsR0FBaUYsRUFMcEc7QUFBQSxRQU1BLE9BQUEsRUFBUyxnQkFBQSxDQUFBLENBTlQ7QUFBQSxRQU9BLFFBQUEsRUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQUEsSUFBK0IsTUFBL0MsQ0FQVjtBQUFBLFFBUUEsT0FBQSxFQUFTLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFSekI7UUFGWTtJQUFBLENBQWhCO0dBREYsQ0FBQTs7QUFBQSxFQWFBLGdCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQVYsQ0FBQTtBQUNBLElBQUEsSUFBRyxPQUFBLEtBQVcsTUFBZDtBQUNFLGFBQU8sRUFBUCxDQURGO0tBQUEsTUFJSyxJQUFHLE9BQUEsS0FBVyxNQUFkO0FBQ0gsYUFBTyxnQkFBUCxDQURHO0tBQUEsTUFBQTtBQUdILGFBQVEsTUFBQSxHQUFNLE9BQU4sR0FBYyxRQUF0QixDQUhHO0tBTlk7RUFBQSxDQWJuQixDQUFBOztBQUFBLEVBd0JBLGdCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixRQUFBLGNBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQixDQUFqQixDQUFBO0FBQ0EsSUFBQSxJQUFHLGNBQUEsS0FBa0IsZ0JBQXJCO2FBQ0UsV0FERjtLQUFBLE1BRUssSUFBRyxjQUFBLEtBQWtCLGlCQUFyQjthQUNILFlBREc7S0FBQSxNQUVBLElBQUcsY0FBQSxLQUFrQixvQkFBckI7YUFDSCxhQURHO0tBQUEsTUFBQTthQUdILEdBSEc7S0FOWTtFQUFBLENBeEJuQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/attributes-builder.coffee
