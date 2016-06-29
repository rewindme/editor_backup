

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.

"use strict";

exports.__esModule = true;
exports.isNewLine = isNewLine;
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
exports.lineBreak = lineBreak;
var lineBreakG = new RegExp(lineBreak.source, "g");

exports.lineBreakG = lineBreakG;

function isNewLine(code /*: number*/) /*: boolean*/{
  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029;
}

var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
exports.nonASCIIwhitespace = nonASCIIwhitespace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFieWxvbi9saWIvdXRpbC93aGl0ZXNwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0EsWUFBWSxDQUFDOztBQUViLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzlCLElBQUksU0FBUyxHQUFHLHdCQUF3QixDQUFDO0FBQ3pDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzlCLElBQUksVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRW5ELE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUVoQyxTQUFTLFNBQVMsQ0FBQyxJQUFJLDRCQUE2QjtBQUNsRCxTQUFPLElBQUksS0FBSyxFQUFFLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxNQUFNLENBQUM7Q0FDekU7O0FBRUQsSUFBSSxrQkFBa0IsR0FBRyxxREFBcUQsQ0FBQztBQUMvRSxPQUFPLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUMiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLWd1bHAvc3BlYy9maXh0dXJlL25vZGVfbW9kdWxlc19iYWJlbC9iYWJ5bG9uL2xpYi91dGlsL3doaXRlc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG4vLyBNYXRjaGVzIGEgd2hvbGUgbGluZSBicmVhayAod2hlcmUgQ1JMRiBpcyBjb25zaWRlcmVkIGEgc2luZ2xlXG4vLyBsaW5lIGJyZWFrKS4gVXNlZCB0byBjb3VudCBsaW5lcy5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmlzTmV3TGluZSA9IGlzTmV3TGluZTtcbnZhciBsaW5lQnJlYWsgPSAvXFxyXFxuP3xcXG58XFx1MjAyOHxcXHUyMDI5LztcbmV4cG9ydHMubGluZUJyZWFrID0gbGluZUJyZWFrO1xudmFyIGxpbmVCcmVha0cgPSBuZXcgUmVnRXhwKGxpbmVCcmVhay5zb3VyY2UsIFwiZ1wiKTtcblxuZXhwb3J0cy5saW5lQnJlYWtHID0gbGluZUJyZWFrRztcblxuZnVuY3Rpb24gaXNOZXdMaW5lKGNvZGUgLyo6IG51bWJlciovKSAvKjogYm9vbGVhbiovIHtcbiAgcmV0dXJuIGNvZGUgPT09IDEwIHx8IGNvZGUgPT09IDEzIHx8IGNvZGUgPT09IDB4MjAyOCB8fCBjb2RlID09PSAweDIwMjk7XG59XG5cbnZhciBub25BU0NJSXdoaXRlc3BhY2UgPSAvW1xcdTE2ODBcXHUxODBlXFx1MjAwMC1cXHUyMDBhXFx1MjAyZlxcdTIwNWZcXHUzMDAwXFx1ZmVmZl0vO1xuZXhwb3J0cy5ub25BU0NJSXdoaXRlc3BhY2UgPSBub25BU0NJSXdoaXRlc3BhY2U7Il19
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babylon/lib/util/whitespace.js
