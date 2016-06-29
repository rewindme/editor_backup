function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _atomBuildSpecHelpers = require('atom-build-spec-helpers');

var _atomBuildSpecHelpers2 = _interopRequireDefault(_atomBuildSpecHelpers);

var _helpers = require('./helpers');

'use babel';

describe('Linter Integration', function () {
  var directory = null;
  var workspaceElement = null;
  var dummyPackage = null;
  var join = require('path').join;

  _temp2['default'].track();

  beforeEach(function () {
    directory = _fsExtra2['default'].realpathSync(_temp2['default'].mkdirSync({ prefix: 'atom-build-spec-' }));
    atom.project.setPaths([directory]);

    atom.config.set('build.buildOnSave', false);
    atom.config.set('build.panelVisibility', 'Toggle');
    atom.config.set('build.saveOnBuild', false);
    atom.config.set('build.scrollOnError', false);
    atom.config.set('build.notificationOnRefresh', true);
    atom.config.set('editor.fontSize', 14);

    jasmine.unspy(window, 'setTimeout');
    jasmine.unspy(window, 'clearTimeout');

    runs(function () {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    waitsForPromise(function () {
      return Promise.resolve().then(function () {
        return atom.packages.activatePackage('build');
      }).then(function () {
        return atom.packages.activatePackage(join(__dirname, 'fixture', 'atom-build-spec-linter'));
      }).then(function () {
        return dummyPackage = atom.packages.getActivePackage('atom-build-spec-linter').mainModule;
      });
    });
  });

  afterEach(function () {
    _fsExtra2['default'].removeSync(directory);
  });

  describe('when error matching and linter is activated', function () {
    it('should push those errors to the linter', function () {
      expect(dummyPackage.hasRegistered()).toEqual(true);
      _fsExtra2['default'].writeFileSync(join(directory, '.atom-build.json'), _fsExtra2['default'].readFileSync(join(__dirname, 'fixture', '.atom-build.error-match-multiple.json')));

      waitsForPromise(function () {
        return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
      });

      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('error');
      });

      runs(function () {
        var linter = dummyPackage.getLinter();
        expect(linter.messages).toEqual([{
          filePath: join(directory, '.atom-build.json'),
          range: [[2, 7], [2, 7]],
          text: 'Error from build',
          type: 'Error'
        }, {
          filePath: join(directory, '.atom-build.json'),
          range: [[1, 4], [1, 4]],
          text: 'Error from build',
          type: 'Error'
        }]);
      });
    });

    it('should parse `message` and include that to linter', function () {
      expect(dummyPackage.hasRegistered()).toEqual(true);
      _fsExtra2['default'].writeFileSync(join(directory, '.atom-build.json'), _fsExtra2['default'].readFileSync(join(__dirname, 'fixture', '.atom-build.error-match.message.json')));

      waitsForPromise(function () {
        return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
      });

      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('error');
      });

      runs(function () {
        var linter = dummyPackage.getLinter();
        expect(linter.messages).toEqual([{
          filePath: join(directory, '.atom-build.json'),
          range: [[2, 7], [2, 7]],
          text: 'very bad things',
          type: 'Error'
        }]);
      });
    });

    it('should clear linter errors when starting a new build', function () {
      expect(dummyPackage.hasRegistered()).toEqual(true);
      _fsExtra2['default'].writeFileSync(join(directory, '.atom-build.json'), _fsExtra2['default'].readFileSync(join(__dirname, 'fixture', '.atom-build.error-match.message.json')));

      waitsForPromise(function () {
        return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
      });

      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('error');
      });

      runs(function () {
        var linter = dummyPackage.getLinter();
        expect(linter.messages).toEqual([{
          filePath: join(directory, '.atom-build.json'),
          range: [[2, 7], [2, 7]],
          text: 'very bad things',
          type: 'Error'
        }]);
        _fsExtra2['default'].writeFileSync(join(directory, '.atom-build.json'), JSON.stringify({
          cmd: '' + (0, _helpers.sleep)(30)
        }));
      });

      waitsForPromise(function () {
        return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
      });

      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && !workspaceElement.querySelector('.build .title').classList.contains('error') && !workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(dummyPackage.getLinter().messages.length).toEqual(0);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL2xpbnRlci1pbnRlcmdyYXRpb24tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzt1QkFFZSxVQUFVOzs7O29CQUNSLE1BQU07Ozs7b0NBQ0MseUJBQXlCOzs7O3VCQUMzQixXQUFXOztBQUxqQyxXQUFXLENBQUM7O0FBT1osUUFBUSxDQUFDLG9CQUFvQixFQUFFLFlBQU07QUFDbkMsTUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLE1BQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLE1BQUksWUFBWSxHQUFHLElBQUksQ0FBQztBQUN4QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDOztBQUVsQyxvQkFBSyxLQUFLLEVBQUUsQ0FBQzs7QUFFYixZQUFVLENBQUMsWUFBTTtBQUNmLGFBQVMsR0FBRyxxQkFBRyxZQUFZLENBQUMsa0JBQUssU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFFBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUUsU0FBUyxDQUFFLENBQUMsQ0FBQzs7QUFFckMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsUUFB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QWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFrQixDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNuRSxhQUFHLE9BQUssb0JBQU0sRUFBRSxDQUFDLEFBQUU7U0FDcEIsQ0FBQyxDQUFDLENBQUM7T0FDTCxDQUFDLENBQUM7O0FBRUgscUJBQWUsQ0FBQztlQUFNLGtDQUFZLG1CQUFtQixFQUFFO09BQUEsQ0FBQyxDQUFDOztBQUV6RCxVQUFJLENBQUM7ZUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXRFLGNBQVEsQ0FBQyxZQUFNO0FBQ2IsZUFBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQ3BELENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQzVFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDbEYsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxZQUFNO0FBQ1QsY0FBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQzdELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy9saW50ZXItaW50ZXJncmF0aW9uLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuaW1wb3J0IHNwZWNIZWxwZXJzIGZyb20gJ2F0b20tYnVpbGQtc3BlYy1oZWxwZXJzJztcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnLi9oZWxwZXJzJztcblxuZGVzY3JpYmUoJ0xpbnRlciBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgbGV0IGRpcmVjdG9yeSA9IG51bGw7XG4gIGxldCB3b3Jrc3BhY2VFbGVtZW50ID0gbnVsbDtcbiAgbGV0IGR1bW15UGFja2FnZSA9IG51bGw7XG4gIGNvbnN0IGpvaW4gPSByZXF1aXJlKCdwYXRoJykuam9pbjtcblxuICB0ZW1wLnRyYWNrKCk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgZGlyZWN0b3J5ID0gZnMucmVhbHBhdGhTeW5jKHRlbXAubWtkaXJTeW5jKHsgcHJlZml4OiAnYXRvbS1idWlsZC1zcGVjLScgfSkpO1xuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbIGRpcmVjdG9yeSBdKTtcblxuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQuYnVpbGRPblNhdmUnLCBmYWxzZSk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5wYW5lbFZpc2liaWxpdHknLCAnVG9nZ2xlJyk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5zYXZlT25CdWlsZCcsIGZhbHNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnNjcm9sbE9uRXJyb3InLCBmYWxzZSk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5ub3RpZmljYXRpb25PblJlZnJlc2gnLCB0cnVlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5mb250U2l6ZScsIDE0KTtcblxuICAgIGphc21pbmUudW5zcHkod2luZG93LCAnc2V0VGltZW91dCcpO1xuICAgIGphc21pbmUudW5zcHkod2luZG93LCAnY2xlYXJUaW1lb3V0Jyk7XG5cbiAgICBydW5zKCgpID0+IHtcbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KTtcbiAgICB9KTtcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgLnRoZW4oKCkgPT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2J1aWxkJykpXG4gICAgICAgIC50aGVuKCgpID0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKGpvaW4oX19kaXJuYW1lLCAnZml4dHVyZScsICdhdG9tLWJ1aWxkLXNwZWMtbGludGVyJykpKVxuICAgICAgICAudGhlbigoKSA9PiAoZHVtbXlQYWNrYWdlID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdhdG9tLWJ1aWxkLXNwZWMtbGludGVyJykubWFpbk1vZHVsZSkpO1xuICAgIH0pO1xuICB9KTtcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGZzLnJlbW92ZVN5bmMoZGlyZWN0b3J5KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gZXJyb3IgbWF0Y2hpbmcgYW5kIGxpbnRlciBpcyBhY3RpdmF0ZWQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwdXNoIHRob3NlIGVycm9ycyB0byB0aGUgbGludGVyJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGR1bW15UGFja2FnZS5oYXNSZWdpc3RlcmVkKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGpvaW4oZGlyZWN0b3J5LCAnLmF0b20tYnVpbGQuanNvbicpLCBmcy5yZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlJywgJy5hdG9tLWJ1aWxkLmVycm9yLW1hdGNoLW11bHRpcGxlLmpzb24nKSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gc3BlY0hlbHBlcnMucmVmcmVzaEF3YWl0VGFyZ2V0cygpKTtcblxuICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJykpO1xuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3InKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgY29uc3QgbGludGVyID0gZHVtbXlQYWNrYWdlLmdldExpbnRlcigpO1xuICAgICAgICBleHBlY3QobGludGVyLm1lc3NhZ2VzKS50b0VxdWFsKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWxlUGF0aDogam9pbihkaXJlY3RvcnksICcuYXRvbS1idWlsZC5qc29uJyksXG4gICAgICAgICAgICByYW5nZTogWyBbMiwgN10sIFsyLCA3XSBdLFxuICAgICAgICAgICAgdGV4dDogJ0Vycm9yIGZyb20gYnVpbGQnLFxuICAgICAgICAgICAgdHlwZTogJ0Vycm9yJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZmlsZVBhdGg6IGpvaW4oZGlyZWN0b3J5LCAnLmF0b20tYnVpbGQuanNvbicpLFxuICAgICAgICAgICAgcmFuZ2U6IFsgWzEsIDRdLCBbMSwgNF0gXSxcbiAgICAgICAgICAgIHRleHQ6ICdFcnJvciBmcm9tIGJ1aWxkJyxcbiAgICAgICAgICAgIHR5cGU6ICdFcnJvcidcbiAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGBtZXNzYWdlYCBhbmQgaW5jbHVkZSB0aGF0IHRvIGxpbnRlcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChkdW1teVBhY2thZ2UuaGFzUmVnaXN0ZXJlZCgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhqb2luKGRpcmVjdG9yeSwgJy5hdG9tLWJ1aWxkLmpzb24nKSwgZnMucmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnZml4dHVyZScsICcuYXRvbS1idWlsZC5lcnJvci1tYXRjaC5tZXNzYWdlLmpzb24nKSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gc3BlY0hlbHBlcnMucmVmcmVzaEF3YWl0VGFyZ2V0cygpKTtcblxuICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJykpO1xuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3InKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgY29uc3QgbGludGVyID0gZHVtbXlQYWNrYWdlLmdldExpbnRlcigpO1xuICAgICAgICBleHBlY3QobGludGVyLm1lc3NhZ2VzKS50b0VxdWFsKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWxlUGF0aDogam9pbihkaXJlY3RvcnksICcuYXRvbS1idWlsZC5qc29uJyksXG4gICAgICAgICAgICByYW5nZTogWyBbMiwgN10sIFsyLCA3XSBdLFxuICAgICAgICAgICAgdGV4dDogJ3ZlcnkgYmFkIHRoaW5ncycsXG4gICAgICAgICAgICB0eXBlOiAnRXJyb3InXG4gICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjbGVhciBsaW50ZXIgZXJyb3JzIHdoZW4gc3RhcnRpbmcgYSBuZXcgYnVpbGQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZHVtbXlQYWNrYWdlLmhhc1JlZ2lzdGVyZWQoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoam9pbihkaXJlY3RvcnksICcuYXRvbS1idWlsZC5qc29uJyksIGZzLnJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmUnLCAnLmF0b20tYnVpbGQuZXJyb3ItbWF0Y2gubWVzc2FnZS5qc29uJykpKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpKTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpbnRlciA9IGR1bW15UGFja2FnZS5nZXRMaW50ZXIoKTtcbiAgICAgICAgZXhwZWN0KGxpbnRlci5tZXNzYWdlcykudG9FcXVhbChbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZmlsZVBhdGg6IGpvaW4oZGlyZWN0b3J5LCAnLmF0b20tYnVpbGQuanNvbicpLFxuICAgICAgICAgICAgcmFuZ2U6IFsgWzIsIDddLCBbMiwgN10gXSxcbiAgICAgICAgICAgIHRleHQ6ICd2ZXJ5IGJhZCB0aGluZ3MnLFxuICAgICAgICAgICAgdHlwZTogJ0Vycm9yJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoam9pbihkaXJlY3RvcnksICcuYXRvbS1idWlsZC5qc29uJyksIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjbWQ6IGAke3NsZWVwKDMwKX1gXG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gc3BlY0hlbHBlcnMucmVmcmVzaEF3YWl0VGFyZ2V0cygpKTtcblxuICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJykpO1xuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgICF3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yJykgJiZcbiAgICAgICAgICAhd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChkdW1teVBhY2thZ2UuZ2V0TGludGVyKCkubWVzc2FnZXMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/naver/.atom/packages/build/spec/linter-intergration-spec.js
