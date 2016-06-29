(function() {
  var MessagePanelView, MessagesView, PlainMessageView, _ref;

  _ref = require('atom-message-panel'), MessagePanelView = _ref.MessagePanelView, PlainMessageView = _ref.PlainMessageView;

  module.exports = MessagesView = (function() {
    function MessagesView(title) {
      this.messages = new MessagePanelView({
        title: "" + title
      });
    }

    MessagesView.prototype.postMessage = function(data) {
      var closeCallback, _ref1, _ref2;
      if ((_ref1 = this.messages) != null) {
        _ref1.attach();
      }
      if ((_ref2 = this.messages) != null) {
        _ref2.add(new PlainMessageView(data));
      }
      closeCallback = (function(_this) {
        return function() {
          return _this.close();
        };
      })(this);
      if (this.closeTimer != null) {
        clearTimeout(this.closeTimer);
      }
      return this.closeTimer = setTimeout(closeCallback, atom.config.get('remote-edit.messagePanelTimeout'));
    };

    MessagesView.prototype.close = function() {
      this.messages.clear();
      return this.messages.close();
    };

    MessagesView.prototype.destroy = function() {
      if (this.closeTimer != null) {
        clearTimeout(this.closeTimer);
      }
      this.messages.clear();
      return this.messages.close();
    };

    return MessagesView;

  })();

}).call(this);
