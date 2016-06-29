(function() {
  var Asciidoctor, Opal, ajs, path;

  ajs = require('asciidoctor.js')();

  Asciidoctor = ajs.Asciidoctor();

  Opal = ajs.Opal;

  path = require('path');

  module.exports = function(text, attributes, filePath) {
    var callback, concatAttributes, folder, html, opts;
    concatAttributes = attributes.defaultAttributes.concat(' icons=font@ ').concat(attributes.numbered).concat(' ').concat(attributes.showtitle).concat(' ').concat(attributes.compatmode).concat(' ').concat(attributes.toctype);
    folder = path.dirname(filePath);
    Opal.ENV['$[]=']("PWD", path.dirname(attributes.opalPwd));
    opts = Opal.hash2(['base_dir', 'safe', 'doctype', 'attributes'], {
      'base_dir': folder,
      'safe': attributes.safemode,
      'doctype': attributes.doctype,
      'attributes': concatAttributes
    });
    html = Asciidoctor.$convert(text, opts);
    callback = this.async();
    return callback(html);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL3dvcmtlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBQUEsQ0FBQSxDQUFOLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQURkLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBRlgsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLFFBQW5CLEdBQUE7QUFFZixRQUFBLDhDQUFBO0FBQUEsSUFBQSxnQkFBQSxHQUFtQixVQUFVLENBQUMsaUJBQWlCLENBQUMsTUFBN0IsQ0FBb0MsZUFBcEMsQ0FDRCxDQUFDLE1BREEsQ0FDTyxVQUFVLENBQUMsUUFEbEIsQ0FDMkIsQ0FBQyxNQUQ1QixDQUNtQyxHQURuQyxDQUVELENBQUMsTUFGQSxDQUVPLFVBQVUsQ0FBQyxTQUZsQixDQUU0QixDQUFDLE1BRjdCLENBRW9DLEdBRnBDLENBR0QsQ0FBQyxNQUhBLENBR08sVUFBVSxDQUFDLFVBSGxCLENBRzZCLENBQUMsTUFIOUIsQ0FHcUMsR0FIckMsQ0FJRCxDQUFDLE1BSkEsQ0FJTyxVQUFVLENBQUMsT0FKbEIsQ0FBbkIsQ0FBQTtBQUFBLElBTUEsTUFBQSxHQUFTLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQU5ULENBQUE7QUFBQSxJQU9BLElBQUksQ0FBQyxHQUFJLENBQUEsTUFBQSxDQUFULENBQWlCLEtBQWpCLEVBQXdCLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBVSxDQUFDLE9BQXhCLENBQXhCLENBUEEsQ0FBQTtBQUFBLElBUUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxVQUFELEVBQWEsTUFBYixFQUFxQixTQUFyQixFQUFnQyxZQUFoQyxDQUFYLEVBQTBEO0FBQUEsTUFDN0QsVUFBQSxFQUFZLE1BRGlEO0FBQUEsTUFFN0QsTUFBQSxFQUFRLFVBQVUsQ0FBQyxRQUYwQztBQUFBLE1BRzdELFNBQUEsRUFBVyxVQUFVLENBQUMsT0FIdUM7QUFBQSxNQUk3RCxZQUFBLEVBQWMsZ0JBSitDO0tBQTFELENBUlAsQ0FBQTtBQUFBLElBY0EsSUFBQSxHQUFPLFdBQVcsQ0FBQyxRQUFaLENBQXFCLElBQXJCLEVBQTJCLElBQTNCLENBZFAsQ0FBQTtBQUFBLElBZUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FmWCxDQUFBO1dBZ0JBLFFBQUEsQ0FBUyxJQUFULEVBbEJlO0VBQUEsQ0FMakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/worker.coffee
