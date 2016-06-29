(function() {
  var $, View, allowUnsafeEval, allowUnsafeNewFunction, fs, path, rCache, temp, _, _ref, _ref1;

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  path = require('path');

  temp = require("temp").track();

  fs = require('fs');

  _ref1 = require('loophole'), allowUnsafeEval = _ref1.allowUnsafeEval, allowUnsafeNewFunction = _ref1.allowUnsafeNewFunction;

  _ = require('underscore-plus');

  rCache = {};

  module.exports = {
    allRenderers: function() {
      var gs, r;
      gs = [];
      for (r in this.grammars) {
        gs.push(this.grammars[r]);
      }
      return gs;
    },
    findByGrammar: function(grammar) {
      return this.grammars[grammar];
    },
    findAllByExtention: function(extension) {
      var gs;
      gs = this.allRenderers();
      return _.filter(gs, function(renderer) {
        var exts;
        exts = renderer.exts;
        if (exts == null) {
          return false;
        } else {
          return exts.test(extension);
        }
      });
    },
    findRenderer: function(grammar, extension) {
      var renderer, renderers;
      renderer = this.findByGrammar(grammar);
      if (renderer == null) {
        renderers = this.findAllByExtention(extension);
        if (renderers.length > 0) {
          return renderers[0];
        } else {
          return null;
        }
      } else {
        return renderer;
      }
    },
    grammars: {
      'CoffeeScript': {
        render: function(text, filepath, cb) {
          var coffeescript, result;
          coffeescript = require('coffee-script');
          result = coffeescript.compile(text);
          return cb(null, result);
        },
        exts: /\.(coffee)$/i,
        lang: function() {
          return 'js';
        }
      },
      'CoffeeScript (Literate)': {
        render: function(text, filepath, cb) {
          var coffeescript, result;
          coffeescript = require('coffee-script');
          result = coffeescript.compile(text, {
            literate: true
          });
          return cb(null, result);
        },
        exts: /\.(litcoffee)$/i,
        lang: function() {
          return 'js';
        }
      },
      'CoffeeScript (JSX)': {
        render: function(text, filepath, cb) {
          var react, result;
          react = require('coffee-react');
          result = react.compile(text);
          return cb(null, result);
        },
        exts: /\.(cjsx)$/i,
        lang: function() {
          return 'js';
        }
      },
      'CoffeeScript (CJSX)': {
        render: function(text, filepath, cb) {
          var react, result;
          react = require('coffee-react');
          result = react.compile(text);
          return cb(null, result);
        },
        exts: /\.(cjsx)$/i,
        lang: function() {
          return 'js';
        }
      },
      'TypeScript': {
        render: function(text, filepath, cb) {
          var result, ts;
          ts = allowUnsafeNewFunction(function() {
            return allowUnsafeEval(function() {
              return require('typestring');
            });
          });
          result = allowUnsafeEval(function() {
            return ts.compile(text);
          });
          return cb(null, result);
        },
        lang: function() {
          return 'js';
        },
        exts: /\.(ts)$/i
      },
      'LESS': {
        render: function(text, filepath, cb) {
          var atomVariablesPath, less, options, resourcePath;
          less = require('less');
          resourcePath = atom.themes.resourcePath;
          atomVariablesPath = path.resolve(resourcePath, 'static', 'variables');
          options = {
            paths: ['.', atomVariablesPath]
          };
          return less.render(text, options).then(function(output) {
            return cb(null, output.css);
          })["catch"](function(error) {
            return cb(error);
          });
        },
        lang: function() {
          return 'css';
        },
        exts: /\.(less)$/i
      },
      'Jade': {
        render: function(text, filepath, cb) {
          var fn, jade, options, result;
          jade = allowUnsafeNewFunction(function() {
            return allowUnsafeEval(function() {
              return require('jade');
            });
          });
          options = {
            filename: filepath,
            pretty: true
          };
          fn = allowUnsafeNewFunction(function() {
            return allowUnsafeEval(function() {
              return jade.compile(text, options);
            });
          });
          result = allowUnsafeNewFunction(function() {
            return allowUnsafeEval(function() {
              return fn();
            });
          });
          return cb(null, result);
        },
        lang: function() {
          return 'html';
        },
        exts: /\.(jade)$/i
      },
      'Pug': {
        render: function(text, filepath, cb) {
          var fn, options, pug, result;
          pug = allowUnsafeNewFunction(function() {
            return allowUnsafeEval(function() {
              return require('pug');
            });
          });
          options = {
            filename: filepath,
            pretty: true
          };
          fn = allowUnsafeNewFunction(function() {
            return allowUnsafeEval(function() {
              return pug.compile(text, options);
            });
          });
          result = allowUnsafeNewFunction(function() {
            return allowUnsafeEval(function() {
              return fn();
            });
          });
          return cb(null, result);
        },
        lang: function() {
          return 'html';
        },
        exts: /\.(pug)$/i
      },
      'Dogescript': {
        render: function(text, filepath, cb) {
          var beautify, dogescript, result;
          dogescript = require("dogescript");
          beautify = true;
          result = dogescript(text, beautify);
          return cb(null, result);
        },
        exts: /\.(djs)$/i,
        lang: function() {
          return 'js';
        }
      },
      'DSON': {
        render: function(text, filepath, cb) {
          var DSON, d, e, result;
          DSON = require("dogeon");
          try {
            d = DSON.parse(text);
            result = JSON.stringify(d);
            return cb(null, result);
          } catch (_error) {
            e = _error;
            return cb(e, null);
          }
        },
        exts: /\.(dson)$/i,
        lang: function() {
          return 'json';
        }
      },
      'Stylus': {
        render: function(text, filepath, cb) {
          var stylus;
          stylus = require("stylus");
          return stylus(text).set('filename', filepath).render(function(err, css) {
            return cb(err, css);
          });
        },
        exts: /\.(styl)$/i,
        lang: function() {
          return 'css';
        }
      },
      'Babel ES6 JavaScript': {
        render: function(text, filepath, cb) {
          var babel, options, result;
          babel = require('babel-core');
          options = {
            presets: [require('babel-preset-es2015'), require('babel-preset-react'), require('babel-preset-stage-0'), require('babel-preset-stage-1'), require('babel-preset-stage-2'), require('babel-preset-stage-3')]
          };
          result = babel.transform(text, options);
          return cb(null, result.code);
        },
        exts: /\.(js|jsx|es6|es)$/i,
        lang: function() {
          return 'js';
        }
      },
      'EmberScript': {
        render: function(text, filepath, cb) {
          var csAst, em, jsAst, jsContent, options;
          em = require('ember-script');
          options = {
            bare: false,
            raw: false,
            sourceMap: false
          };
          csAst = em.parse(text, {
            bare: options.bare,
            raw: options.raw || options.sourceMap
          });
          jsAst = em.compile(csAst, {
            bare: options.bare
          });
          jsContent = em.js(jsAst);
          return cb(null, jsContent);
        },
        exts: /\.(em)$/i,
        lang: function() {
          return 'js';
        }
      },
      'SpacePen': {
        render: function(text, filepath, cb) {
          var e, generateFilepath;
          try {
            generateFilepath = function(filepath, cb) {
              var cd, extension, newFilename, newFilepath;
              extension = path.extname(filepath);
              cd = path.dirname(filepath);
              newFilename = "preview-temp-file-" + (+new Date()) + extension;
              newFilepath = path.resolve(cd, newFilename);
              return cb(null, newFilepath);
            };
            return generateFilepath(filepath, function(err, fp) {
              if (err != null) {
                return cb(err, null);
              }
              return fs.writeFile(fp, text || "", function(err) {
                var e, view;
                if (err != null) {
                  return cb(err, null);
                }
                try {
                  View = require(fp);
                  view = new View();
                  if (view instanceof View) {
                    cb(null, view);
                  } else {
                    cb(new Error("Is not a SpacePen View"), null);
                  }
                  fs.unlink(fp);
                } catch (_error) {
                  e = _error;
                  cb(e, null);
                  fs.unlink(fp);
                }
              });
            });
          } catch (_error) {
            e = _error;
            return cb(e, null);
          }
        },
        exts: /\.(coffee|js)$/i
      },
      'LiveScript': {
        render: function(text, filepath, cb) {
          var livescript, options, result;
          livescript = require('livescript');
          options = {
            filename: filepath,
            bare: true
          };
          result = allowUnsafeNewFunction(function() {
            return livescript.compile(text, options);
          });
          return cb(null, result);
        },
        exts: /\.(ls)$/i,
        lang: function() {
          return 'js';
        }
      },
      'ng-classify (coffee)': {
        render: function(text, filepath, cb) {
          var ngClassify, result;
          ngClassify = require('ng-classify');
          result = ngClassify(text) + '\n';
          return cb(null, result);
        },
        exts: /\.(coffee)$/i,
        lang: function() {
          return 'coffee';
        }
      },
      'ng-classify (js)': {
        render: function(text, filepath, cb) {
          var coffeescript, ngClassify, result;
          ngClassify = require('ng-classify');
          result = ngClassify(text);
          coffeescript = require('coffee-script');
          result = coffeescript.compile(result);
          return cb(null, result);
        },
        exts: /\.(coffee)$/i,
        lang: function() {
          return 'js';
        }
      },
      'YAML': {
        render: function(text, filepath, cb) {
          var e, json, jsyaml;
          jsyaml = require('js-yaml');
          try {
            json = jsyaml.safeLoad(text);
            return cb(null, JSON.stringify(json, null, 2));
          } catch (_error) {
            e = _error;
            return cb(null, e.message);
          }
        },
        exts: /\.(yaml)$/i,
        lang: function() {
          return 'json';
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3ByZXZpZXcvbGliL3JlbmRlcmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RkFBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLFFBQTRDLE9BQUEsQ0FBUSxVQUFSLENBQTVDLEVBQUMsd0JBQUEsZUFBRCxFQUFrQiwrQkFBQSxzQkFKbEIsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FMSixDQUFBOztBQUFBLEVBT0EsTUFBQSxHQUFTLEVBUFQsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFlBQUEsRUFBYyxTQUFBLEdBQUE7QUFDWixVQUFBLEtBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxFQUFMLENBQUE7QUFFQSxXQUFBLGtCQUFBLEdBQUE7QUFDRSxRQUFBLEVBQUUsQ0FBQyxJQUFILENBQVEsSUFBQyxDQUFBLFFBQVMsQ0FBQSxDQUFBLENBQWxCLENBQUEsQ0FERjtBQUFBLE9BRkE7QUFJQSxhQUFPLEVBQVAsQ0FMWTtJQUFBLENBQWQ7QUFBQSxJQU1BLGFBQUEsRUFBZSxTQUFDLE9BQUQsR0FBQTthQUNiLElBQUMsQ0FBQSxRQUFTLENBQUEsT0FBQSxFQURHO0lBQUEsQ0FOZjtBQUFBLElBUUEs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

//# sourceURL=/Users/naver/.atom/packages/preview/lib/renderer.coffee
