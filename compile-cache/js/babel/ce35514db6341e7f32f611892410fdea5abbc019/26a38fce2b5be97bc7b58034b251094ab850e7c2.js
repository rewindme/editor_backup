function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _atomBuildSpecHelpers = require('atom-build-spec-helpers');

var _atomBuildSpecHelpers2 = _interopRequireDefault(_atomBuildSpecHelpers);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

'use babel';

describe('Target', function () {
  var originalHomedirFn = _os2['default'].homedir;
  var directory = null;
  var workspaceElement = null;

  _temp2['default'].track();

  beforeEach(function () {
    atom.config.set('build.buildOnSave', false);
    atom.config.set('build.panelVisibility', 'Toggle');
    atom.config.set('build.saveOnBuild', false);
    atom.config.set('build.notificationOnRefresh', true);

    jasmine.unspy(window, 'setTimeout');
    jasmine.unspy(window, 'clearTimeout');

    workspaceElement = atom.views.getView(atom.workspace);
    workspaceElement.setAttribute('style', 'width:9999px');
    jasmine.attachToDOM(workspaceElement);

    waitsForPromise(function () {
      return _atomBuildSpecHelpers2['default'].vouch(_temp2['default'].mkdir, { prefix: 'atom-build-spec-' }).then(function (dir) {
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].realpath, dir);
      }).then(function (dir) {
        directory = dir + '/';
        atom.project.setPaths([directory]);
        return _atomBuildSpecHelpers2['default'].vouch(_temp2['default'].mkdir, 'atom-build-spec-home');
      }).then(function (dir) {
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].realpath, dir);
      }).then(function (dir) {
        _os2['default'].homedir = function () {
          return dir;
        };
        return atom.packages.activatePackage('build');
      });
    });
  });

  afterEach(function () {
    _os2['default'].homedir = originalHomedirFn;
    _fsExtra2['default'].removeSync(directory);
  });

  describe('when multiple targets exists', function () {
    it('should list those targets in a SelectListView (from .atom-build.json)', function () {
      waitsForPromise(function () {
        var file = __dirname + '/fixture/.atom-build.targets.json';
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].copy, file, directory + '/.atom-build.json').then(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });
      });

      waitsForPromise(function () {
        return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:select-active-target');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.select-list li.build-target');
      });

      runs(function () {
        var targets = [].concat(_toConsumableArray(workspaceElement.querySelectorAll('.select-list li.build-target'))).map(function (el) {
          return el.textContent;
        });
        expect(targets).toEqual(['Custom: The default build', 'Custom: Some customized build']);
      });
    });

    it('should mark the first target as active', function () {
      waitsForPromise(function () {
        var file = __dirname + '/fixture/.atom-build.targets.json';
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].copy, file, directory + '/.atom-build.json').then(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:select-active-target');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.select-list li.build-target');
      });

      runs(function () {
        var el = workspaceElement.querySelector('.select-list li.build-target'); // querySelector selects the first element
        expect(el).toHaveClass('selected');
        expect(el).toHaveClass('active');
      });
    });

    it('should run the selected build', function () {
      waitsForPromise(function () {
        var file = __dirname + '/fixture/.atom-build.targets.json';
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].copy, file, directory + '/.atom-build.json').then(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:select-active-target');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.select-list li.build-target');
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement.querySelector('.select-list'), 'core:confirm');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.terminal').terminal.getContent()).toMatch(/default/);
      });
    });

    it('should run the default target if no selection has been made', function () {
      waitsForPromise(function () {
        var file = __dirname + '/fixture/.atom-build.targets.json';
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].copy, file, directory + '/.atom-build.json').then(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.terminal').terminal.getContent()).toMatch(/default/);
      });
    });

    it('run the selected target if selection has changed, and subsequent build should run that target', function () {
      waitsForPromise(function () {
        var file = __dirname + '/fixture/.atom-build.targets.json';
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].copy, file, directory + '/.atom-build.json').then(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:select-active-target');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.select-list li.build-target');
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement.querySelector('.select-list'), 'core:move-down');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.select-list li.selected').textContent === 'Custom: Some customized build';
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement.querySelector('.select-list'), 'core:confirm');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.terminal').terminal.getContent()).toMatch(/customized/);
        atom.commands.dispatch(workspaceElement.querySelector('.build'), 'build:stop');
      });

      waitsFor(function () {
        return !workspaceElement.querySelector('.build');
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.terminal').terminal.getContent()).toMatch(/customized/);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL2J1aWxkLXRhcmdldHMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3VCQUVlLFVBQVU7Ozs7b0JBQ1IsTUFBTTs7OztvQ0FDQyx5QkFBeUI7Ozs7a0JBQ2xDLElBQUk7Ozs7QUFMbkIsV0FBVyxDQUFDOztBQU9aLFFBQVEsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUN2QixNQUFNLGlCQUFpQixHQUFHLGdCQUFHLE9BQU8sQ0FBQztBQUNyQyxNQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDckIsTUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7O0FBRTVCLG9CQUFLLEtBQUssRUFBRSxDQUFDOztBQUViLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXJELFdBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFdBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV0QyxvQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsb0JBQWdCLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN2RCxXQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FB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QUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy9idWlsZC10YXJnZXRzLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuaW1wb3J0IHNwZWNIZWxwZXJzIGZyb20gJ2F0b20tYnVpbGQtc3BlYy1oZWxwZXJzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5cbmRlc2NyaWJlKCdUYXJnZXQnLCAoKSA9PiB7XG4gIGNvbnN0IG9yaWdpbmFsSG9tZWRpckZuID0gb3MuaG9tZWRpcjtcbiAgbGV0IGRpcmVjdG9yeSA9IG51bGw7XG4gIGxldCB3b3Jrc3BhY2VFbGVtZW50ID0gbnVsbDtcblxuICB0ZW1wLnRyYWNrKCk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5idWlsZE9uU2F2ZScsIGZhbHNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdUb2dnbGUnKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnNhdmVPbkJ1aWxkJywgZmFsc2UpO1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQubm90aWZpY2F0aW9uT25SZWZyZXNoJywgdHJ1ZSk7XG5cbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ3NldFRpbWVvdXQnKTtcbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ2NsZWFyVGltZW91dCcpO1xuXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gICAgd29ya3NwYWNlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3dpZHRoOjk5OTlweCcpO1xuICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudCk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIHNwZWNIZWxwZXJzLnZvdWNoKHRlbXAubWtkaXIsIHsgcHJlZml4OiAnYXRvbS1idWlsZC1zcGVjLScgfSkudGhlbigoZGlyKSA9PiB7XG4gICAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaChmcy5yZWFscGF0aCwgZGlyKTtcbiAgICAgIH0pLnRoZW4oKGRpcikgPT4ge1xuICAgICAgICBkaXJlY3RvcnkgPSBkaXIgKyAnLyc7XG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbIGRpcmVjdG9yeSBdKTtcbiAgICAgICAgcmV0dXJuIHNwZWNIZWxwZXJzLnZvdWNoKHRlbXAubWtkaXIsICdhdG9tLWJ1aWxkLXNwZWMtaG9tZScpO1xuICAgICAgfSkudGhlbiggKGRpcikgPT4ge1xuICAgICAgICByZXR1cm4gc3BlY0hlbHBlcnMudm91Y2goZnMucmVhbHBhdGgsIGRpcik7XG4gICAgICB9KS50aGVuKCAoZGlyKSA9PiB7XG4gICAgICAgIG9zLmhvbWVkaXIgPSAoKSA9PiBkaXI7XG4gICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYnVpbGQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIG9zLmhvbWVkaXIgPSBvcmlnaW5hbEhvbWVkaXJGbjtcbiAgICBmcy5yZW1vdmVTeW5jKGRpcmVjdG9yeSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIG11bHRpcGxlIHRhcmdldHMgZXhpc3RzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbGlzdCB0aG9zZSB0YXJnZXRzIGluIGEgU2VsZWN0TGlzdFZpZXcgKGZyb20gLmF0b20tYnVpbGQuanNvbiknLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlLy5hdG9tLWJ1aWxkLnRhcmdldHMuanNvbic7XG4gICAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaChmcy5jb3B5LCBmaWxlLCBkaXJlY3RvcnkgKyAnLy5hdG9tLWJ1aWxkLmpzb24nKVxuICAgICAgICAgIC50aGVuKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDpzZWxlY3QtYWN0aXZlLXRhcmdldCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1saXN0IGxpLmJ1aWxkLXRhcmdldCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXRzID0gWyAuLi53b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtbGlzdCBsaS5idWlsZC10YXJnZXQnKSBdLm1hcChlbCA9PiBlbC50ZXh0Q29udGVudCk7XG4gICAgICAgIGV4cGVjdCh0YXJnZXRzKS50b0VxdWFsKFsgJ0N1c3RvbTogVGhlIGRlZmF1bHQgYnVpbGQnLCAnQ3VzdG9tOiBTb21lIGN1c3RvbWl6ZWQgYnVpbGQnIF0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1hcmsgdGhlIGZpcnN0IHRhcmdldCBhcyBhY3RpdmUnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlLy5hdG9tLWJ1aWxkLnRhcmdldHMuanNvbic7XG4gICAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaChmcy5jb3B5LCBmaWxlLCBkaXJlY3RvcnkgKyAnLy5hdG9tLWJ1aWxkLmpzb24nKVxuICAgICAgICAgIC50aGVuKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnNlbGVjdC1hY3RpdmUtdGFyZ2V0Jyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWxpc3QgbGkuYnVpbGQtdGFyZ2V0Jyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWxpc3QgbGkuYnVpbGQtdGFyZ2V0Jyk7IC8vIHF1ZXJ5U2VsZWN0b3Igc2VsZWN0cyB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgICBleHBlY3QoZWwpLnRvSGF2ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBleHBlY3QoZWwpLnRvSGF2ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBydW4gdGhlIHNlbGVjdGVkIGJ1aWxkJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC50YXJnZXRzLmpzb24nO1xuICAgICAgICByZXR1cm4gc3BlY0hlbHBlcnMudm91Y2goZnMuY29weSwgZmlsZSwgZGlyZWN0b3J5ICsgJy8uYXRvbS1idWlsZC5qc29uJylcbiAgICAgICAgICAudGhlbigoKSA9PiBzcGVjSGVscGVycy5yZWZyZXNoQXdhaXRUYXJnZXRzKCkpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDpzZWxlY3QtYWN0aXZlLXRhcmdldCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1saXN0IGxpLmJ1aWxkLXRhcmdldCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1saXN0JyksICdjb3JlOmNvbmZpcm0nKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGVybWluYWwnKS50ZXJtaW5hbC5nZXRDb250ZW50KCkpLnRvTWF0Y2goL2RlZmF1bHQvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBydW4gdGhlIGRlZmF1bHQgdGFyZ2V0IGlmIG5vIHNlbGVjdGlvbiBoYXMgYmVlbiBtYWRlJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC50YXJnZXRzLmpzb24nO1xuICAgICAgICByZXR1cm4gc3BlY0hlbHBlcnMudm91Y2goZnMuY29weSwgZmlsZSwgZGlyZWN0b3J5ICsgJy8uYXRvbS1idWlsZC5qc29uJylcbiAgICAgICAgICAudGhlbigoKSA9PiBzcGVjSGVscGVycy5yZWZyZXNoQXdhaXRUYXJnZXRzKCkpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRlcm1pbmFsJykudGVybWluYWwuZ2V0Q29udGVudCgpKS50b01hdGNoKC9kZWZhdWx0Lyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdydW4gdGhlIHNlbGVjdGVkIHRhcmdldCBpZiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQsIGFuZCBzdWJzZXF1ZW50IGJ1aWxkIHNob3VsZCBydW4gdGhhdCB0YXJnZXQnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlLy5hdG9tLWJ1aWxkLnRhcmdldHMuanNvbic7XG4gICAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaChmcy5jb3B5LCBmaWxlLCBkaXJlY3RvcnkgKyAnLy5hdG9tLWJ1aWxkLmpzb24nKVxuICAgICAgICAgIC50aGVuKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnNlbGVjdC1hY3RpdmUtdGFyZ2V0Jyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWxpc3QgbGkuYnVpbGQtdGFyZ2V0Jyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWxpc3QnKSwgJ2NvcmU6bW92ZS1kb3duJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWxpc3QgbGkuc2VsZWN0ZWQnKS50ZXh0Q29udGVudCA9PT0gJ0N1c3RvbTogU29tZSBjdXN0b21pemVkIGJ1aWxkJztcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtbGlzdCcpLCAnY29yZTpjb25maXJtJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRlcm1pbmFsJykudGVybWluYWwuZ2V0Q29udGVudCgpKS50b01hdGNoKC9jdXN0b21pemVkLyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSwgJ2J1aWxkOnN0b3AnKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiAhd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpICYmXG4gICAgICAgICAgd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXJtaW5hbCcpLnRlcm1pbmFsLmdldENvbnRlbnQoKSkudG9NYXRjaCgvY3VzdG9taXplZC8pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/naver/.atom/packages/build/spec/build-targets-spec.js
