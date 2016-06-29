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
      attributes = makeAttributes(filePath);
      taskPath = require.resolve('./worker');
      task = Task.once(taskPath, text, attributes);
      task.on('asciidoctor-render:success', function(_arg) {
        var html;
        html = _arg.html;
        if (!html) {
          console.warn("Rendering is empty: " + filePath);
        }
        return resolve(html || '');
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
    if (!html) {
      return html;
    }
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
    if (!html) {
      return html;
    }
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
