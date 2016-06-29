Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var uniquifySettings = function uniquifySettings(settings) {
  var genName = function genName(name, index) {
    return name + ' - ' + index;
  };
  var newSettings = [];
  settings.forEach(function (setting) {
    var i = 0;
    var testName = setting.name;
    while (newSettings.find(function (ns) {
      return ns.name === testName;
    })) {
      // eslint-disable-line no-loop-func
      testName = genName(setting.name, ++i);
    }
    newSettings.push(_extends({}, setting, { name: testName }));
  });
  return newSettings;
};

var activePath = function activePath() {
  var textEditor = atom.workspace.getActiveTextEditor();
  if (!textEditor || !textEditor.getPath()) {
    /* default to building the first one if no editor is active */
    if (0 === atom.project.getPaths().length) {
      return false;
    }

    return atom.project.getPaths()[0];
  }

  /* otherwise, build the one in the root of the active editor */
  return atom.project.getPaths().sort(function (a, b) {
    return b.length - a.length;
  }).find(function (p) {
    try {
      var realpath = _fs2['default'].realpathSync(p);
      return textEditor.getPath().substr(0, realpath.length) === realpath;
    } catch (err) {
      /* Path no longer available. Possible network volume has gone down */
      return false;
    }
  });
};

var getDefaultSettings = function getDefaultSettings(cwd, setting) {
  return Object.assign({}, setting, {
    env: setting.env || {},
    args: setting.args || [],
    cwd: setting.cwd || cwd,
    sh: undefined === setting.sh ? true : setting.sh,
    errorMatch: setting.errorMatch || ''
  });
};

var replace = function replace(value, targetEnv) {
  if (value === undefined) value = '';

  var env = Object.assign({}, process.env, targetEnv);
  value = value.replace(/\$(\w+)/g, function (match, name) {
    return name in env ? env[name] : match;
  });

  var editor = atom.workspace.getActiveTextEditor();

  var projectPaths = atom.project.getPaths().map(function (projectPath) {
    try {
      return _fs2['default'].realpathSync(projectPath);
    } catch (e) {/* Do nothing. */}
    return null;
  });

  var projectPath = projectPaths[0];
  if (editor && undefined !== editor.getPath()) {
    (function () {
      var activeFile = _fs2['default'].realpathSync(editor.getPath());
      var activeFilePath = _path2['default'].dirname(activeFile);
      projectPath = projectPaths.find(function (p) {
        return activeFilePath && activeFilePath.startsWith(p);
      });
      value = value.replace(/{FILE_ACTIVE}/g, activeFile);
      value = value.replace(/{FILE_ACTIVE_PATH}/g, activeFilePath);
      value = value.replace(/{FILE_ACTIVE_NAME}/g, _path2['default'].basename(activeFile));
      value = value.replace(/{FILE_ACTIVE_NAME_BASE}/g, _path2['default'].basename(activeFile, _path2['default'].extname(activeFile)));
    })();
  }
  value = value.replace(/{PROJECT_PATH}/g, projectPath);
  if (atom.project.getRepositories[0]) {
    value = value.replace(/{REPO_BRANCH_SHORT}/g, atom.project.getRepositories()[0].getShortHead());
  }

  return value;
};

exports.uniquifySettings = uniquifySettings;
exports.activePath = activePath;
exports.getDefaultSettings = getDefaultSettings;
exports.replace = replace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBSHZCLFdBQVcsQ0FBQzs7QUFLWixJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixDQUFJLFFBQVEsRUFBSztBQUNyQyxNQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxJQUFJLEVBQUUsS0FBSztXQUFRLElBQUksV0FBTSxLQUFLO0dBQUUsQ0FBQztBQUN0RCxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdkIsVUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUMxQixRQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixRQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQzVCLFdBQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUU7YUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLFFBQVE7S0FBQSxDQUFDLEVBQUU7O0FBQ25ELGNBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0FBQ0QsZUFBVyxDQUFDLElBQUksY0FBTSxPQUFPLElBQUUsSUFBSSxFQUFFLFFBQVEsSUFBRyxDQUFDO0dBQ2xELENBQUMsQ0FBQztBQUNILFNBQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUM7O0FBRUYsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLEdBQVM7QUFDdkIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQ3hELE1BQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUU7O0FBRXhDLFFBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsTUFB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QUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDcEQsV0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDN0QsV0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsa0JBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDeEUsV0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsa0JBQUssUUFBUSxDQUFDLFVBQVUsRUFBRSxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDOztHQUN4RztBQUNELE9BQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3RELE1BQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDbkMsU0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0dBQ2pHOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2QsQ0FBQzs7UUFFTyxnQkFBZ0IsR0FBaEIsZ0JBQWdCO1FBQUUsVUFBVSxHQUFWLFVBQVU7UUFBRSxrQkFBa0IsR0FBbEIsa0JBQWtCO1FBQUUsT0FBTyxHQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHVuaXF1aWZ5U2V0dGluZ3MgPSAoc2V0dGluZ3MpID0+IHtcbiAgY29uc3QgZ2VuTmFtZSA9IChuYW1lLCBpbmRleCkgPT4gYCR7bmFtZX0gLSAke2luZGV4fWA7XG4gIGNvbnN0IG5ld1NldHRpbmdzID0gW107XG4gIHNldHRpbmdzLmZvckVhY2goc2V0dGluZyA9PiB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCB0ZXN0TmFtZSA9IHNldHRpbmcubmFtZTtcbiAgICB3aGlsZSAobmV3U2V0dGluZ3MuZmluZChucyA9PiBucy5uYW1lID09PSB0ZXN0TmFtZSkpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb29wLWZ1bmNcbiAgICAgIHRlc3ROYW1lID0gZ2VuTmFtZShzZXR0aW5nLm5hbWUsICsraSk7XG4gICAgfVxuICAgIG5ld1NldHRpbmdzLnB1c2goeyAuLi5zZXR0aW5nLCBuYW1lOiB0ZXN0TmFtZSB9KTtcbiAgfSk7XG4gIHJldHVybiBuZXdTZXR0aW5ncztcbn07XG5cbmNvbnN0IGFjdGl2ZVBhdGggPSAoKSA9PiB7XG4gIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gIGlmICghdGV4dEVkaXRvciB8fCAhdGV4dEVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAvKiBkZWZhdWx0IHRvIGJ1aWxkaW5nIHRoZSBmaXJzdCBvbmUgaWYgbm8gZWRpdG9yIGlzIGFjdGl2ZSAqL1xuICAgIGlmICgwID09PSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF07XG4gIH1cblxuICAvKiBvdGhlcndpc2UsIGJ1aWxkIHRoZSBvbmUgaW4gdGhlIHJvb3Qgb2YgdGhlIGFjdGl2ZSBlZGl0b3IgKi9cbiAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpLnNvcnQoKGEsIGIpID0+IChiLmxlbmd0aCAtIGEubGVuZ3RoKSkuZmluZChwID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVhbHBhdGggPSBmcy5yZWFscGF0aFN5bmMocCk7XG4gICAgICByZXR1cm4gdGV4dEVkaXRvci5nZXRQYXRoKCkuc3Vic3RyKDAsIHJlYWxwYXRoLmxlbmd0aCkgPT09IHJlYWxwYXRoO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLyogUGF0aCBubyBsb25nZXIgYXZhaWxhYmxlLiBQb3NzaWJsZSBuZXR3b3JrIHZvbHVtZSBoYXMgZ29uZSBkb3duICovXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IGdldERlZmF1bHRTZXR0aW5ncyA9IChjd2QsIHNldHRpbmcpID0+IHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHNldHRpbmcsIHtcbiAgICBlbnY6IHNldHRpbmcuZW52IHx8IHt9LFxuICAgIGFyZ3M6IHNldHRpbmcuYXJncyB8fCBbXSxcbiAgICBjd2Q6IHNldHRpbmcuY3dkIHx8IGN3ZCxcbiAgICBzaDogKHVuZGVmaW5lZCA9PT0gc2V0dGluZy5zaCkgPyB0cnVlIDogc2V0dGluZy5zaCxcbiAgICBlcnJvck1hdGNoOiBzZXR0aW5nLmVycm9yTWF0Y2ggfHwgJydcbiAgfSk7XG59O1xuXG5jb25zdCByZXBsYWNlID0gKHZhbHVlID0gJycsIHRhcmdldEVudikgPT4ge1xuICBjb25zdCBlbnYgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9jZXNzLmVudiwgdGFyZ2V0RW52KTtcbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXCQoXFx3KykvZywgZnVuY3Rpb24gKG1hdGNoLCBuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUgaW4gZW52ID8gZW52W25hbWVdIDogbWF0Y2g7XG4gIH0pO1xuXG4gIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICBjb25zdCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5tYXAocHJvamVjdFBhdGggPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnMucmVhbHBhdGhTeW5jKHByb2plY3RQYXRoKTtcbiAgICB9IGNhdGNoIChlKSB7IC8qIERvIG5vdGhpbmcuICovIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgbGV0IHByb2plY3RQYXRoID0gcHJvamVjdFBhdGhzWzBdO1xuICBpZiAoZWRpdG9yICYmICh1bmRlZmluZWQgIT09IGVkaXRvci5nZXRQYXRoKCkpKSB7XG4gICAgY29uc3QgYWN0aXZlRmlsZSA9IGZzLnJlYWxwYXRoU3luYyhlZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICBjb25zdCBhY3RpdmVGaWxlUGF0aCA9IHBhdGguZGlybmFtZShhY3RpdmVGaWxlKTtcbiAgICBwcm9qZWN0UGF0aCA9IHByb2plY3RQYXRocy5maW5kKHAgPT4gYWN0aXZlRmlsZVBhdGggJiYgYWN0aXZlRmlsZVBhdGguc3RhcnRzV2l0aChwKSk7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC97RklMRV9BQ1RJVkV9L2csIGFjdGl2ZUZpbGUpO1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgve0ZJTEVfQUNUSVZFX1BBVEh9L2csIGFjdGl2ZUZpbGVQYXRoKTtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL3tGSUxFX0FDVElWRV9OQU1FfS9nLCBwYXRoLmJhc2VuYW1lKGFjdGl2ZUZpbGUpKTtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL3tGSUxFX0FDVElWRV9OQU1FX0JBU0V9L2csIHBhdGguYmFzZW5hbWUoYWN0aXZlRmlsZSwgcGF0aC5leHRuYW1lKGFjdGl2ZUZpbGUpKSk7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC97UFJPSkVDVF9QQVRIfS9nLCBwcm9qZWN0UGF0aCk7XG4gIGlmIChhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzWzBdKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC97UkVQT19CUkFOQ0hfU0hPUlR9L2csIGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVswXS5nZXRTaG9ydEhlYWQoKSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuXG5leHBvcnQgeyB1bmlxdWlmeVNldHRpbmdzLCBhY3RpdmVQYXRoLCBnZXREZWZhdWx0U2V0dGluZ3MsIHJlcGxhY2UgfTtcbiJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build/lib/utils.js