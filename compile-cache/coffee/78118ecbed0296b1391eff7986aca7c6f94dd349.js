(function() {
  var Toolbar, ToolbarView;

  ToolbarView = require('./toolbar-view');

  module.exports = Toolbar = (function() {
    function Toolbar(browser) {
      this.toolbarView = new ToolbarView(browser);
    }

    Toolbar.prototype.getView = function() {
      return this.toolbarView;
    };

    Toolbar.prototype.visible = function() {
      return this.toolbarView.is(':visible');
    };

    Toolbar.prototype.show = function() {
      return this.toolbarView.show();
    };

    Toolbar.prototype.hide = function() {
      return this.toolbarView.hide();
    };

    Toolbar.prototype.focus = function() {
      return this.toolbarView.focus();
    };

    Toolbar.prototype.focused = function() {
      return this.toolbarView.focused();
    };

    Toolbar.prototype.getOmniboxView = function() {
      return this.toolbarView.getOmniboxView();
    };

    Toolbar.prototype.setOmniText = function(text) {
      return this.toolbarView.setOmniText(text);
    };

    Toolbar.prototype.setFaviconDomain = function(domain) {
      return this.toolbarView.setFaviconDomain(domain);
    };

    Toolbar.prototype.destroy = function() {
      var _base;
      return typeof (_base = this.toolbarView).destroy === "function" ? _base.destroy() : void 0;
    };

    return Toolbar;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2F0b20td2ViYnJvd3Nlci9saWIvdG9vbGJhci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLE1BQUEsb0JBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLGlCQUFDLE9BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksT0FBWixDQUFuQixDQURXO0lBQUEsQ0FBYjs7QUFBQSxzQkFHQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFlBQUo7SUFBQSxDQUhULENBQUE7O0FBQUEsc0JBS0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxXQUFXLENBQUMsRUFBYixDQUFnQixVQUFoQixFQUFIO0lBQUEsQ0FMVCxDQUFBOztBQUFBLHNCQU1BLElBQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQSxFQUFIO0lBQUEsQ0FOVCxDQUFBOztBQUFBLHNCQU9BLElBQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQSxFQUFIO0lBQUEsQ0FQVCxDQUFBOztBQUFBLHNCQVFBLEtBQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQSxFQUFIO0lBQUEsQ0FSVCxDQUFBOztBQUFBLHNCQVNBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxFQUFIO0lBQUEsQ0FUVCxDQUFBOztBQUFBLHNCQVdBLGNBQUEsR0FBMkIsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFdBQVcsQ0FBQyxjQUFiLENBQUEsRUFBSDtJQUFBLENBWDNCLENBQUE7O0FBQUEsc0JBWUEsV0FBQSxHQUFvQixTQUFDLElBQUQsR0FBQTthQUFVLElBQUMsQ0FBQSxXQUFXLENBQUMsV0FBYixDQUF5QixJQUF6QixFQUFWO0lBQUEsQ0FacEIsQ0FBQTs7QUFBQSxzQkFhQSxnQkFBQSxHQUFrQixTQUFDLE1BQUQsR0FBQTthQUFZLElBQUMsQ0FBQSxXQUFXLENBQUMsZ0JBQWIsQ0FBOEIsTUFBOUIsRUFBWjtJQUFBLENBYmxCLENBQUE7O0FBQUEsc0JBZUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsS0FBQTs2RUFBWSxDQUFDLG1CQUROO0lBQUEsQ0FmVCxDQUFBOzttQkFBQTs7TUFMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/atom-webbrowser/lib/toolbar.coffee
