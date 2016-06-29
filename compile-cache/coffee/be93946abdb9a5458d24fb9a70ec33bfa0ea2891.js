(function() {
  var Asciidoctor, Opal, ajs, path, stdStream;

  ajs = require('asciidoctor.js')();

  Asciidoctor = ajs.Asciidoctor();

  Opal = ajs.Opal;

  path = require('path');

  stdStream = require('./std-stream-hook');

  module.exports = function(text, attributes) {
    var callback, code, concatAttributes, errno, error, html, options, stack, syscall;
    callback = this.async();
    concatAttributes = [attributes.defaultAttributes, 'icons=font@', attributes.numbered, attributes.skipFrontMatter, attributes.showTitle, attributes.compatMode, attributes.tocType, attributes.forceExperimental].join(' ').trim();
    Opal.ENV['$[]=']('PWD', path.dirname(attributes.opalPwd));
    options = Opal.hash({
      base_dir: attributes.baseDir,
      safe: attributes.safeMode,
      doctype: 'article',
      backend: 'html5',
      attributes: concatAttributes
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL3dvcmtlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBQUEsQ0FBQSxDQUFOLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQURkLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBRlgsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSLENBSlosQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLFVBQVAsR0FBQTtBQUNmLFFBQUEsNkVBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsS0FBRCxDQUFBLENBQVgsQ0FBQTtBQUFBLElBRUEsZ0JBQUEsR0FBbUIsQ0FDakIsVUFBVSxDQUFDLGlCQURNLEVBRWpCLGFBRmlCLEVBR2pCLFVBQVUsQ0FBQyxRQUhNLEVBSWpCLFVBQVUsQ0FBQyxlQUpNLEVBS2pCLFVBQVUsQ0FBQyxTQUxNLEVBTWpCLFVBQVUsQ0FBQyxVQU5NLEVBT2pCLFVBQVUsQ0FBQyxPQVBNLEVBUWpCLFVBQVUsQ0FBQyxpQkFSTSxDQVNsQixDQUFDLElBVGlCLENBU1osR0FUWSxDQVNSLENBQUMsSUFUTyxDQUFBLENBRm5CLENBQUE7QUFBQSxJQWFBLElBQUksQ0FBQyxHQUFJLENBQUEsTUFBQSxDQUFULENBQWlCLEtBQWpCLEVBQXdCLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBVSxDQUFDLE9BQXhCLENBQXhCLENBYkEsQ0FBQTtBQUFBLElBZUEsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQ1I7QUFBQSxNQUFBLFFBQUEsRUFBVSxVQUFVLENBQUMsT0FBckI7QUFBQSxNQUNBLElBQUEsRUFBTSxVQUFVLENBQUMsUUFEakI7QUFBQSxNQUVBLE9BQUEsRUFBUyxTQUZUO0FBQUEsTUFJQSxPQUFBLEVBQVMsT0FKVDtBQUFBLE1BS0EsVUFBQSxFQUFZLGdCQUxaO0tBRFEsQ0FmVixDQUFBO0FBdUJBO0FBQ0UsTUFBQSxTQUFTLENBQUMsSUFBVixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLFdBQVcsQ0FBQyxRQUFaLENBQXFCLElBQXJCLEVBQTJCLE9BQTNCLENBRFAsQ0FBQTtBQUFBLE1BRUEsU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUEsQ0FBSyw0QkFBTCxFQUFtQztBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47T0FBbkMsQ0FIQSxDQURGO0tBQUEsY0FBQTtBQU1FLE1BREksY0FDSixDQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEtBQWQsQ0FBQSxDQUFBO0FBQUEsTUFDQyxhQUFBLElBQUQsRUFBTyxjQUFBLEtBQVAsRUFBYyxnQkFBQSxPQUFkLEVBQXVCLGNBQUEsS0FEdkIsQ0FBQTtBQUFBLE1BRUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFkLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQSxDQUFLLDBCQUFMLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLFFBRUEsT0FBQSxFQUFTLE9BRlQ7QUFBQSxRQUdBLEtBQUEsRUFBTyxLQUhQO09BREYsQ0FIQSxDQU5GO0tBdkJBO1dBc0NBLFFBQUEsQ0FBQSxFQXZDZTtFQUFBLENBTmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/worker.coffee
