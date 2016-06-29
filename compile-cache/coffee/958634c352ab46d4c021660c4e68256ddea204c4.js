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
          var atomVariablesPath, less, parser, resourcePath;
          less = require('less');
          resourcePath = atom.themes.resourcePath;
          atomVariablesPath = path.resolve(resourcePath, 'static', 'variables');
          parser = new less.Parser({
            paths: ['.', atomVariablesPath],
            filename: filepath
          });
          return parser.parse(text, function(e, tree) {
            var output;
            if (e != null) {
              return cb(e, null);
            } else {
              output = tree.toCSS({
                compress: false
              });
              return cb(null, output);
            }
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
      'JavaScript (JSX)': {
        render: function(text, filepath, cb) {
          var options, reactTools, result;
          reactTools = require('react-tools');
          options = {};
          result = reactTools.transform(text, options);
          return cb(null, result);
        },
        exts: /\.(jsx)$/i,
        lang: function() {
          return 'js';
        }
      },
      'Babel ES6 JavaScript': {
        render: function(text, filepath, cb) {
          var babel, options, result;
          babel = require('babel-core');
          options = {};
          result = babel.transform(text, options);
          return cb(null, result.code);
        },
        exts: /\.(js|es6|es)$/i,
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
          var LiveScript, options, result;
          LiveScript = require('LiveScript');
          options = {
            filename: filepath,
            bare: true
          };
          result = allowUnsafeNewFunction(function() {
            return LiveScript.compile(text, options);
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
      }
    }
  };

}).call(this);
