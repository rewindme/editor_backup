(function() {
  var fs, path, _;

  _ = require("underscore-plus");

  path = require("path");

  fs = require('fs-plus');

  module.exports = {
    selector: ".source.asciidoc",
    disableForSelector: ".source.asciidoc .comment.block.asciidoc",
    inclusionPriority: 1,
    excludeLowerPriority: true,
    filterSuggestions: true,
    getSuggestions: function(_arg) {
      var asciidocAttr, bufferPosition, counter, currentRow, editor, pattern, potentialAttributes, prefix, textLines;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      prefix = this.getPrefix(editor, bufferPosition);
      if (prefix === "") {
        return;
      }
      pattern = /^:([a-zA-Z_\-!]+):/;
      textLines = editor.getText().split(/\n/);
      currentRow = editor.getCursorScreenPosition().row;
      counter = 0;
      potentialAttributes = _.chain(textLines).filter(function(line) {
        counter++;
        return pattern.test(line) && counter <= currentRow;
      }).map(function(rawAttribute) {
        return pattern.exec(rawAttribute)[1];
      }).uniq().value();
      potentialAttributes = _.map(potentialAttributes, function(attribute) {
        var value;
        return value = {
          type: "variable",
          text: attribute,
          displayText: attribute,
          rightLabel: "local"
        };
      });
      asciidocAttr = _.map(this.attributes, function(attribute, key) {
        var value;
        return value = {
          type: "variable",
          text: key,
          displayText: key,
          rightLabel: "asciidoc",
          description: attribute.description
        };
      });
      potentialAttributes = potentialAttributes.concat(asciidocAttr);
      potentialAttributes = _.sortBy(potentialAttributes, function(_attribute) {
        return _attribute.text.toLowerCase();
      });
      return new Promise(function(resolve) {
        return resolve(potentialAttributes);
      });
    },
    getPrefix: function(editor, bufferPosition) {
      var line, regex, _ref;
      regex = /\{(\b\w*[a-zA-Z_\-!]\w*\b)?/g;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref = line.match(regex)) != null ? _ref[0] : void 0) || "";
    },
    loadCompletions: function() {
      this.attributes = {};
      return fs.readFile(path.resolve(__dirname, "..", "completions.json"), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.attributes = JSON.parse(content).attributes;
          }
        };
      })(this));
    }
  };

}).call(this);
