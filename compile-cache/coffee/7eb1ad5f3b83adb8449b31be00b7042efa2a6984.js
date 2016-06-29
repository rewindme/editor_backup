
/*
 * Atom uses the Jasmine JavaScript testing framework.
 * More information here: http://jasmine.github.io/
 *
 * To directly run the tests in this directory from Atom, press `cmd-alt-ctrl-p`.
 *
 * For more information:
 *   - https://atom.io/docs/latest/creating-a-package#writing-tests
 *   - https://atom.io/docs/latest/creating-a-package#running-tests
 */

(function() {
  'use strict';
  var Preview;

  Preview = require('../lib/preview');

  describe('Preview', function() {
    return describe('A suite', function() {
      return it('should spec with an expectation', function() {
        return expect(Preview).not.toBeNull();
      });
    });
  });

}).call(this);
