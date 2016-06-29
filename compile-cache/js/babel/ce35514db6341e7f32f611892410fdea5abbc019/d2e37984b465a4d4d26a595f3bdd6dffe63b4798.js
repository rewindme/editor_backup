function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _atomBuildSpecHelpers = require('atom-build-spec-helpers');

var _atomBuildSpecHelpers2 = _interopRequireDefault(_atomBuildSpecHelpers);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

'use babel';

describe('Confirm', function () {
  var directory = null;
  var workspaceElement = null;
  var cat = process.platform === 'win32' ? 'type' : 'cat';
  var waitTime = process.env.CI ? 2400 : 200;
  var originalHomedirFn = _os2['default'].homedir;

  _temp2['default'].track();

  beforeEach(function () {
    var createdHomeDir = _temp2['default'].mkdirSync('atom-build-spec-home');
    _os2['default'].homedir = function () {
      return createdHomeDir;
    };
    directory = _fsExtra2['default'].realpathSync(_temp2['default'].mkdirSync({ prefix: 'atom-build-spec-' })) + '/';
    atom.project.setPaths([directory]);

    atom.config.set('build.buildOnSave', false);
    atom.config.set('build.panelVisibility', 'Toggle');
    atom.config.set('build.saveOnBuild', false);
    atom.config.set('build.notificationOnRefresh', true);

    jasmine.unspy(window, 'setTimeout');
    jasmine.unspy(window, 'clearTimeout');

    runs(function () {
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.setAttribute('style', 'width:9999px');
      jasmine.attachToDOM(workspaceElement);
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage('build');
    });
  });

  afterEach(function () {
    _fsExtra2['default'].removeSync(directory);
    _os2['default'].homedir = originalHomedirFn;
  });

  describe('when the text editor is modified', function () {
    it('should show the save confirmation', function () {
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();

      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
      }));

      waitsForPromise(function () {
        return atom.workspace.open('.atom-build.json');
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.insertText('hello kansas');
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector(':focus');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.btn-success:focus')).toExist();
      });
    });

    it('should cancel the confirm window when pressing escape', function () {
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();

      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
      }));

      waitsForPromise(function () {
        return atom.workspace.open('.atom-build.json');
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.insertText('hello kansas');
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector(':focus');
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:no-confirm');
        expect(workspaceElement.querySelector('.btn-success:focus')).not.toExist();
      });
    });

    it('should not do anything if issuing no-confirm whithout the dialog', function () {
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();
      atom.commands.dispatch(workspaceElement, 'build:no-confirm');
    });

    it('should not confirm if a TextEditor edits an unsaved file', function () {
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();

      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
      }));

      waitsForPromise(function () {
        return Promise.all([_atomBuildSpecHelpers2['default'].refreshAwaitTargets(), atom.workspace.open('.atom-build.json'), atom.workspace.open()]);
      });

      runs(function () {
        var editor = atom.workspace.getTextEditors().find(function (textEditor) {
          return 'untitled' === textEditor.getTitle();
        });
        editor.insertText('Just some temporary place to write stuff');
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.terminal').terminal.getContent()).toMatch(/Surprising is the passing of time but not so, as the time of passing/);
      });
    });

    it('should save and build when selecting save and build', function () {
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();

      _fsExtra2['default'].writeFileSync(directory + 'catme', 'Surprising is the passing of time but not so, as the time of passing.');
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: cat + ' catme'
      }));

      waitsForPromise(function () {
        return Promise.all([_atomBuildSpecHelpers2['default'].refreshAwaitTargets(), atom.workspace.open('catme')]);
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.setText('kansas');
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector(':focus');
      });

      runs(function () {
        return workspaceElement.querySelector(':focus').click();
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').innerHTML).toMatch(/kansas/);
        expect(!editor.isModified());
      });
    });

    it('should build but not save when opting so', function () {
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();

      _fsExtra2['default'].writeFileSync(directory + 'catme', 'Surprising is the passing of time but not so, as the time of passing.');
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: cat + ' catme'
      }));

      waitsForPromise(function () {
        return Promise.all([_atomBuildSpecHelpers2['default'].refreshAwaitTargets(), atom.workspace.open('catme')]);
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.setText('catme');
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector(':focus');
      });

      runs(function () {
        workspaceElement.querySelector('button[click="confirmWithoutSave"]').click();
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').innerHTML).not.toMatch(/kansas/);
        expect(editor.isModified());
      });
    });

    it('should do nothing when cancelling', function () {
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();

      _fsExtra2['default'].writeFileSync(directory + 'catme', 'Surprising is the passing of time but not so, as the time of passing.');
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: cat + ' catme'
      }));

      waitsForPromise(function () {
        return Promise.all([_atomBuildSpecHelpers2['default'].refreshAwaitTargets(), atom.workspace.open('catme')]);
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.setText('kansas');
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector(':focus');
      });

      runs(function () {
        workspaceElement.querySelector('button[click="cancel"]').click();
      });

      waits(waitTime);

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        expect(workspaceElement.querySelector('.build')).not.toExist();
        expect(editor.isModified());
      });
    });
  });

  describe('when build is triggered without answering confirm dialog', function () {
    it('should only keep at maximum 1 dialog open', function () {
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();

      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
      }));

      waitsForPromise(function () {
        return Promise.all([_atomBuildSpecHelpers2['default'].refreshAwaitTargets(), atom.workspace.open('.atom-build.json')]);
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.setText(JSON.stringify({
          cmd: 'echo kansas'
        }));
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build-confirm');
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waits(waitTime); // Everything is the same so we can't know when second build:trigger has been handled

      runs(function () {
        expect(workspaceElement.querySelectorAll('.build-confirm').length).toEqual(1);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL2J1aWxkLWNvbmZpcm0tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzt1QkFFZSxVQUFVOzs7O29CQUNSLE1BQU07Ozs7b0NBQ0MseUJBQXlCOzs7O2tCQUNsQyxJQUFJOzs7O0FBTG5CLFdBQVcsQ0FBQzs7QUFPWixRQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07QUFDeEIsTUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLE1BQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxHQUFHLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDMUQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLGdCQUFHLE9BQU8sQ0FBQzs7QUFFckMsb0JBQUssS0FBSyxFQUFFLENBQUM7O0FBRWIsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFNLGNBQWMsR0FBRyxrQkFBSyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM5RCxvQkFBRyxPQUFPLEdBQUc7YUFBTSxjQUFjO0tBQUEsQ0FBQztBQUNsQyxhQUFTLEdBQUcscUJBQUcsWUFBWSxDQUFDLGtCQUFLLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDbEYsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBRSxTQUFTLENBQUUsQ0FBQyxDQUFDOztBQUVyQyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNu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WUFBTTtBQUNULGNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUMvRSxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkL3NwZWMvYnVpbGQtY29uZmlybS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJztcbmltcG9ydCBzcGVjSGVscGVycyBmcm9tICdhdG9tLWJ1aWxkLXNwZWMtaGVscGVycyc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuXG5kZXNjcmliZSgnQ29uZmlybScsICgpID0+IHtcbiAgbGV0IGRpcmVjdG9yeSA9IG51bGw7XG4gIGxldCB3b3Jrc3BhY2VFbGVtZW50ID0gbnVsbDtcbiAgY29uc3QgY2F0ID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICd0eXBlJyA6ICdjYXQnO1xuICBjb25zdCB3YWl0VGltZSA9IHByb2Nlc3MuZW52LkNJID8gMjQwMCA6IDIwMDtcbiAgY29uc3Qgb3JpZ2luYWxIb21lZGlyRm4gPSBvcy5ob21lZGlyO1xuXG4gIHRlbXAudHJhY2soKTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBjb25zdCBjcmVhdGVkSG9tZURpciA9IHRlbXAubWtkaXJTeW5jKCdhdG9tLWJ1aWxkLXNwZWMtaG9tZScpO1xuICAgIG9zLmhvbWVkaXIgPSAoKSA9PiBjcmVhdGVkSG9tZURpcjtcbiAgICBkaXJlY3RvcnkgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoeyBwcmVmaXg6ICdhdG9tLWJ1aWxkLXNwZWMtJyB9KSkgKyAnLyc7XG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFsgZGlyZWN0b3J5IF0pO1xuXG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5idWlsZE9uU2F2ZScsIGZhbHNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdUb2dnbGUnKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnNhdmVPbkJ1aWxkJywgZmFsc2UpO1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQubm90aWZpY2F0aW9uT25SZWZyZXNoJywgdHJ1ZSk7XG5cbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ3NldFRpbWVvdXQnKTtcbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ2NsZWFyVGltZW91dCcpO1xuXG4gICAgcnVucygoKSA9PiB7XG4gICAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDo5OTk5cHgnKTtcbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdidWlsZCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGZzLnJlbW92ZVN5bmMoZGlyZWN0b3J5KTtcbiAgICBvcy5ob21lZGlyID0gb3JpZ2luYWxIb21lZGlyRm47XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSB0ZXh0IGVkaXRvciBpcyBtb2RpZmllZCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgdGhlIHNhdmUgY29uZmlybWF0aW9uJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkLWNvbmZpcm0nKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY21kOiAnZWNobyBTdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWUgYnV0IG5vdCBzbywgYXMgdGhlIHRpbWUgb2YgcGFzc2luZy4nXG4gICAgICB9KSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCcuYXRvbS1idWlsZC5qc29uJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2hlbGxvIGthbnNhcycpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCc6Zm9jdXMnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1zdWNjZXNzOmZvY3VzJykpLnRvRXhpc3QoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjYW5jZWwgdGhlIGNvbmZpcm0gd2luZG93IHdoZW4gcHJlc3NpbmcgZXNjYXBlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkLWNvbmZpcm0nKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY21kOiAnZWNobyBTdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWUgYnV0IG5vdCBzbywgYXMgdGhlIHRpbWUgb2YgcGFzc2luZy4nXG4gICAgICB9KSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCcuYXRvbS1idWlsZC5qc29uJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ2hlbGxvIGthbnNhcycpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCc6Zm9jdXMnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6bm8tY29uZmlybScpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnRuLXN1Y2Nlc3M6Zm9jdXMnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgZG8gYW55dGhpbmcgaWYgaXNzdWluZyBuby1jb25maXJtIHdoaXRob3V0IHRoZSBkaWFsb2cnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQtY29uZmlybScpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6bm8tY29uZmlybScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgY29uZmlybSBpZiBhIFRleHRFZGl0b3IgZWRpdHMgYW4gdW5zYXZlZCBmaWxlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkLWNvbmZpcm0nKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY21kOiAnZWNobyBTdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWUgYnV0IG5vdCBzbywgYXMgdGhlIHRpbWUgb2YgcGFzc2luZy4nXG4gICAgICB9KSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgc3BlY0hlbHBlcnMucmVmcmVzaEF3YWl0VGFyZ2V0cygpLFxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJy5hdG9tLWJ1aWxkLmpzb24nKSxcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKClcbiAgICAgICAgXSk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZmluZCh0ZXh0RWRpdG9yID0+IHtcbiAgICAgICAgICByZXR1cm4gKCd1bnRpdGxlZCcgPT09IHRleHRFZGl0b3IuZ2V0VGl0bGUoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnSnVzdCBzb21lIHRlbXBvcmFyeSBwbGFjZSB0byB3cml0ZSBzdHVmZicpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRlcm1pbmFsJykudGVybWluYWwuZ2V0Q29udGVudCgpKS50b01hdGNoKC9TdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWUgYnV0IG5vdCBzbywgYXMgdGhlIHRpbWUgb2YgcGFzc2luZy8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNhdmUgYW5kIGJ1aWxkIHdoZW4gc2VsZWN0aW5nIHNhdmUgYW5kIGJ1aWxkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkLWNvbmZpcm0nKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnY2F0bWUnLCAnU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lIGJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcuJyk7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBjbWQ6IGAke2NhdH0gY2F0bWVgXG4gICAgICB9KSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgc3BlY0hlbHBlcnMucmVmcmVzaEF3YWl0VGFyZ2V0cygpLFxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2NhdG1lJylcbiAgICAgICAgXSk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgZWRpdG9yLnNldFRleHQoJ2thbnNhcycpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCc6Zm9jdXMnKSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCc6Zm9jdXMnKS5jbGljaygpKTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLmlubmVySFRNTCkudG9NYXRjaCgva2Fuc2FzLyk7XG4gICAgICAgIGV4cGVjdCghZWRpdG9yLmlzTW9kaWZpZWQoKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYnVpbGQgYnV0IG5vdCBzYXZlIHdoZW4gb3B0aW5nIHNvJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkLWNvbmZpcm0nKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnY2F0bWUnLCAnU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lIGJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcuJyk7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBjbWQ6IGAke2NhdH0gY2F0bWVgXG4gICAgICB9KSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgc3BlY0hlbHBlcnMucmVmcmVzaEF3YWl0VGFyZ2V0cygpLFxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2NhdG1lJylcbiAgICAgICAgXSk7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgZWRpdG9yLnNldFRleHQoJ2NhdG1lJyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJzpmb2N1cycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbltjbGljaz1cImNvbmZpcm1XaXRob3V0U2F2ZVwiXScpLmNsaWNrKCk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLmlubmVySFRNTCkubm90LnRvTWF0Y2goL2thbnNhcy8pO1xuICAgICAgICBleHBlY3QoZWRpdG9yLmlzTW9kaWZpZWQoKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZG8gbm90aGluZyB3aGVuIGNhbmNlbGxpbmcnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQtY29uZmlybScpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICdjYXRtZScsICdTdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWUgYnV0IG5vdCBzbywgYXMgdGhlIHRpbWUgb2YgcGFzc2luZy4nKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGNtZDogYCR7Y2F0fSBjYXRtZWBcbiAgICAgIH0pKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICBzcGVjSGVscGVycy5yZWZyZXNoQXdhaXRUYXJnZXRzKCksXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignY2F0bWUnKVxuICAgICAgICBdKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICBlZGl0b3Iuc2V0VGV4dCgna2Fuc2FzJyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJzpmb2N1cycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbltjbGljaz1cImNhbmNlbFwiXScpLmNsaWNrKCk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHMod2FpdFRpbWUpO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KGVkaXRvci5pc01vZGlmaWVkKCkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIGJ1aWxkIGlzIHRyaWdnZXJlZCB3aXRob3V0IGFuc3dlcmluZyBjb25maXJtIGRpYWxvZycsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIG9ubHkga2VlcCBhdCBtYXhpbXVtIDEgZGlhbG9nIG9wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQtY29uZmlybScpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBjbWQ6ICdlY2hvIFN1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZSBidXQgbm90IHNvLCBhcyB0aGUgdGltZSBvZiBwYXNzaW5nLidcbiAgICAgIH0pKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICBzcGVjSGVscGVycy5yZWZyZXNoQXdhaXRUYXJnZXRzKCksXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignLmF0b20tYnVpbGQuanNvbicpXG4gICAgICAgIF0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGVkaXRvci5zZXRUZXh0KEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjbWQ6ICdlY2hvIGthbnNhcydcbiAgICAgICAgfSkpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQtY29uZmlybScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHMod2FpdFRpbWUpOyAvLyBFdmVyeXRoaW5nIGlzIHRoZSBzYW1lIHNvIHdlIGNhbid0IGtub3cgd2hlbiBzZWNvbmQgYnVpbGQ6dHJpZ2dlciBoYXMgYmVlbiBoYW5kbGVkXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnVpbGQtY29uZmlybScpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/naver/.atom/packages/build/spec/build-confirm-spec.js
