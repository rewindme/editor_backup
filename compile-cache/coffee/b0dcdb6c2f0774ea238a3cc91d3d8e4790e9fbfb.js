(function() {
  var Greet, Home,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Greet = (function(_super) {
    __extends(Greet, _super);

    function Greet($log) {
      this.sayHello = function(name) {
        return $log.info("Hello " + name + "!");
      };
    }

    return Greet;

  })(Service);

  Home = (function(_super) {
    __extends(Home, _super);

    function Home(greetService) {
      greetService.sayHello('Luke Skywalker');
    }

    return Home;

  })(Controller);

}).call(this);
