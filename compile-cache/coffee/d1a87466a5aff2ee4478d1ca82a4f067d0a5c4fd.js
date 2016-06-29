(function() {
  var $, BASE, BOTTOM, BaseSide, CONFLICT_REGEX, Conflict, ConflictParser, Emitter, INVALID, MIDDLE, Navigator, OurSide, Side, TOP, TheirSide, _, _ref;

  $ = require('space-pen').$;

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  _ref = require('./side'), Side = _ref.Side, OurSide = _ref.OurSide, TheirSide = _ref.TheirSide, BaseSide = _ref.BaseSide;

  Navigator = require('./navigator').Navigator;

  CONFLICT_REGEX = /^<{7} (.+)\r?\n([^]*?)(?:\|{7} (.+)\r?\n((?:(?:<{7}[^]*?>{7})|[^])*?))?={7}\r?\n([^]*?)>{7} (.+)(?:\r?\n)?/mg;

  INVALID = null;

  TOP = 'top';

  BASE = 'base';

  MIDDLE = 'middle';

  BOTTOM = 'bottom';

  ConflictParser = (function() {
    var options;

    options = {
      persistent: false,
      invalidate: 'never'
    };

    function ConflictParser(state, editor) {
      this.state = state;
      this.editor = editor;
      this.position = INVALID;
    }

    ConflictParser.prototype.start = function(m) {
      this.m = m;
      this.startRow = this.m.range.start.row;
      this.endRow = this.m.range.end.row;
      this.chunks = this.m.match;
      this.chunks.shift();
      this.currentRow = this.startRow;
      this.position = TOP;
      return this.previousSide = null;
    };

    ConflictParser.prototype.finish = function() {
      return this.previousSide.followingMarker = this.previousSide.refBannerMarker;
    };

    ConflictParser.prototype.markOurs = function() {
      return this._markHunk(OurSide);
    };

    ConflictParser.prototype.markBase = function() {
      return this._markHunk(BaseSide);
    };

    ConflictParser.prototype.markSeparator = function() {
      var marker, sepRowEnd, sepRowStart;
      if (this.position !== MIDDLE) {
        throw new Error("Unexpected position for separator: " + this.position);
      }
      this.position = BOTTOM;
      sepRowStart = this.currentRow;
      sepRowEnd = this._advance(1);
      marker = this.editor.markBufferRange([[sepRowStart, 0], [sepRowEnd, 0]], this.options);
      this.previousSide.followingMarker = marker;
      return new Navigator(marker);
    };

    ConflictParser.prototype.markTheirs = function() {
      return this._markHunk(TheirSide);
    };

    ConflictParser.prototype._markHunk = function(sideKlass) {
      var bannerMarker, bannerRowEnd, bannerRowStart, lines, marker, ref, rowEnd, rowStart, side, sidePosition, text;
      sidePosition = this.position;
      switch (this.position) {
        case TOP:
          ref = this.chunks.shift();
          text = this.chunks.shift();
          lines = text.split(/\n/);
          bannerRowStart = this.currentRow;
          bannerRowEnd = rowStart = this._advance(1);
          rowEnd = this._advance(lines.length - 1);
          this.position = BASE;
          break;
        case BASE:
          this.position = MIDDLE;
          ref = this.chunks.shift();
          text = this.chunks.shift();
          if (!text) {
            return null;
          }
          lines = text.split(/\n/);
          bannerRowStart = this.currentRow;
          bannerRowEnd = rowStart = this._advance(1);
          rowEnd = this._advance(lines.length - 1);
          break;
        case BOTTOM:
          text = this.chunks.shift();
          ref = this.chunks.shift();
          lines = text.split(/\n/);
          rowStart = this.currentRow;
          bannerRowStart = rowEnd = this._advance(lines.length - 1);
          bannerRowEnd = this._advance(1);
          this.position = INVALID;
          break;
        default:
          throw new Error("Unexpected position for side: " + this.position);
      }
      bannerMarker = this.editor.markBufferRange([[bannerRowStart, 0], [bannerRowEnd, 0]], this.options);
      marker = this.editor.markBufferRange([[rowStart, 0], [rowEnd, 0]], this.options);
      if (sidePosition === BASE) {
        this.previousSide.followingMarker = bannerMarker;
      }
      side = new sideKlass(text, ref, marker, bannerMarker, sidePosition);
      this.previousSide = side;
      return side;
    };

    ConflictParser.prototype._advance = function(rowCount) {
      return this.currentRow += rowCount;
    };

    return ConflictParser;

  })();

  Conflict = (function() {
    function Conflict(ours, theirs, base, navigator, state) {
      var _ref1;
      this.ours = ours;
      this.theirs = theirs;
      this.base = base;
      this.navigator = navigator;
      this.state = state;
      this.emitter = new Emitter;
      this.ours.conflict = this;
      this.theirs.conflict = this;
      if ((_ref1 = this.base) != null) {
        _ref1.conflict = this;
      }
      this.navigator.conflict = this;
      this.resolution = null;
    }

    Conflict.prototype.isResolved = function() {
      return this.resolution != null;
    };

    Conflict.prototype.onDidResolveConflict = function(callback) {
      return this.emitter.on('resolve-conflict', callback);
    };

    Conflict.prototype.resolveAs = function(side) {
      this.resolution = side;
      return this.emitter.emit('resolve-conflict');
    };

    Conflict.prototype.scrollTarget = function() {
      return this.ours.marker.getTailBufferPosition();
    };

    Conflict.prototype.markers = function() {
      var _ref1, _ref2;
      return _.flatten([this.ours.markers(), this.theirs.markers(), (_ref1 = (_ref2 = this.base) != null ? _ref2.markers() : void 0) != null ? _ref1 : [], this.navigator.markers()], true);
    };

    Conflict.prototype.toString = function() {
      return "[conflict: " + this.ours + " " + this.theirs + "]";
    };

    Conflict.all = function(state, editor) {
      var marker, previous, results;
      results = [];
      previous = null;
      marker = new ConflictParser(state, editor);
      editor.getBuffer().scan(CONFLICT_REGEX, function(m) {
        var base, c, nav, ours, theirs;
        marker.start(m);
        if (state.isRebase) {
          theirs = marker.markTheirs();
          base = marker.markBase();
          nav = marker.markSeparator();
          ours = marker.markOurs();
        } else {
          ours = marker.markOurs();
          base = marker.markBase();
          nav = marker.markSeparator();
          theirs = marker.markTheirs();
        }
        marker.finish();
        c = new Conflict(ours, theirs, base, nav, state);
        results.push(c);
        nav.linkToPrevious(previous);
        return previous = c;
      });
      return results;
    };

    return Conflict;

  })();

  module.exports = {
    Conflict: Conflict
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9saWIvY29uZmxpY3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdKQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsV0FBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQURELENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlBLE9BQXVDLE9BQUEsQ0FBUSxRQUFSLENBQXZDLEVBQUMsWUFBQSxJQUFELEVBQU8sZUFBQSxPQUFQLEVBQWdCLGlCQUFBLFNBQWhCLEVBQTJCLGdCQUFBLFFBSjNCLENBQUE7O0FBQUEsRUFLQyxZQUFhLE9BQUEsQ0FBUSxhQUFSLEVBQWIsU0FMRCxDQUFBOztBQUFBLEVBT0EsY0FBQSxHQUFpQiw4R0FQakIsQ0FBQTs7QUFBQSxFQWdCQSxPQUFBLEdBQVUsSUFoQlYsQ0FBQTs7QUFBQSxFQWlCQSxHQUFBLEdBQU0sS0FqQk4sQ0FBQTs7QUFBQSxFQWtCQSxJQUFBLEdBQU8sTUFsQlAsQ0FBQTs7QUFBQSxFQW1CQSxNQUFBLEdBQVMsUUFuQlQsQ0FBQTs7QUFBQSxFQW9CQSxNQUFBLEdBQVMsUUFwQlQsQ0FBQTs7QUFBQSxFQXlCTTtBQUdKLFFBQUEsT0FBQTs7QUFBQSxJQUFBLE9BQUEsR0FDRTtBQUFBLE1BQUEsVUFBQSxFQUFZLEtBQVo7QUFBQSxNQUNBLFVBQUEsRUFBWSxPQURaO0tBREYsQ0FBQTs7QUFTYSxJQUFBLHdCQUFFLEtBQUYsRUFBVSxNQUFWLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTtBQUFBLE1BRG9CLElBQUMsQ0FBQSxTQUFBLE1BQ3JCLENB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

//# sourceURL=/Users/naver/.atom/packages/merge-conflicts/lib/conflict.coffee
