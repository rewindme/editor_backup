

/**
 * Track current position in code generation.
 */

"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

exports.__esModule = true;

var Position = (function () {
  function Position() {
    _classCallCheck(this, Position);

    this.line = 1;
    this.column = 0;
  }

  /**
   * Push a string to the current position, mantaining the current line and column.
   */

  Position.prototype.push = function push(str /*: string*/) /*: void*/{
    for (var i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        this.line++;
        this.column = 0;
      } else {
        this.column++;
      }
    }
  };

  /**
   * Unshift a string from the current position, mantaining the current line and column.
   */

  Position.prototype.unshift = function unshift(str /*: string*/) /*: void*/{
    for (var i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        this.line--;
      } else {
        this.column--;
      }
    }
  };

  return Position;
})();

exports["default"] = Position;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtZ2VuZXJhdG9yL2xpYi9wb3NpdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRW5GLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUUxQixJQUFJLFFBQVEsR0FBRyxDQUFDLFlBQVk7QUFDMUIsV0FBUyxRQUFRLEdBQUc7QUFDbEIsbUJBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRWhDLFFBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7R0FDakI7Ozs7OztBQU1ELFVBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDLEdBQUcseUJBQTBCO0FBQ25FLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLFVBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtBQUNuQixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixZQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztPQUNqQixNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7S0FDRjtHQUNGLENBQUM7Ozs7OztBQU1GLFVBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsT0FBTyxDQUFDLEdBQUcseUJBQTBCO0FBQ3pFLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLFVBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtBQUNuQixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYixNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7S0FDRjtHQUNGLENBQUM7O0FBRUYsU0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQSxFQUFHLENBQUM7O0FBRUwsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQtZ3VscC9zcGVjL2ZpeHR1cmUvbm9kZV9tb2R1bGVzX2JhYmVsL2JhYmVsLWdlbmVyYXRvci9saWIvcG9zaXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG4vKipcbiAqIFRyYWNrIGN1cnJlbnQgcG9zaXRpb24gaW4gY29kZSBnZW5lcmF0aW9uLlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIFBvc2l0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUG9zaXRpb24oKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvc2l0aW9uKTtcblxuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2x1bW4gPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1c2ggYSBzdHJpbmcgdG8gdGhlIGN1cnJlbnQgcG9zaXRpb24sIG1hbnRhaW5pbmcgdGhlIGN1cnJlbnQgbGluZSBhbmQgY29sdW1uLlxuICAgKi9cblxuICBQb3NpdGlvbi5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2goc3RyIC8qOiBzdHJpbmcqLykgLyo6IHZvaWQqLyB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzdHJbaV0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgdGhpcy5saW5lKys7XG4gICAgICAgIHRoaXMuY29sdW1uID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29sdW1uKys7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBVbnNoaWZ0IGEgc3RyaW5nIGZyb20gdGhlIGN1cnJlbnQgcG9zaXRpb24sIG1hbnRhaW5pbmcgdGhlIGN1cnJlbnQgbGluZSBhbmQgY29sdW1uLlxuICAgKi9cblxuICBQb3NpdGlvbi5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uIHVuc2hpZnQoc3RyIC8qOiBzdHJpbmcqLykgLyo6IHZvaWQqLyB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzdHJbaV0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgdGhpcy5saW5lLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbHVtbi0tO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUG9zaXRpb247XG59KSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFBvc2l0aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiXX0=
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babel-generator/lib/position.js
