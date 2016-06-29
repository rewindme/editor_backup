(function() {
  var executeAsciiDoctorPdf, opn, path;

  path = require('path');

  opn = require('opn');

  module.exports = {
    convert: function(_arg) {
      var cmd, message, sourceFilePath, target;
      target = _arg.target;
      if (atom.config.get('asciidoc-preview.exportAsPdf.enabled')) {
        sourceFilePath = target.dataset.path;
        cmd = executeAsciiDoctorPdf(sourceFilePath);
        cmd.stdout.on('data', function(data) {
          return atom.notifications.addInfo('Export as PDF:', {
            detail: data.toString() || '',
            dismissable: true
          });
        });
        cmd.stderr.on('data', function(data) {
          console.error("stderr: " + data);
          return atom.notifications.addError('Error:', {
            detail: data.toString() || '',
            dismissable: true
          });
        });
        return cmd.on('close', function(code) {
          var basename, pdfFilePath;
          basename = path.basename(sourceFilePath, path.extname(sourceFilePath));
          pdfFilePath = path.join(path.dirname(sourceFilePath), basename) + '.pdf';
          if (code === 0) {
            atom.notifications.addSuccess('Export as PDF completed!', {
              detail: pdfFilePath || '',
              dismissable: false
            });
            if (atom.config.get('asciidoc-preview.exportAsPdf.openWithExternal')) {
              return opn(pdfFilePath)["catch"](function(error) {
                atom.notifications.addError(error.toString(), {
                  detail: (error != null ? error.stack : void 0) || '',
                  dismissable: true
                });
                return console.error(error);
              });
            }
          } else {
            return atom.notifications.addWarning('Export as PDF completed with errors.', {
              detail: pdfFilePath || '',
              dismissable: false
            });
          }
        });
      } else {
        message = 'This feature is experimental.\nYou must manually activate this feature in the package settings.\n`asciidoctor-pdf` must be installed in you computer.';
        return atom.notifications.addWarning('Export as PDF:', {
          detail: message || '',
          dismissable: true
        });
      }
    }
  };

  executeAsciiDoctorPdf = function(sourceFilePath) {
    var shell, spawn;
    spawn = require('child_process').spawn;
    if (process.platform === 'win32') {
      shell = process.env['SHELL'] || 'cmd.exe';
      return spawn('asciidoctor-pdf.bat', [sourceFilePath], {
        shell: "" + shell + " -i -l"
      });
    } else {
      shell = process.env['SHELL'] || 'bash';
      return spawn('asciidoctor-pdf', [sourceFilePath], {
        shell: "" + shell + " -i -l"
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL3BkZi1jb252ZXJ0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUROLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxPQUFBLEVBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxVQUFBLG9DQUFBO0FBQUEsTUFEUyxTQUFELEtBQUMsTUFDVCxDQUFBO0FBQUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FBSDtBQUVFLFFBQUEsY0FBQSxHQUFpQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQWhDLENBQUE7QUFBQSxRQUVBLEdBQUEsR0FBTSxxQkFBQSxDQUFzQixjQUF0QixDQUZOLENBQUE7QUFBQSxRQUlBLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBWCxDQUFjLE1BQWQsRUFBc0IsU0FBQyxJQUFELEdBQUE7aUJBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsZ0JBQTNCLEVBQTZDO0FBQUEsWUFBQSxNQUFBLEVBQVEsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFBLElBQW1CLEVBQTNCO0FBQUEsWUFBK0IsV0FBQSxFQUFhLElBQTVDO1dBQTdDLEVBRG9CO1FBQUEsQ0FBdEIsQ0FKQSxDQUFBO0FBQUEsUUFPQSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQVgsQ0FBYyxNQUFkLEVBQXNCLFNBQUMsSUFBRCxHQUFBO0FBQ3BCLFVBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBZSxVQUFBLEdB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

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/pdf-converter.coffee
