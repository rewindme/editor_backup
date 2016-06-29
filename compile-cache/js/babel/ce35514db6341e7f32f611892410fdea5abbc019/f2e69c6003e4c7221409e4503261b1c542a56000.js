Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  optsManager.mergeOptions((0, _lodashLangCloneDeep2["default"])(transformOpts), "base", null, _path2["default"].dirname(filename));

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
    result = babel.transformFileSync(filename, (0, _lodashObjectExtend2["default"])(opts, {
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
  (0, _lodashCollectionEach2["default"])(oldHandlers, function (old, ext) {
    if (old === undefined) {
      delete require.extensions[ext];
    } else {
      require.extensions[ext] = old;
    }
  });

  oldHandlers = {};

  (0, _lodashCollectionEach2["default"])(_exts, function (ext) {
    oldHandlers[ext] = require.extensions[ext];
    registerExtension(ext);
  });
}

hookExtensions(_babelCore.util.canCompile.EXTENSIONS);

exports["default"] = function () {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (opts.only != null) only = _babelCore.util.arrayify(opts.only, _babelCore.util.regexify);
  if (opts.ignore != null) ignore = _babelCore.util.arrayify(opts.ignore, _babelCore.util.regexify);

  if (opts.extensions) hookExtensions(_babelCore.util.arrayify(opts.extensions));

  if (opts.cache === false) cache = null;

  delete opts.extensions;
  delete opts.ignore;
  delete opts.cache;
  delete opts.only;

  (0, _lodashObjectExtend2["default"])(transformOpts, opts);
};

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtcmVnaXN0ZXIvc3JjL25vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7bUNBRXNCLHVCQUF1Qjs7OztnQ0FDaEIsb0JBQW9COzs7O3FCQUNsQixTQUFTOztJQUE1QixhQUFhOztrQ0FDTixzQkFBc0I7Ozs7eUJBQ2xCLFlBQVk7O0lBQXZCLEtBQUs7O29DQUNBLHdCQUF3Qjs7OztrQkFFMUIsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBRXZCLDhCQUFpQixPQUFPLENBQUM7QUFDdkIsMEJBQXdCLEVBQUUsS0FBSztBQUMvQixtQkFBaUIsRUFBQSwyQkFBQyxNQUFNLEVBQUU7QUFDeEIsUUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixRQUFJLEdBQUcsRUFBRTtBQUNQLGFBQU87QUFDTCxXQUFHLEVBQUUsSUFBSTtBQUNULFdBQUcsRUFBRSxHQUFHO09BQ1QsQ0FBQztLQUNILE1BQU07QUFDTCxhQUFPLElBQUksQ0FBQztLQUNiO0dBQ0Y7Q0FDRixDQUFDLENBQUM7O0FBRUgsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JCLElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFaEMsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDOztBQUV2QixJQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsSUFBSSxJQUFJLFlBQUEsQ0FBQzs7QUFFVCxJQUFJLFdBQVcsR0FBSyxFQUFFLENBQUM7QUFDdkIsSUFBSSxJQUFJLEdBQVksRUFBRSxDQUFDOztBQUV2QixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXhCLFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBQztBQUNoQyxTQUFPLGtCQUFLLFFBQVEsQ0FB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RXBFLE1BQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFdkMsU0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3ZCLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNuQixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDbEIsU0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUVqQix1Q0FBTyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDN0IiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLWd1bHAvc3BlYy9maXh0dXJlL25vZGVfbW9kdWxlc19iYWJlbC9iYWJlbC1yZWdpc3Rlci9zcmMvbm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSBcImxvZGFzaC9sYW5nL2Nsb25lRGVlcFwiO1xuaW1wb3J0IHNvdXJjZU1hcFN1cHBvcnQgZnJvbSBcInNvdXJjZS1tYXAtc3VwcG9ydFwiO1xuaW1wb3J0ICogYXMgcmVnaXN0ZXJDYWNoZSBmcm9tIFwiLi9jYWNoZVwiO1xuaW1wb3J0IGV4dGVuZCBmcm9tIFwibG9kYXNoL29iamVjdC9leHRlbmRcIjtcbmltcG9ydCAqIGFzIGJhYmVsIGZyb20gXCJiYWJlbC1jb3JlXCI7XG5pbXBvcnQgZWFjaCBmcm9tIFwibG9kYXNoL2NvbGxlY3Rpb24vZWFjaFwiO1xuaW1wb3J0IHsgdXRpbCwgT3B0aW9uTWFuYWdlciB9IGZyb20gXCJiYWJlbC1jb3JlXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5zb3VyY2VNYXBTdXBwb3J0Lmluc3RhbGwoe1xuICBoYW5kbGVVbmNhdWdodEV4Y2VwdGlvbnM6IGZhbHNlLFxuICByZXRyaWV2ZVNvdXJjZU1hcChzb3VyY2UpIHtcbiAgICBsZXQgbWFwID0gbWFwcyAmJiBtYXBzW3NvdXJjZV07XG4gICAgaWYgKG1hcCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiBudWxsLFxuICAgICAgICBtYXA6IG1hcFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59KTtcblxucmVnaXN0ZXJDYWNoZS5sb2FkKCk7XG5sZXQgY2FjaGUgPSByZWdpc3RlckNhY2hlLmdldCgpO1xuXG5sZXQgdHJhbnNmb3JtT3B0cyA9IHt9O1xuXG5sZXQgaWdub3JlO1xubGV0IG9ubHk7XG5cbmxldCBvbGRIYW5kbGVycyAgID0ge307XG5sZXQgbWFwcyAgICAgICAgICA9IHt9O1xuXG5sZXQgY3dkID0gcHJvY2Vzcy5jd2QoKTtcblxuZnVuY3Rpb24gZ2V0UmVsYXRpdmVQYXRoKGZpbGVuYW1lKXtcbiAgcmV0dXJuIHBhdGgucmVsYXRpdmUoY3dkLCBmaWxlbmFtZSk7XG59XG5cbmZ1bmN0aW9uIG10aW1lKGZpbGVuYW1lKSB7XG4gIHJldHVybiArZnMuc3RhdFN5bmMoZmlsZW5hbWUpLm10aW1lO1xufVxuXG5mdW5jdGlvbiBjb21waWxlKGZpbGVuYW1lKSB7XG4gIGxldCByZXN1bHQ7XG5cbiAgbGV0IG9wdHNNYW5hZ2VyID0gbmV3IE9wdGlvbk1hbmFnZXI7XG5cbiAgLy8gbWVyZ2UgaW4gYmFzZSBvcHRpb25zIGFuZCByZXNvbHZlIGFsbCB0aGUgcGx1Z2lucyBhbmQgcHJlc2V0cyByZWxhdGl2ZSB0byB0aGlzIGZpbGVcbiAgb3B0c01hbmFnZXIubWVyZ2VPcHRpb25zKGRlZXBDbG9uZSh0cmFuc2Zvcm1PcHRzKSwgXCJiYXNlXCIsIG51bGwsIHBhdGguZGlybmFtZShmaWxlbmFtZSkpO1xuXG4gIGxldCBvcHRzID0gb3B0c01hbmFnZXIuaW5pdCh7IGZpbGVuYW1lIH0pO1xuXG4gIGxldCBjYWNoZUtleSA9IGAke0pTT04uc3RyaW5naWZ5KG9wdHMpfToke2JhYmVsLnZlcnNpb259YDtcblxuICBsZXQgZW52ID0gcHJvY2Vzcy5lbnYuQkFCRUxfRU5WIHx8IHByb2Nlc3MuZW52Lk5PREVfRU5WO1xuICBpZiAoZW52KSBjYWNoZUtleSArPSBgOiR7ZW52fWA7XG5cbiAgaWYgKGNhY2hlKSB7XG4gICAgbGV0IGNhY2hlZCA9IGNhY2hlW2NhY2hlS2V5XTtcbiAgICBpZiAoY2FjaGVkICYmIGNhY2hlZC5tdGltZSA9PT0gbXRpbWUoZmlsZW5hbWUpKSB7XG4gICAgICByZXN1bHQgPSBjYWNoZWQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFyZXN1bHQpIHtcbiAgICByZXN1bHQgPSBiYWJlbC50cmFuc2Zvcm1GaWxlU3luYyhmaWxlbmFtZSwgZXh0ZW5kKG9wdHMsIHtcbiAgICAgIHNvdXJjZU1hcDogXCJib3RoXCIsXG4gICAgICBhc3Q6ICAgICAgIGZhbHNlXG4gICAgfSkpO1xuICB9XG5cbiAgaWYgKGNhY2hlKSB7XG4gICAgY2FjaGVbY2FjaGVLZXldID0gcmVzdWx0O1xuICAgIHJlc3VsdC5tdGltZSA9IG10aW1lKGZpbGVuYW1lKTtcbiAgfVxuXG4gIG1hcHNbZmlsZW5hbWVdID0gcmVzdWx0Lm1hcDtcblxuICByZXR1cm4gcmVzdWx0LmNvZGU7XG59XG5cbmZ1bmN0aW9uIHNob3VsZElnbm9yZShmaWxlbmFtZSkge1xuICBpZiAoIWlnbm9yZSAmJiAhb25seSkge1xuICAgIHJldHVybiBnZXRSZWxhdGl2ZVBhdGgoZmlsZW5hbWUpLnNwbGl0KHBhdGguc2VwKS5pbmRleE9mKFwibm9kZV9tb2R1bGVzXCIpID49IDA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHV0aWwuc2hvdWxkSWdub3JlKGZpbGVuYW1lLCBpZ25vcmUgfHwgW10sIG9ubHkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvYWRlcihtLCBmaWxlbmFtZSkge1xuICBtLl9jb21waWxlKGNvbXBpbGUoZmlsZW5hbWUpLCBmaWxlbmFtZSk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRXh0ZW5zaW9uKGV4dCkge1xuICBsZXQgb2xkID0gb2xkSGFuZGxlcnNbZXh0XSB8fCBvbGRIYW5kbGVyc1tcIi5qc1wiXSB8fCByZXF1aXJlLmV4dGVuc2lvbnNbXCIuanNcIl07XG5cbiAgcmVxdWlyZS5leHRlbnNpb25zW2V4dF0gPSBmdW5jdGlvbiAobSwgZmlsZW5hbWUpIHtcbiAgICBpZiAoc2hvdWxkSWdub3JlKGZpbGVuYW1lKSkge1xuICAgICAgb2xkKG0sIGZpbGVuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9hZGVyKG0sIGZpbGVuYW1lLCBvbGQpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaG9va0V4dGVuc2lvbnMoX2V4dHMpIHtcbiAgZWFjaChvbGRIYW5kbGVycywgZnVuY3Rpb24gKG9sZCwgZXh0KSB7XG4gICAgaWYgKG9sZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWxldGUgcmVxdWlyZS5leHRlbnNpb25zW2V4dF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVpcmUuZXh0ZW5zaW9uc1tleHRdID0gb2xkO1xuICAgIH1cbiAgfSk7XG5cbiAgb2xkSGFuZGxlcnMgPSB7fTtcblxuICBlYWNoKF9leHRzLCBmdW5jdGlvbiAoZXh0KSB7XG4gICAgb2xkSGFuZGxlcnNbZXh0XSA9IHJlcXVpcmUuZXh0ZW5zaW9uc1tleHRdO1xuICAgIHJlZ2lzdGVyRXh0ZW5zaW9uKGV4dCk7XG4gIH0pO1xufVxuXG5ob29rRXh0ZW5zaW9ucyh1dGlsLmNhbkNvbXBpbGUuRVhURU5TSU9OUyk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRzPzogT2JqZWN0ID0ge30pIHtcbiAgaWYgKG9wdHMub25seSAhPSBudWxsKSBvbmx5ID0gdXRpbC5hcnJheWlmeShvcHRzLm9ubHksIHV0aWwucmVnZXhpZnkpO1xuICBpZiAob3B0cy5pZ25vcmUgIT0gbnVsbCkgaWdub3JlID0gdXRpbC5hcnJheWlmeShvcHRzLmlnbm9yZSwgdXRpbC5yZWdleGlmeSk7XG5cbiAgaWYgKG9wdHMuZXh0ZW5zaW9ucykgaG9va0V4dGVuc2lvbnModXRpbC5hcnJheWlmeShvcHRzLmV4dGVuc2lvbnMpKTtcblxuICBpZiAob3B0cy5jYWNoZSA9PT0gZmFsc2UpIGNhY2hlID0gbnVsbDtcblxuICBkZWxldGUgb3B0cy5leHRlbnNpb25zO1xuICBkZWxldGUgb3B0cy5pZ25vcmU7XG4gIGRlbGV0ZSBvcHRzLmNhY2hlO1xuICBkZWxldGUgb3B0cy5vbmx5O1xuXG4gIGV4dGVuZCh0cmFuc2Zvcm1PcHRzLCBvcHRzKTtcbn1cbiJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babel-register/src/node.js
