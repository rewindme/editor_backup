(function() {
  var Asciidoctor, Opal, ajs, path, stdStream;

  ajs = require('asciidoctor.js')();

  Asciidoctor = ajs.Asciidoctor();

  Opal = ajs.Opal;

  path = require('path');

  stdStream = require('./std-stream-hook');

  module.exports = function(text, attributes, filePath) {
    var callback, code, concatAttributes, errno, error, folder, html, options, stack, syscall;
    callback = this.async();
    concatAttributes = [attributes.defaultAttributes, 'icons=font@', attributes.numbered, attributes.skipfrontmatter, attributes.showtitle, attributes.compatmode, attributes.toctype, attributes.forceExperimental].join(' ');
    folder = path.dirname(filePath);
    Opal.ENV['$[]=']('PWD', path.dirname(attributes.opalPwd));
    options = Opal.hash({
      base_dir: folder,
      safe: attributes.safemode,
      doctype: 'article',
      backend: 'html5',
      attributes: concatAttributes.trim()
    });
    try {
      stdStream.hook();
      html = Asciidoctor.$convert(text, options);
      stdStream.restore();
      emit('asciidoctor-render:success', {
        html: html
      });
    } catch (_error) {
      error = _error;
      console.error(error);
      code = error.code, errno = error.errno, syscall = error.syscall, stack = error.stack;
      console.error(stack);
      emit('asciidoctor-render:error', {
        code: code,
        errno: errno,
        syscall: syscall,
        stack: stack
      });
    }
    return callback();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL3dvcmtlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBQUEsQ0FBQSxDQUFOLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQURkLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBRlgsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSLENBSlosQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsUUFBbkIsR0FBQTtBQUNmLFFBQUEscUZBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsS0FBRCxDQUFBLENBQVgsQ0FBQTtBQUFBLElBRUEsZ0JBQUEsR0FBbUIsQ0FDakIsVUFBVSxDQUFDLGlCQURNLEVBRWpCLGFBRmlCLEVBR2pCLFVBQVUsQ0FBQyxRQUhNLEVBSWpCLFVBQVUsQ0FBQyxlQUpNLEVBS2pCLFVBQVUsQ0FBQyxTQUxNLEVBTWpCLFVBQVUsQ0FBQyxVQU5NLEVBT2pCLFVBQVUsQ0FBQyxPQVBNLEVBUWpCLFVBQVUsQ0FBQyxpQkFSTSxDQVNsQixDQUFDLElBVGlCLENBU1osR0FUWSxDQUZuQixDQUFBO0FBQUEsSUFhQSxNQUFBLEdBQVMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBYlQsQ0FBQTtBQUFBLElBZUEsSUFBSSxDQUFDLEdBQUksQ0FBQSxNQUFBLENBQVQsQ0FBaUIsS0FBakIsRUFBd0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFVLENBQUMsT0FBeEIsQ0FBeEIsQ0FmQSxDQUFBO0FBQUEsSUFpQkEsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQ1I7QUFBQSxNQUFBLFFBQUEsRUFBVSxNQUFWO0FBQUEsTUFDQSxJQUFBLEVBQU0sVUFBVSxDQUFDLFFBRGpCO0FBQUEsTUFFQSxPQUFBLEVBQVMsU0FGVDtBQUFBLE1BSUEsT0FBQSxFQUFTLE9BSlQ7QUFBQSxNQUtBLFVBQUEsRUFBWSxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFBLENBTFo7S0FEUSxDQWpCVixDQUFBO0FBeUJBO0FBQ0UsTUFBQSxTQUFTLENBQUMsSUFBVixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLFdBQVcsQ0FBQyxRQUFaLENBQXFCLElBQXJCLEVBQTJCLE9BQTNCLENBRFAsQ0FBQTtBQUFBLE1BRUEsU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUEsQ0FBSyw0QkFBTCxFQUFtQztBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47T0FBbkMsQ0FIQSxDQURGO0tBQUEsY0FBQTtBQU1FLE1BREksY0FDSixDQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEtBQWQsQ0FBQSxDQUFBO0FBQUEsTUFDQyxhQUFBLElBQUQsRUFBTyxjQUFBLEtBQVAsRUFBYyxnQkFBQSxPQUFkLEVBQXVCLGNBQUEsS0FEdkIsQ0FBQTtBQUFBLE1BRUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFkLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQSxDQUFLLDBCQUFMLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLFFBRUEsT0FBQSxFQUFTLE9BRlQ7QUFBQSxRQUdBLEtBQUEsRUFBTyxLQUhQO09BREYsQ0FIQSxDQU5GO0tBekJBO1dBd0NBLFFBQUEsQ0FBQSxFQXpDZTtFQUFBLENBTmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/worker.coffee
