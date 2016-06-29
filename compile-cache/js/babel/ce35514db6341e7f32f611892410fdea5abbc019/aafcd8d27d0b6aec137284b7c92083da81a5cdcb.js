

"use strict";

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

exports.__esModule = true;
exports.normaliseOptions = normaliseOptions;

var _parsers = require("./parsers");

var parsers = _interopRequireWildcard(_parsers);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

exports.config = _config2["default"];

function normaliseOptions() /*: Object*/{
  var options /*: Object*/ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  for (var key in options) {
    var val = options[key];
    if (val == null) continue;

    var opt = _config2["default"][key];
    if (opt && opt.alias) opt = _config2["default"][opt.alias];
    if (!opt) continue;

    var parser = parsers[opt.type];
    if (parser) val = parser(val);

    options[key] = val;
  }

  return options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtY29yZS9saWIvdHJhbnNmb3JtYXRpb24vZmlsZS9vcHRpb25zL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsWUFBWSxDQUFDOztBQUViLElBQUksdUJBQXVCLEdBQUcsT0FBTyxDQUFDLGdEQUFnRCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRW5HLElBQUksc0JBQXNCLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQzs7QUFFNUMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVwQyxJQUFJLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFaEQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVsQyxJQUFJLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFL0MsT0FBTyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXJDLFNBQVMsZ0JBQWdCLGVBQWdCO0FBQ3ZDLE1BQUksT0FBTyxnQkFBZ0IsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVuRyxPQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUN2QixRQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsUUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLFNBQVM7O0FBRTFCLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQyxRQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNELFFBQUksQ0FBQyxHQUFHLEVBQUUsU0FBUzs7QUFFbkIsUUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixRQUFJLE1BQU0sRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUU5QixXQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0dBQ3BCOztBQUVELFNBQU8sT0FBTyxDQUFDO0NBQ2hCIiwiZmlsZSI6Ii9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtY29yZS9saWIvdHJhbnNmb3JtYXRpb24vZmlsZS9vcHRpb25zL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW50ZXJvcC1yZXF1aXJlLXdpbGRjYXJkXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2ludGVyb3AtcmVxdWlyZS1kZWZhdWx0XCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMubm9ybWFsaXNlT3B0aW9ucyA9IG5vcm1hbGlzZU9wdGlvbnM7XG5cbnZhciBfcGFyc2VycyA9IHJlcXVpcmUoXCIuL3BhcnNlcnNcIik7XG5cbnZhciBwYXJzZXJzID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3BhcnNlcnMpO1xuXG52YXIgX2NvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKTtcblxudmFyIF9jb25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29uZmlnKTtcblxuZXhwb3J0cy5jb25maWcgPSBfY29uZmlnMltcImRlZmF1bHRcIl07XG5cbmZ1bmN0aW9uIG5vcm1hbGlzZU9wdGlvbnMoKSAvKjogT2JqZWN0Ki8ge1xuICB2YXIgb3B0aW9ucyAvKjogT2JqZWN0Ki8gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgIHZhciB2YWwgPSBvcHRpb25zW2tleV07XG4gICAgaWYgKHZhbCA9PSBudWxsKSBjb250aW51ZTtcblxuICAgIHZhciBvcHQgPSBfY29uZmlnMltcImRlZmF1bHRcIl1ba2V5XTtcbiAgICBpZiAob3B0ICYmIG9wdC5hbGlhcykgb3B0ID0gX2NvbmZpZzJbXCJkZWZhdWx0XCJdW29wdC5hbGlhc107XG4gICAgaWYgKCFvcHQpIGNvbnRpbnVlO1xuXG4gICAgdmFyIHBhcnNlciA9IHBhcnNlcnNbb3B0LnR5cGVdO1xuICAgIGlmIChwYXJzZXIpIHZhbCA9IHBhcnNlcih2YWwpO1xuXG4gICAgb3B0aW9uc1trZXldID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59Il19
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babel-core/lib/transformation/file/options/index.js
