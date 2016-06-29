

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _tokenizerTypes = require("../tokenizer/types");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _utilWhitespace = require("../util/whitespace");

var pp = _index2["default"].prototype;

// ## Parser utilities

// TODO

pp.addExtra = function (node, key, val) {
  if (!node) return;

  var extra = node.extra = node.extra || {};
  extra[key] = val;
};

// TODO

pp.isRelational = function (op) {
  return this.match(_tokenizerTypes.types.relational) && this.state.value === op;
};

// TODO

pp.expectRelational = function (op) {
  if (this.isRelational(op)) {
    this.next();
  } else {
    this.unexpected();
  }
};

// Tests whether parsed token is a contextual keyword.

pp.isContextual = function (name) {
  return this.match(_tokenizerTypes.types.name) && this.state.value === name;
};

// Consumes contextual keyword if possible.

pp.eatContextual = function (name) {
  return this.state.value === name && this.eat(_tokenizerTypes.types.name);
};

// Asserts that following token is given contextual keyword.

pp.expectContextual = function (name) {
  if (!this.eatContextual(name)) this.unexpected();
};

// Test whether a semicolon can be inserted at the current position.

pp.canInsertSemicolon = function () {
  return this.match(_tokenizerTypes.types.eof) || this.match(_tokenizerTypes.types.braceR) || _utilWhitespace.lineBreak.test(this.input.slice(this.state.lastTokEnd, this.state.start));
};

// TODO

pp.isLineTerminator = function () {
  return this.eat(_tokenizerTypes.types.semi) || this.canInsertSemicolon();
};

// Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.

pp.semicolon = function () {
  if (!this.isLineTerminator()) this.unexpected();
};

// Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.

pp.expect = function (type) {
  return this.eat(type) || this.unexpected();
};

// Raise an unexpected token error.

pp.unexpected = function (pos) {
  this.raise(pos != null ? pos : this.state.start, "Unexpected token");
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFieWxvbi9saWIvcGFyc2VyL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFakcsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRXBELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFaEMsSUFBSSxPQUFPLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTdDLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUVwRCxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDOzs7Ozs7QUFNdEMsRUFBRSxDQUFDLFFBQVEsR0FBRyxVQUFVLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ3RDLE1BQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFbEIsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUMxQyxPQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0NBQ2xCLENBQUM7Ozs7QUFJRixFQUFFLENBQUMsWUFBWSxHQUFHLFVBQVUsRUFBRSxFQUFFO0FBQzlCLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQztDQUNoRixDQUFDOzs7O0FBSUYsRUFBRSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsRUFBRSxFQUFFO0FBQ2xDLE1BQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN6QixRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYixNQUFNO0FBQ0wsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25CO0NBQ0YsQ0FBQzs7OztBQUlGLEVBQUUsQ0FBQyxZQUFZLEdBQUcsVUFBVSxJQUFJLEVBQUU7QUFDaEMsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDO0NBQzVFLENBQUM7Ozs7QUFJRixFQUFFLENBQUMsYUFBYSxHQUFHLFVBQVUsSUFBSSxFQUFFO0FBQ2pDLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUMxRSxDQUFDOzs7O0FBSUYsRUFBRSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsSUFBSSxFQUFFO0FBQ3BDLE1BQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztDQUNsRCxDQUFDOzs7O0FBSUYsRUFBRSxDQUFDLGtCQUFrQixHQUFHLFlBQVk7QUFDbEMsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztDQUN2TCxDQUFDOzs7O0FBSUYsRUFBRSxDQUFDLGdCQUFnQixHQUFHLFlBQVk7QUFDaEMsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Q0FDMUUsQ0FBQzs7Ozs7QUFLRixFQUFFLENBQUMsU0FBUyxHQUFHLFlBQVk7QUFDekIsTUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztDQUNqRCxDQUFDOzs7OztBQUtGLEVBQUUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxJQUFJLEVBQUU7QUFDMUIsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztDQUM1QyxDQUFDOzs7O0FBSUYsRUFBRSxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsRUFBRTtBQUM3QixNQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Q0FDdEUsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQtZ3VscC9zcGVjL2ZpeHR1cmUvbm9kZV9tb2R1bGVzX2JhYmVsL2JhYnlsb24vbGliL3BhcnNlci91dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbnRlcm9wLXJlcXVpcmUtZGVmYXVsdFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfdG9rZW5pemVyVHlwZXMgPSByZXF1aXJlKFwiLi4vdG9rZW5pemVyL3R5cGVzXCIpO1xuXG52YXIgX2luZGV4ID0gcmVxdWlyZShcIi4vaW5kZXhcIik7XG5cbnZhciBfaW5kZXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5kZXgpO1xuXG52YXIgX3V0aWxXaGl0ZXNwYWNlID0gcmVxdWlyZShcIi4uL3V0aWwvd2hpdGVzcGFjZVwiKTtcblxudmFyIHBwID0gX2luZGV4MltcImRlZmF1bHRcIl0ucHJvdG90eXBlO1xuXG4vLyAjIyBQYXJzZXIgdXRpbGl0aWVzXG5cbi8vIFRPRE9cblxucHAuYWRkRXh0cmEgPSBmdW5jdGlvbiAobm9kZSwga2V5LCB2YWwpIHtcbiAgaWYgKCFub2RlKSByZXR1cm47XG5cbiAgdmFyIGV4dHJhID0gbm9kZS5leHRyYSA9IG5vZGUuZXh0cmEgfHwge307XG4gIGV4dHJhW2tleV0gPSB2YWw7XG59O1xuXG4vLyBUT0RPXG5cbnBwLmlzUmVsYXRpb25hbCA9IGZ1bmN0aW9uIChvcCkge1xuICByZXR1cm4gdGhpcy5tYXRjaChfdG9rZW5pemVyVHlwZXMudHlwZXMucmVsYXRpb25hbCkgJiYgdGhpcy5zdGF0ZS52YWx1ZSA9PT0gb3A7XG59O1xuXG4vLyBUT0RPXG5cbnBwLmV4cGVjdFJlbGF0aW9uYWwgPSBmdW5jdGlvbiAob3ApIHtcbiAgaWYgKHRoaXMuaXNSZWxhdGlvbmFsKG9wKSkge1xuICAgIHRoaXMubmV4dCgpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudW5leHBlY3RlZCgpO1xuICB9XG59O1xuXG4vLyBUZXN0cyB3aGV0aGVyIHBhcnNlZCB0b2tlbiBpcyBhIGNvbnRleHR1YWwga2V5d29yZC5cblxucHAuaXNDb250ZXh0dWFsID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMubWF0Y2goX3Rva2VuaXplclR5cGVzLnR5cGVzLm5hbWUpICYmIHRoaXMuc3RhdGUudmFsdWUgPT09IG5hbWU7XG59O1xuXG4vLyBDb25zdW1lcyBjb250ZXh0dWFsIGtleXdvcmQgaWYgcG9zc2libGUuXG5cbnBwLmVhdENvbnRleHR1YWwgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gdGhpcy5zdGF0ZS52YWx1ZSA9PT0gbmFtZSAmJiB0aGlzLmVhdChfdG9rZW5pemVyVHlwZXMudHlwZXMubmFtZSk7XG59O1xuXG4vLyBBc3NlcnRzIHRoYXQgZm9sbG93aW5nIHRva2VuIGlzIGdpdmVuIGNvbnRleHR1YWwga2V5d29yZC5cblxucHAuZXhwZWN0Q29udGV4dHVhbCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmICghdGhpcy5lYXRDb250ZXh0dWFsKG5hbWUpKSB0aGlzLnVuZXhwZWN0ZWQoKTtcbn07XG5cbi8vIFRlc3Qgd2hldGhlciBhIHNlbWljb2xvbiBjYW4gYmUgaW5zZXJ0ZWQgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG5cbnBwLmNhbkluc2VydFNlbWljb2xvbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMubWF0Y2goX3Rva2VuaXplclR5cGVzLnR5cGVzLmVvZikgfHwgdGhpcy5tYXRjaChfdG9rZW5pemVyVHlwZXMudHlwZXMuYnJhY2VSKSB8fCBfdXRpbFdoaXRlc3BhY2UubGluZUJyZWFrLnRlc3QodGhpcy5pbnB1dC5zbGljZSh0aGlzLnN0YXRlLmxhc3RUb2tFbmQsIHRoaXMuc3RhdGUuc3RhcnQpKTtcbn07XG5cbi8vIFRPRE9cblxucHAuaXNMaW5lVGVybWluYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZWF0KF90b2tlbml6ZXJUeXBlcy50eXBlcy5zZW1pKSB8fCB0aGlzLmNhbkluc2VydFNlbWljb2xvbigpO1xufTtcblxuLy8gQ29uc3VtZSBhIHNlbWljb2xvbiwgb3IsIGZhaWxpbmcgdGhhdCwgc2VlIGlmIHdlIGFyZSBhbGxvd2VkIHRvXG4vLyBwcmV0ZW5kIHRoYXQgdGhlcmUgaXMgYSBzZW1pY29sb24gYXQgdGhpcyBwb3NpdGlvbi5cblxucHAuc2VtaWNvbG9uID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuaXNMaW5lVGVybWluYXRvcigpKSB0aGlzLnVuZXhwZWN0ZWQoKTtcbn07XG5cbi8vIEV4cGVjdCBhIHRva2VuIG9mIGEgZ2l2ZW4gdHlwZS4gSWYgZm91bmQsIGNvbnN1bWUgaXQsIG90aGVyd2lzZSxcbi8vIHJhaXNlIGFuIHVuZXhwZWN0ZWQgdG9rZW4gZXJyb3IuXG5cbnBwLmV4cGVjdCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHJldHVybiB0aGlzLmVhdCh0eXBlKSB8fCB0aGlzLnVuZXhwZWN0ZWQoKTtcbn07XG5cbi8vIFJhaXNlIGFuIHVuZXhwZWN0ZWQgdG9rZW4gZXJyb3IuXG5cbnBwLnVuZXhwZWN0ZWQgPSBmdW5jdGlvbiAocG9zKSB7XG4gIHRoaXMucmFpc2UocG9zICE9IG51bGwgPyBwb3MgOiB0aGlzLnN0YXRlLnN0YXJ0LCBcIlVuZXhwZWN0ZWQgdG9rZW5cIik7XG59OyJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babylon/lib/parser/util.js
