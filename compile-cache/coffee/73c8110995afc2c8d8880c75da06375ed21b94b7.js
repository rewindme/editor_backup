(function() {
  var $, Highlights, Task, cheerio, highlighter, path, pathWatcherDirectory, resolveImagePaths, sanitize, scopeForFenceName, tokenizeCodeBlocks, _;

  path = require('path');

  _ = require('underscore-plus');

  cheerio = require('cheerio');

  $ = require('atom-space-pen-views').$;

  Task = require('atom').Task;

  pathWatcherDirectory = atom.packages.resolvePackagePath('markdown-preview');

  Highlights = require(path.join(pathWatcherDirectory, '..', 'highlights'));

  scopeForFenceName = require('./extension-helper').scopeForFenceName;

  highlighter = null;

  exports.toHtml = function(text, filePath, callback) {
    var attributes, taskPath;
    if (atom.config.get('asciidoc-preview.defaultAttributes') == null) {
      return;
    }
    attributes = {
      defaultAttributes: atom.config.get('asciidoc-preview.defaultAttributes'),
      numbered: atom.config.get('asciidoc-preview.showNumberedHeadings') ? 'numbered' : 'numbered!',
      showtitle: atom.config.get('asciidoc-preview.showTitle') ? 'showtitle' : 'showtitle!',
      compatmode: atom.config.get('asciidoc-preview.compatMode') ? 'compat-mode=@' : '',
      showtoc: atom.config.get('asciidoc-preview.showToc') ? 'toc=preamble toc2!' : 'toc! toc2!',
      safemode: atom.config.get('asciidoc-preview.safeMode') || 'safe',
      doctype: atom.config.get('asciidoc-preview.docType') || "article",
      opalPwd: window.location.href
    };
    taskPath = require.resolve('./worker');
    return Task.once(taskPath, text, attributes, filePath, function(html) {
      html = sanitize(html);
      html = resolveImagePaths(html, filePath);
      html = tokenizeCodeBlocks(html);
      return callback(html);
    });
  };

  exports.toText = function(text, filePath, callback) {
    return exports.toHtml(text, filePath, function(error, html) {
      var string;
      if (error) {
        return callback(error);
      } else {
        string = $(document.createElement('div')).append(html)[0].innerHTML;
        return callback(error, string);
      }
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
    var img, imgElement, src, _i, _len, _ref;
    html = $(html);
    _ref = html.find("img");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      imgElement = _ref[_i];
      img = $(imgElement);
      if (src = img.attr('src')) {
        if (src.match(/^(https?:\/\/)/)) {
          continue;
        }
        img.attr('src', path.resolve(path.dirname(filePath), src));
      }
    }
    return html;
  };

  tokenizeCodeBlocks = function(html) {
    var codeBlock, fenceName, fontFamily, highlightedBlock, highlightedHtml, preElement, _i, _len, _ref, _ref1, _ref2;
    html = $(html);
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      $(html).find('code').css('font-family', fontFamily);
    }
    _ref = $.merge(html.filter("pre"), html.find("pre"));
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      preElement = _ref[_i];
      codeBlock = $(preElement.firstChild);
      fenceName = (_ref1 = (_ref2 = codeBlock.attr('class')) != null ? _ref2.replace(/^language-/, '') : void 0) != null ? _ref1 : 'text';
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
    return html;
  };

}).call(this);
