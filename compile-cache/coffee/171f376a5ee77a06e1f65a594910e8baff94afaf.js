(function() {
  var $, Highlights, Task, cheerio, fs, highlighter, makeAttributes, packagePath, path, render, resolveImagePaths, resourcePath, sanitize, scopeForFenceName, tokenizeCodeBlocks;

  $ = require('atom-space-pen-views').$;

  Task = require('atom').Task;

  path = require('path');

  fs = require('fs-plus');

  cheerio = require('cheerio');

  Highlights = require(path.join(atom.packages.resolvePackagePath('markdown-preview'), '..', 'highlights'));

  scopeForFenceName = require('./highlights-helper').scopeForFenceName;

  makeAttributes = require('./attributes-builder').makeAttributes;

  highlighter = null;

  resourcePath = atom.getLoadSettings().resourcePath;

  packagePath = path.dirname(__dirname);

  exports.toHtml = function(text, filePath) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath).then(function(html) {
      return sanitize(html);
    }).then(function(html) {
      return resolveImagePaths(html, filePath);
    }).then(function(html) {
      return tokenizeCodeBlocks(html);
    });
  };

  exports.toRawHtml = function(text, filePath) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath);
  };

  render = function(text, filePath) {
    if (text == null) {
      text = '';
    }
    if (atom.config.get('asciidoc-preview.defaultAttributes') == null) {
      return Promise.resolve();
    }
    return new Promise(function(resolve, reject) {
      var attributes, task, taskPath;
      attributes = makeAttributes();
      taskPath = require.resolve('./worker');
      task = Task.once(taskPath, text, attributes, filePath);
      task.on('asciidoctor-render:success', function(_arg) {
        var html;
        html = _arg.html;
        return resolve(html);
      });
      return task.on('asciidoctor-render:error', function(_arg) {
        var code, errno, stack, syscall;
        code = _arg.code, errno = _arg.errno, syscall = _arg.syscall, stack = _arg.stack;
        return resolve("<div>\n  <h1>Asciidoctor.js error</h1>\n  <h2>Rendering error</h2>\n  <div>\n    <p><b>Please verify your document syntax.</b></p>\n    <p>Details: " + (stack.split('\n')[0]) + "</p>\n    <p>[code: " + code + ", errno: " + errno + ", syscall: " + syscall + "]<p>\n    <div>" + stack + "</div>\n  </div>\n</div>");
      });
    });
  };

  sanitize = function(html) {
    var attribute, attributesToRemove, o, _i, _len;
    o = cheerio.load(html);
    o('script').remove();
    attributesToRemove = ['onabort', 'onblur', 'onchange', 'onclick', 'ondbclick', 'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onreset', 'onresize', 'onscroll', 'onselect', 'onsubmit', 'onunload'];
    for (_i = 0, _len = attributesToRemove.length; _i < _len; _i++) {
      attribute = attributesToRemove[_i];
      o('*').removeAttr(attribute);
    }
    return o.html();
  };

  resolveImagePaths = function(html, filePath) {
    var img, imgElement, o, rootDirectory, src, _i, _len, _ref;
    rootDirectory = atom.project.relativizePath(filePath)[0];
    o = cheerio.load(html);
    _ref = o('img');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      imgElement = _ref[_i];
      img = o(imgElement);
      if (src = img.attr('src')) {
        if (src.match(/^(https?|atom):\/\//)) {
          continue;
        }
        if (src.startsWith(process.resourcesPath)) {
          continue;
        }
        if (src.startsWith(resourcePath)) {
          continue;
        }
        if (src.startsWith(packagePath)) {
          continue;
        }
        if (src[0] === '/') {
          if (!fs.isFileSync(src)) {
            if (rootDirectory) {
              img.attr('src', path.join(rootDirectory, src.substring(1)));
            }
          }
        } else {
          img.attr('src', path.resolve(path.dirname(filePath), src));
        }
      }
    }
    return o.html();
  };

  tokenizeCodeBlocks = function(html, defaultLanguage) {
    var codeBlock, fenceName, fontFamily, highlightedBlock, highlightedHtml, preElement, _i, _len, _ref, _ref1, _ref2, _ref3;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    html = $(html);
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      html.find('code').css('font-family', fontFamily);
    }
    _ref = $.merge(html.filter('pre'), html.find('pre'));
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      preElement = _ref[_i];
      codeBlock = $(preElement.firstChild);
      if (((_ref1 = codeBlock[0]) != null ? _ref1.nodeType : void 0) !== Node.TEXT_NODE) {
        fenceName = (_ref2 = (_ref3 = codeBlock.attr('class')) != null ? _ref3.replace(/^language-/, '') : void 0) != null ? _ref2 : defaultLanguage;
        if (highlighter == null) {
          highlighter = new Highlights({
            registry: atom.grammars
          });
        }
        highlightedHtml = highlighter.highlightSync({
          fileContents: codeBlock.text(),
          scopeName: scopeForFenceName(fenceName)
        });
        highlightedBlock = $(highlightedHtml);
        highlightedBlock.removeClass('editor').addClass("lang-" + fenceName);
        highlightedBlock.insertAfter(preElement);
        preElement.remove();
      }
    }
    return html;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL3JlbmRlcmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwS0FBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBSlYsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxPQUFBLENBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQWlDLGtCQUFqQyxDQUFWLEVBQWdFLElBQWhFLEVBQXNFLFlBQXRFLENBQVIsQ0FOYixDQUFBOztBQUFBLEVBT0Msb0JBQXFCLE9BQUEsQ0FBUSxxQkFBUixFQUFyQixpQkFQRCxDQUFBOztBQUFBLEVBU0MsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUixFQUFsQixjQVRELENBQUE7O0FBQUEsRUFXQSxXQUFBLEdBQWMsSUFYZCxDQUFBOztBQUFBLEVBWUMsZUFBZ0IsSUFBSSxDQUFDLGVBQUwsQ0FBQSxFQUFoQixZQVpELENBQUE7O0FBQUEsRUFhQSxXQUFBLEdBQWMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLENBYmQsQ0FBQTs7QUFBQSxFQWVBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsSUFBRCxFQUFVLFFBQVYsR0FBQTs7TUFBQyxPQUFLO0tBQ3JCO1dBQUEsTUFBQSxDQUFPLElBQVAsRUFBYSxR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

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/renderer.coffee
