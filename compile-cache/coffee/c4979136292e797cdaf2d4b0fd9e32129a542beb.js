(function() {
  var $, Highlights, Task, calculateTocType, cheerio, highlighter, path, pathWatcherDirectory, resolveImagePaths, sanitize, scopeForFenceName, tokenizeCodeBlocks, _;

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
      toctype: calculateTocType(),
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

  calculateTocType = function() {
    if (atom.config.get('asciidoc-preview.tocType') === 'none') {
      return "";
    } else if (atom.config.get('asciidoc-preview.tocType') === 'auto') {
      return "toc! toc2!";
    } else {
      return "toc=" + (atom.config.get('asciidoc-preview.tocType')) + " toc2!";
    }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL3JlbmRlcmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4SkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUZWLENBQUE7O0FBQUEsRUFHQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBSEQsQ0FBQTs7QUFBQSxFQUlDLE9BQVEsT0FBQSxDQUFRLE1BQVIsRUFBUixJQUpELENBQUE7O0FBQUEsRUFNQSxvQkFBQSxHQUF1QixJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQWlDLGtCQUFqQyxDQU52QixDQUFBOztBQUFBLEVBT0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLG9CQUFWLEVBQWdDLElBQWhDLEVBQXNDLFlBQXRDLENBQVIsQ0FQYixDQUFBOztBQUFBLEVBUUMsb0JBQXFCLE9BQUEsQ0FBUSxvQkFBUixFQUFyQixpQkFSRCxDQUFBOztBQUFBLEVBVUEsV0FBQSxHQUFjLElBVmQsQ0FBQTs7QUFBQSxFQVlBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsUUFBakIsR0FBQTtBQUNmLFFBQUEsb0JBQUE7QUFBQSxJQUFBLElBQWMsNkRBQWQ7QUFBQSxZQUFBLENBQUE7S0FBQTtBQUFBLElBQ0EsVUFBQSxHQUFhO0FBQUEsTUFDWCxpQkFBQSxFQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLENBRFI7QUFBQSxNQUVYLFFB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

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/renderer.coffee
