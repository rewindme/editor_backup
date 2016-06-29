

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

exports.__esModule = true;

var _lodashLangCloneDeep = require("lodash/lang/cloneDeep");

var _lodashLangCloneDeep2 = _interopRequireDefault(_lodashLangCloneDeep);

var _sourceMapSupport = require("source-map-support");

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _cache = require("./cache");

var registerCache = _interopRequireWildcard(_cache);

var _lodashObjectExtend = require("lodash/object/extend");

var _lodashObjectExtend2 = _interopRequireDefault(_lodashObjectExtend);

var _babelCore = require("babel-core");

var babel = _interopRequireWildcard(_babelCore);

var _lodashCollectionEach = require("lodash/collection/each");

var _lodashCollectionEach2 = _interopRequireDefault(_lodashCollectionEach);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

_sourceMapSupport2["default"].install({
  handleUncaughtExceptions: false,
  retrieveSourceMap: function retrieveSourceMap(source) {
    var map = maps && maps[source];
    if (map) {
      return {
        url: null,
        map: map
      };
    } else {
      return null;
    }
  }
});

registerCache.load();
var cache = registerCache.get();

var transformOpts = {};

var ignore = undefined;
var only = undefined;

var oldHandlers = {};
var maps = {};

var cwd = process.cwd();

function getRelativePath(filename) {
  return _path2["default"].relative(cwd, filename);
}

function mtime(filename) {
  return +_fs2["default"].statSync(filename).mtime;
}

function compile(filename) {
  var result = undefined;

  var optsManager = new _babelCore.OptionManager();

  // merge in base options and resolve all the plugins and presets relative to this file
  optsManager.mergeOptions(_lodashLangCloneDeep2["default"](transformOpts), "base", null, _path2["default"].dirname(filename));

  var opts = optsManager.init({ filename: filename });

  var cacheKey = JSON.stringify(opts) + ":" + babel.version;

  var env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env) cacheKey += ":" + env;

  if (cache) {
    var cached = cache[cacheKey];
    if (cached && cached.mtime === mtime(filename)) {
      result = cached;
    }
  }

  if (!result) {
    result = babel.transformFileSync(filename, _lodashObjectExtend2["default"](opts, {
      sourceMap: "both",
      ast: false
    }));
  }

  if (cache) {
    cache[cacheKey] = result;
    result.mtime = mtime(filename);
  }

  maps[filename] = result.map;

  return result.code;
}

function shouldIgnore(filename) {
  if (!ignore && !only) {
    return getRelativePath(filename).split(_path2["default"].sep).indexOf("node_modules") >= 0;
  } else {
    return _babelCore.util.shouldIgnore(filename, ignore || [], only);
  }
}

function loader(m, filename) {
  m._compile(compile(filename), filename);
}

function registerExtension(ext) {
  var old = oldHandlers[ext] || oldHandlers[".js"] || require.extensions[".js"];

  require.extensions[ext] = function (m, filename) {
    if (shouldIgnore(filename)) {
      old(m, filename);
    } else {
      loader(m, filename, old);
    }
  };
}

function hookExtensions(_exts) {
  _lodashCollectionEach2["default"](oldHandlers, function (old, ext) {
    if (old === undefined) {
      delete require.extensions[ext];
    } else {
      require.extensions[ext] = old;
    }
  });

  oldHandlers = {};

  _lodashCollectionEach2["default"](_exts, function (ext) {
    oldHandlers[ext] = require.extensions[ext];
    registerExtension(ext);
  });
}

hookExtensions(_babelCore.util.canCompile.EXTENSIONS);

exports["default"] = function () {
  var opts /*:: ?: Object*/ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (opts.only != null) only = _babelCore.util.arrayify(opts.only, _babelCore.util.regexify);
  if (opts.ignore != null) ignore = _babelCore.util.arrayify(opts.ignore, _babelCore.util.regexify);

  if (opts.extensions) hookExtensions(_babelCore.util.arrayify(opts.extensions));

  if (opts.cache === false) cache = null;

  delete opts.extensions;
  delete opts.ignore;
  delete opts.cache;
  delete opts.only;

  _lodashObjectExtend2["default"](transformOpts, opts);
};

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtcmVnaXN0ZXIvbGliL25vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFakcsSUFBSSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbkcsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRTFCLElBQUksb0JBQW9CLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRTVELElBQUkscUJBQXFCLEdBQUcsc0JBQXNCLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7QUFFekUsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7QUFFdEQsSUFBSSxrQkFBa0IsR0FBRyxzQkFBc0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUVuRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWhDLElBQUksYUFBYSxHQUFHLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVwRCxJQUFJLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUUxRCxJQUFJLG9CQUFvQixHQUFHLHNCQUFzQixDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRXZFLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFdkMsSUFBSSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRWhELElBQUkscUJBQXFCLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBRTlELElBQUks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QyxDQUFDLENBQUM7O0FBRXBHLE1BQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1RixNQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWxHLE1BQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7O0FBRS9FLE1BQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFdkMsU0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3ZCLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNuQixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDbEIsU0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUVqQixzQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDdEQsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQtZ3VscC9zcGVjL2ZpeHR1cmUvbm9kZV9tb2R1bGVzX2JhYmVsL2JhYmVsLXJlZ2lzdGVyL2xpYi9ub2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbnRlcm9wLXJlcXVpcmUtZGVmYXVsdFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW50ZXJvcC1yZXF1aXJlLXdpbGRjYXJkXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9sb2Rhc2hMYW5nQ2xvbmVEZWVwID0gcmVxdWlyZShcImxvZGFzaC9sYW5nL2Nsb25lRGVlcFwiKTtcblxudmFyIF9sb2Rhc2hMYW5nQ2xvbmVEZWVwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaExhbmdDbG9uZURlZXApO1xuXG52YXIgX3NvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0XCIpO1xuXG52YXIgX3NvdXJjZU1hcFN1cHBvcnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc291cmNlTWFwU3VwcG9ydCk7XG5cbnZhciBfY2FjaGUgPSByZXF1aXJlKFwiLi9jYWNoZVwiKTtcblxudmFyIHJlZ2lzdGVyQ2FjaGUgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfY2FjaGUpO1xuXG52YXIgX2xvZGFzaE9iamVjdEV4dGVuZCA9IHJlcXVpcmUoXCJsb2Rhc2gvb2JqZWN0L2V4dGVuZFwiKTtcblxudmFyIF9sb2Rhc2hPYmplY3RFeHRlbmQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoT2JqZWN0RXh0ZW5kKTtcblxudmFyIF9iYWJlbENvcmUgPSByZXF1aXJlKFwiYmFiZWwtY29yZVwiKTtcblxudmFyIGJhYmVsID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2JhYmVsQ29yZSk7XG5cbnZhciBfbG9kYXNoQ29sbGVjdGlvbkVhY2ggPSByZXF1aXJlKFwibG9kYXNoL2NvbGxlY3Rpb24vZWFjaFwiKTtcblxudmFyIF9sb2Rhc2hDb2xsZWN0aW9uRWFjaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2hDb2xsZWN0aW9uRWFjaCk7XG5cbnZhciBfZnMgPSByZXF1aXJlKFwiZnNcIik7XG5cbnZhciBfZnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnMpO1xuXG52YXIgX3BhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcblxudmFyIF9wYXRoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BhdGgpO1xuXG5fc291cmNlTWFwU3VwcG9ydDJbXCJkZWZhdWx0XCJdLmluc3RhbGwoe1xuICBoYW5kbGVVbmNhdWdodEV4Y2VwdGlvbnM6IGZhbHNlLFxuICByZXRyaWV2ZVNvdXJjZU1hcDogZnVuY3Rpb24gcmV0cmlldmVTb3VyY2VNYXAoc291cmNlKSB7XG4gICAgdmFyIG1hcCA9IG1hcHMgJiYgbWFwc1tzb3VyY2VdO1xuICAgIGlmIChtYXApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgbWFwOiBtYXBcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufSk7XG5cbnJlZ2lzdGVyQ2FjaGUubG9hZCgpO1xudmFyIGNhY2hlID0gcmVnaXN0ZXJDYWNoZS5nZXQoKTtcblxudmFyIHRyYW5zZm9ybU9wdHMgPSB7fTtcblxudmFyIGlnbm9yZSA9IHVuZGVmaW5lZDtcbnZhciBvbmx5ID0gdW5kZWZpbmVkO1xuXG52YXIgb2xkSGFuZGxlcnMgPSB7fTtcbnZhciBtYXBzID0ge307XG5cbnZhciBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG5mdW5jdGlvbiBnZXRSZWxhdGl2ZVBhdGgoZmlsZW5hbWUpIHtcbiAgcmV0dXJuIF9wYXRoMltcImRlZmF1bHRcIl0ucmVsYXRpdmUoY3dkLCBmaWxlbmFtZSk7XG59XG5cbmZ1bmN0aW9uIG10aW1lKGZpbGVuYW1lKSB7XG4gIHJldHVybiArX2ZzMltcImRlZmF1bHRcIl0uc3RhdFN5bmMoZmlsZW5hbWUpLm10aW1lO1xufVxuXG5mdW5jdGlvbiBjb21waWxlKGZpbGVuYW1lKSB7XG4gIHZhciByZXN1bHQgPSB1bmRlZmluZWQ7XG5cbiAgdmFyIG9wdHNNYW5hZ2VyID0gbmV3IF9iYWJlbENvcmUuT3B0aW9uTWFuYWdlcigpO1xuXG4gIC8vIG1lcmdlIGluIGJhc2Ugb3B0aW9ucyBhbmQgcmVzb2x2ZSBhbGwgdGhlIHBsdWdpbnMgYW5kIHByZXNldHMgcmVsYXRpdmUgdG8gdGhpcyBmaWxlXG4gIG9wdHNNYW5hZ2VyLm1lcmdlT3B0aW9ucyhfbG9kYXNoTGFuZ0Nsb25lRGVlcDJbXCJkZWZhdWx0XCJdKHRyYW5zZm9ybU9wdHMpLCBcImJhc2VcIiwgbnVsbCwgX3BhdGgyW1wiZGVmYXVsdFwiXS5kaXJuYW1lKGZpbGVuYW1lKSk7XG5cbiAgdmFyIG9wdHMgPSBvcHRzTWFuYWdlci5pbml0KHsgZmlsZW5hbWU6IGZpbGVuYW1lIH0pO1xuXG4gIHZhciBjYWNoZUtleSA9IEpTT04uc3RyaW5naWZ5KG9wdHMpICsgXCI6XCIgKyBiYWJlbC52ZXJzaW9uO1xuXG4gIHZhciBlbnYgPSBwcm9jZXNzLmVudi5CQUJFTF9FTlYgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlY7XG4gIGlmIChlbnYpIGNhY2hlS2V5ICs9IFwiOlwiICsgZW52O1xuXG4gIGlmIChjYWNoZSkge1xuICAgIHZhciBjYWNoZWQgPSBjYWNoZVtjYWNoZUtleV07XG4gICAgaWYgKGNhY2hlZCAmJiBjYWNoZWQubXRpbWUgPT09IG10aW1lKGZpbGVuYW1lKSkge1xuICAgICAgcmVzdWx0ID0gY2FjaGVkO1xuICAgIH1cbiAgfVxuXG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmVzdWx0ID0gYmFiZWwudHJhbnNmb3JtRmlsZVN5bmMoZmlsZW5hbWUsIF9sb2Rhc2hPYmplY3RFeHRlbmQyW1wiZGVmYXVsdFwiXShvcHRzLCB7XG4gICAgICBzb3VyY2VNYXA6IFwiYm90aFwiLFxuICAgICAgYXN0OiBmYWxzZVxuICAgIH0pKTtcbiAgfVxuXG4gIGlmIChjYWNoZSkge1xuICAgIGNhY2hlW2NhY2hlS2V5XSA9IHJlc3VsdDtcbiAgICByZXN1bHQubXRpbWUgPSBtdGltZShmaWxlbmFtZSk7XG4gIH1cblxuICBtYXBzW2ZpbGVuYW1lXSA9IHJlc3VsdC5tYXA7XG5cbiAgcmV0dXJuIHJlc3VsdC5jb2RlO1xufVxuXG5mdW5jdGlvbiBzaG91bGRJZ25vcmUoZmlsZW5hbWUpIHtcbiAgaWYgKCFpZ25vcmUgJiYgIW9ubHkpIHtcbiAgICByZXR1cm4gZ2V0UmVsYXRpdmVQYXRoKGZpbGVuYW1lKS5zcGxpdChfcGF0aDJbXCJkZWZhdWx0XCJdLnNlcCkuaW5kZXhPZihcIm5vZGVfbW9kdWxlc1wiKSA+PSAwO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfYmFiZWxDb3JlLnV0aWwuc2hvdWxkSWdub3JlKGZpbGVuYW1lLCBpZ25vcmUgfHwgW10sIG9ubHkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvYWRlcihtLCBmaWxlbmFtZSkge1xuICBtLl9jb21waWxlKGNvbXBpbGUoZmlsZW5hbWUpLCBmaWxlbmFtZSk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZW5zaW9uKGV4dCkge1xuICB2YXIgb2xkID0gb2xkSGFuZGxlcnNbZXh0XSB8fCBvbGRIYW5kbGVyc1tcIi5qc1wiXSB8fCByZXF1aXJlLmV4dGVuc2lvbnNbXCIuanNcIl07XG5cbiAgcmVxdWlyZS5leHRlbnNpb25zW2V4dF0gPSBmdW5jdGlvbiAobSwgZmlsZW5hbWUpIHtcbiAgICBpZiAoc2hvdWxkSWdub3JlKGZpbGVuYW1lKSkge1xuICAgICAgb2xkKG0sIGZpbGVuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9hZGVyKG0sIGZpbGVuYW1lLCBvbGQpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaG9va0V4dGVuc2lvbnMoX2V4dHMpIHtcbiAgX2xvZGFzaENvbGxlY3Rpb25FYWNoMltcImRlZmF1bHRcIl0ob2xkSGFuZGxlcnMsIGZ1bmN0aW9uIChvbGQsIGV4dCkge1xuICAgIGlmIChvbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVsZXRlIHJlcXVpcmUuZXh0ZW5zaW9uc1tleHRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1aXJlLmV4dGVuc2lvbnNbZXh0XSA9IG9sZDtcbiAgICB9XG4gIH0pO1xuXG4gIG9sZEhhbmRsZXJzID0ge307XG5cbiAgX2xvZGFzaENvbGxlY3Rpb25FYWNoMltcImRlZmF1bHRcIl0oX2V4dHMsIGZ1bmN0aW9uIChleHQpIHtcbiAgICBvbGRIYW5kbGVyc1tleHRdID0gcmVxdWlyZS5leHRlbnNpb25zW2V4dF07XG4gICAgcmVnaXN0ZXJFeHRlbnNpb24oZXh0KTtcbiAgfSk7XG59XG5cbmhvb2tFeHRlbnNpb25zKF9iYWJlbENvcmUudXRpbC5jYW5Db21waWxlLkVYVEVOU0lPTlMpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG9wdHMgLyo6OiA/OiBPYmplY3QqLyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG4gIGlmIChvcHRzLm9ubHkgIT0gbnVsbCkgb25seSA9IF9iYWJlbENvcmUudXRpbC5hcnJheWlmeShvcHRzLm9ubHksIF9iYWJlbENvcmUudXRpbC5yZWdleGlmeSk7XG4gIGlmIChvcHRzLmlnbm9yZSAhPSBudWxsKSBpZ25vcmUgPSBfYmFiZWxDb3JlLnV0aWwuYXJyYXlpZnkob3B0cy5pZ25vcmUsIF9iYWJlbENvcmUudXRpbC5yZWdleGlmeSk7XG5cbiAgaWYgKG9wdHMuZXh0ZW5zaW9ucykgaG9va0V4dGVuc2lvbnMoX2JhYmVsQ29yZS51dGlsLmFycmF5aWZ5KG9wdHMuZXh0ZW5zaW9ucykpO1xuXG4gIGlmIChvcHRzLmNhY2hlID09PSBmYWxzZSkgY2FjaGUgPSBudWxsO1xuXG4gIGRlbGV0ZSBvcHRzLmV4dGVuc2lvbnM7XG4gIGRlbGV0ZSBvcHRzLmlnbm9yZTtcbiAgZGVsZXRlIG9wdHMuY2FjaGU7XG4gIGRlbGV0ZSBvcHRzLm9ubHk7XG5cbiAgX2xvZGFzaE9iamVjdEV4dGVuZDJbXCJkZWZhdWx0XCJdKHRyYW5zZm9ybU9wdHMsIG9wdHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiXX0=
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babel-register/lib/node.js