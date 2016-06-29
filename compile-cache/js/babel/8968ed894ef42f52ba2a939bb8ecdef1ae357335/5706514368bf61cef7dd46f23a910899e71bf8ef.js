var __hasProp = ({}).hasOwnProperty,
    __extends = function __extends(child, parent) {
	for (var key in parent) {
		if (__hasProp.call(parent, key)) child[key] = parent[key];
	}function ctor() {
		this.constructor = child;
	}ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
},
    $ = require('atom-space-pen-views').$,
    DirectoryView = require('./directory-view'),
    ScrollView = require('atom-space-pen-views').ScrollView;

function hideLocalTree() {
	if (atom.packages.loadedPackages['tree-view'] && atom.packages.loadedPackages['tree-view'].mainModule && atom.packages.loadedPackages['tree-view'].mainModule.treeView) atom.packages.loadedPackages['tree-view'].mainModule.treeView.detach();
}

function showLocalTree() {
	if (atom.packages.loadedPackages['tree-view'] && atom.packages.loadedPackages['tree-view'].mainModule && atom.packages.loadedPackages['tree-view'].mainModule.treeView) atom.packages.loadedPackages['tree-view'].mainModule.treeView.attach();
}

module.exports = TreeView = (function (parent) {
	__extends(TreeView, parent);

	function TreeView() {
		TreeView.__super__.constructor.apply(this, arguments);
	}

	TreeView.content = function () {
		return this.div({
			'class': 'remote-ftp-view tree-view-resizer tool-panel',
			'data-show-on-right-side': atom.config.get('tree-view.showOnRightSide')
		}, (function () {
			this.div({
				'class': 'scroller',
				'outlet': 'scroller'
			}, (function () {
				this.ol({
					'class': 'full-menu list-tree has-collapsable-children focusable-panel',
					'tabindex': -1,
					'outlet': 'list'
				});
			}).bind(this));
			this.div({
				'class': 'resize-handle',
				'outlet': 'horizontalResize'
			});
			this.div({
				'class': 'queue tool-panel panel-bottom',
				'tabindex': -1,
				'outlet': 'queue'
			}, (function () {
				this.ul({
					'class': 'progress tool-panel panel-top',
					'tabindex': -1,
					'outlet': 'progress'
				});
				this.ul({
					'class': 'list',
					'tabindex': -1,
					'outlet': 'debug'
				});
				return this.div({
					'class': 'resize-handle',
					'outlet': 'verticalResize'
				});
			}).bind(this));
			this.div({
				'class': 'offline',
				'tabindex': -1,
				'outlet': 'offline'
			});
		}).bind(this));
	};

	var elapsedTime = function elapsedTime(ms) {
		var days = Math.floor(ms / 86400000);
		ms %= 86400000;
		var hours = Math.floor(ms / 3600000);
		ms %= 3600000;
		var mins = Math.floor(ms / 60000);
		ms %= 60000;
		var secs = Math.floor(ms / 1000);
		ms %= 1000;

		return ((days ? days + 'd ' : '') + (hours ? (days && hours < 10 ? '0' : '') + hours + 'h ' : '') + (mins ? ((days || hours) && mins < 10 ? '0' : '') + mins + 'm ' : '') + (secs ? ((days || hours || mins) && secs < 10 ? '0' : '') + secs + 's ' : '')).replace(/^[dhms]\s+/, '').replace(/[dhms]\s+[dhms]/g, '').replace(/^\s+/, '').replace(/\s+$/, '') || '0s';
	};

	TreeView.prototype.initialize = function (state) {
		TreeView.__super__.initialize.apply(this, arguments);

		var self = this;

		//self.addClass(atom.config.get('tree-view.showOnRightSide') ? 'panel-right' : 'panel-left');

		self.offline.html('<p><a role="connect">Connect</a>, <br /><a role="configure">edit configuration</a> or <br /><a role="toggle">close panel<a></p>');
		if (atom.project.remoteftp.isConnected()) self.showOnline();else self.showOffline();

		self.root = new DirectoryView(atom.project.remoteftp.root);
		self.root.expand();
		self.list.append(self.root);

		//self.attach();

		// Events
		atom.config.onDidChange('tree-view.showOnRightSide', function () {
			if (self.isVisible()) {
				setTimeout(function () {
					self.detach();
					self.attach();
				}, 1);
			}
		});
		atom.config.onDidChange('Remote-FTP.hideLocalWhenDisplayed', function (values) {
			if (values.newValue) {
				if (self.isVisible()) {
					hideLocalTree();
				}
			} else {
				if (self.isVisible()) {
					self.detach();
					showLocalTree();
					self.attach();
				} else {
					showLocalTree();
				}
			}
		});

		atom.project.remoteftp.on('debug', function (msg) {
			self.debug.prepend('<li>' + msg + '</li>');
			var children = self.debug.children();
			if (children.length > 20) children.last().remove();
		});
		atom.project.remoteftp.on('queue-changed', function () {
			self.progress.empty();

			var queue = [];
			if (atom.project.remoteftp._current) queue.push(atom.project.remoteftp._current);
			for (var i = 0, l = atom.project.remoteftp._queue.length; i < l; ++i) queue.push(atom.project.remoteftp._queue[i]);

			if (queue.length == 0) self.progress.hide();else {
				self.progress.show();

				queue.forEach(function (queue) {
					var $li = $('<li><progress class="inline-block" /><div class="name">' + queue[0] + '</div><div class="eta">-</div></li>'),
					    $progress = $li.children('progress'),
					    $eta = $li.children('.eta'),
					    progress = queue[2];
					self.progress.append($li);

					progress.on('progress', function (percent) {
						if (percent == -1) {
							$progress.removeAttr('max').removeAttr('value');
							$eta.text('-');
						} else {
							$progress.attr('max', 100).attr('value', parseInt(percent * 100, 10));
							var eta = progress.getEta();
							$eta.text(elapsedTime(eta));
						}
					});
					progress.once('done', function () {
						progress.removeAllListeners('progress');
					});
				});
			}
		});

		self.offline.on('click', '[role="connect"]', function (e) {
			atom.project.remoteftp.readConfig(function () {
				atom.project.remoteftp.connect();
			});
		});
		self.offline.on('click', '[role="configure"]', function (e) {
			atom.workspace.open(atom.project.getDirectories()[0].resolve('.ftpconfig'));
		});
		self.offline.on('click', '[role="toggle"]', function (e) {
			self.toggle();
		});
		self.horizontalResize.on('dblclick', function (e) {
			self.resizeToFitContent(e);
		});
		self.horizontalResize.on('mousedown', function (e) {
			self.resizeHorizontalStarted(e);
		});
		self.verticalResize.on('mousedown', function (e) {
			self.resizeVerticalStarted(e);
		});

		atom.project.remoteftp.on('connected', function () {
			self.showOnline();
		});
		//atom.project.remoteftp.on('closed', function () {
		atom.project.remoteftp.on('disconnected', function () {
			self.showOffline();
		});
	};

	TreeView.prototype.attach = function () {
		if (atom.config.get('tree-view.showOnRightSide')) {
			this.panel = atom.workspace.addRightPanel({ item: this });
		} else {
			this.panel = atom.workspace.addLeftPanel({ item: this });
		}

		if (atom.config.get('Remote-FTP.hideLocalWhenDisplayed')) hideLocalTree();else showLocalTree();
	};

	TreeView.prototype.detach = function () {
		TreeView.__super__.detach.apply(this, arguments);

		if (this.panel) {
			this.panel.destroy();
			this.panel = null;
		}

		showLocalTree();
	};

	TreeView.prototype.toggle = function () {
		if (this.isVisible()) {
			this.detach();
		} else {
			this.attach();
		}
	};

	TreeView.prototype.showOffline = function () {
		this.list.hide();
		this.queue.hide();
		this.offline.css('display', 'flex');
	};

	TreeView.prototype.showOnline = function () {
		this.list.show();
		this.queue.show();
		this.offline.hide();
	};

	TreeView.prototype.resolve = function (path) {
		var view = $('.remote-ftp-view [data-path="' + path + '"]').map(function () {
			var v = $(this).view();
			return v ? v : null;
		}).get(0);

		return view;
	};

	TreeView.prototype.getSelected = function () {
		var views = $('.remote-ftp-view .selected').map(function () {
			var v = $(this).view();
			return v ? v : null;
		}).get();

		return views;
	};

	TreeView.prototype.resizeVerticalStarted = function (e) {
		e.preventDefault();

		this.resizeHeightStart = this.queue.height();
		this.resizeMouseStart = e.pageY;
		$(document).on('mousemove', this.resizeVerticalView.bind(this));
		$(document).on('mouseup', this.resizeVerticalStopped);
	};

	TreeView.prototype.resizeVerticalStopped = function () {
		delete this.resizeHeightStart;
		delete this.resizeMouseStart;
		$(document).off('mousemove', this.resizeVerticalView);
		$(document).off('mouseup', this.resizeVerticalStopped);
	};

	TreeView.prototype.resizeVerticalView = function (e) {
		if (e.which !== 1) return this.resizeStopped();

		var delta = e.pageY - this.resizeMouseStart,
		    height = Math.max(26, this.resizeHeightStart - delta);

		this.queue.height(height);
		this.scroller.css('bottom', height + 'px');
	};

	TreeView.prototype.resizeHorizontalStarted = function (e) {
		e.preventDefault();

		this.resizeWidthStart = this.width();
		this.resizeMouseStart = e.pageX;
		$(document).on('mousemove', this.resizeHorizontalView.bind(this));
		$(document).on('mouseup', this.resizeHorizontalStopped);
	};

	TreeView.prototype.resizeHorizontalStopped = function () {
		delete this.resizeWidthStart;
		delete this.resizeMouseStart;
		$(document).off('mousemove', this.resizeHorizontalView);
		$(document).off('mouseup', this.resizeHorizontalStopped);
	};

	TreeView.prototype.resizeHorizontalView = function (e) {
		if (e.which !== 1) return this.resizeStopped();

		var delta = e.pageX - this.resizeMouseStart,
		    width = Math.max(50, this.resizeWidthStart + delta);

		this.width(width);
	};

	TreeView.prototype.resizeToFitContent = function (e) {
		e.preventDefault();

		this.width(1);
		this.width(this.list.outerWidth());
	};

	return TreeView;
})(ScrollView);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy90cmVlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxTQUFTLEdBQUcsQ0FBQSxHQUFFLENBQUMsY0FBYztJQUNoQyxTQUFTLEdBQUcsU0FBWixTQUFTLENBQVksS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUFFLE1BQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQUUsTUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQUUsQUFBQyxTQUFTLElBQUksR0FBRztBQUFFLE1BQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0VBQUUsQUFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQUFBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsQUFBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQUFBQyxPQUFPLEtBQUssQ0FBQztDQUFFO0lBQy9SLENBQUMsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLGFBQWEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7SUFDM0MsVUFBVSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQzs7QUFFekQsU0FBUyxhQUFhLEdBQUk7QUFDekIsS0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEs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ZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG5cdF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuXHQkID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKS4kLFxuXHREaXJlY3RvcnlWaWV3ID0gcmVxdWlyZSgnLi9kaXJlY3RvcnktdmlldycpLFxuXHRTY3JvbGxWaWV3ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKS5TY3JvbGxWaWV3O1xuXG5mdW5jdGlvbiBoaWRlTG9jYWxUcmVlICgpIHtcblx0aWYgKGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXNbJ3RyZWUtdmlldyddICYmIGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXNbJ3RyZWUtdmlldyddLm1haW5Nb2R1bGUgJiYgYXRvbS5wYWNrYWdlcy5sb2FkZWRQYWNrYWdlc1sndHJlZS12aWV3J10ubWFpbk1vZHVsZS50cmVlVmlldylcblx0XHRhdG9tLnBhY2thZ2VzLmxvYWRlZFBhY2thZ2VzWyd0cmVlLXZpZXcnXS5tYWluTW9kdWxlLnRyZWVWaWV3LmRldGFjaCgpO1xufVxuXG5mdW5jdGlvbiBzaG93TG9jYWxUcmVlICgpIHtcblx0aWYgKGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXNbJ3RyZWUtdmlldyddICYmIGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXNbJ3RyZWUtdmlldyddLm1haW5Nb2R1bGUgJiYgYXRvbS5wYWNrYWdlcy5sb2FkZWRQYWNrYWdlc1sndHJlZS12aWV3J10ubWFpbk1vZHVsZS50cmVlVmlldylcblx0XHRhdG9tLnBhY2thZ2VzLmxvYWRlZFBhY2thZ2VzWyd0cmVlLXZpZXcnXS5tYWluTW9kdWxlLnRyZWVWaWV3LmF0dGFjaCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVWaWV3ID0gKGZ1bmN0aW9uIChwYXJlbnQpIHtcblx0X19leHRlbmRzKFRyZWVWaWV3LCBwYXJlbnQpO1xuXG5cdGZ1bmN0aW9uIFRyZWVWaWV3ICgpIHtcblx0XHRUcmVlVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuXHR9XG5cblx0VHJlZVZpZXcuY29udGVudCA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXYoe1xuXHRcdFx0J2NsYXNzJzogJ3JlbW90ZS1mdHAtdmlldyB0cmVlLXZpZXctcmVzaXplciB0b29sLXBhbmVsJyxcblx0XHRcdCdkYXRhLXNob3ctb24tcmlnaHQtc2lkZSc6IGF0b20uY29uZmlnLmdldCgndHJlZS12aWV3LnNob3dPblJpZ2h0U2lkZScpXG5cdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5kaXYoe1xuXHRcdFx0XHQnY2xhc3MnOiAnc2Nyb2xsZXInLFxuXHRcdFx0XHQnb3V0bGV0JzogJ3Njcm9sbGVyJ1xuXHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aGlzLm9sKHtcblx0XHRcdFx0XHQnY2xhc3MnOiAnZnVsbC1tZW51IGxpc3QtdHJlZSBoYXMtY29sbGFwc2FibGUtY2hpbGRyZW4gZm9jdXNhYmxlLXBhbmVsJyxcblx0XHRcdFx0XHQndGFiaW5kZXgnOiAtMSxcblx0XHRcdFx0XHQnb3V0bGV0JzogJ2xpc3QnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMuZGl2KHtcblx0XHRcdFx0J2NsYXNzJzogJ3Jlc2l6ZS1oYW5kbGUnLFxuXHRcdFx0XHQnb3V0bGV0JzogJ2hvcml6b250YWxSZXNpemUnXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuZGl2KHtcblx0XHRcdFx0J2NsYXNzJzogJ3F1ZXVlIHRvb2wtcGFuZWwgcGFuZWwtYm90dG9tJyxcblx0XHRcdFx0J3RhYmluZGV4JzogLTEsXG5cdFx0XHRcdCdvdXRsZXQnOiAncXVldWUnXG5cdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoaXMudWwoe1xuXHRcdFx0XHRcdCdjbGFzcyc6ICdwcm9ncmVzcyB0b29sLXBhbmVsIHBhbmVsLXRvcCcsXG5cdFx0XHRcdFx0J3RhYmluZGV4JzogLTEsXG5cdFx0XHRcdFx0J291dGxldCc6ICdwcm9ncmVzcydcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMudWwoe1xuXHRcdFx0XHRcdCdjbGFzcyc6ICdsaXN0Jyxcblx0XHRcdFx0XHQndGFiaW5kZXgnOiAtMSxcblx0XHRcdFx0XHQnb3V0bGV0JzogJ2RlYnVnJ1xuXHRcdFx0XHR9KVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kaXYoe1xuXHRcdFx0XHRcdCdjbGFzcyc6ICdyZXNpemUtaGFuZGxlJyxcblx0XHRcdFx0XHQnb3V0bGV0JzogJ3ZlcnRpY2FsUmVzaXplJ1xuXHRcdFx0XHR9KVxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMuZGl2KHtcblx0XHRcdFx0J2NsYXNzJzogJ29mZmxpbmUnLFxuXHRcdFx0XHQndGFiaW5kZXgnOiAtMSxcblx0XHRcdFx0J291dGxldCc6ICdvZmZsaW5lJ1xuXHRcdFx0fSk7XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHZhciBlbGFwc2VkVGltZSA9IGZ1bmN0aW9uIChtcykge1xuXHRcdHZhciBkYXlzID0gTWF0aC5mbG9vcihtcyAvIDg2NDAwMDAwKTtcblx0XHRtcyAlPSA4NjQwMDAwMDtcblx0XHR2YXIgaG91cnMgPSBNYXRoLmZsb29yKG1zIC8gMzYwMDAwMCk7XG5cdFx0bXMgJT0gMzYwMDAwMDtcblx0XHR2YXIgbWlucyA9IE1hdGguZmxvb3IobXMgLyA2MDAwMCk7XG5cdFx0bXMgJT0gNjAwMDA7XG5cdFx0dmFyIHNlY3MgPSBNYXRoLmZsb29yKG1zIC8gMTAwMCk7XG5cdFx0bXMgJT0gMTAwMDtcblxuXHRcdHJldHVybiAoKGRheXMgPyBkYXlzICsgJ2QgJyA6ICcnKSArXG5cdFx0XHRcdChob3VycyA/ICgoZGF5cykgJiYgaG91cnMgPCAxMCA/ICcwJyA6ICcnKSArIGhvdXJzICsgJ2ggJyA6ICcnKSArXG5cdFx0XHRcdChtaW5zID8gKChkYXlzIHx8IGhvdXJzKSAmJiBtaW5zIDwgMTAgPyAnMCcgOiAnJykgKyBtaW5zICsgJ20gJyA6ICcnKSArXG5cdFx0XHRcdChzZWNzID8gKChkYXlzIHx8IGhvdXJzIHx8IG1pbnMpICYmIHNlY3MgPCAxMCA/ICcwJyA6ICcnKSArIHNlY3MgKyAncyAnIDogJycpKS5yZXBsYWNlKC9eW2RobXNdXFxzKy8sICcnKS5yZXBsYWNlKC9bZGhtc11cXHMrW2RobXNdL2csICcnKS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXHMrJC8sICcnKSB8fCAnMHMnO1xuXHR9XG5cblx0VHJlZVZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcblx0XHRUcmVlVmlldy5fX3N1cGVyX18uaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0Ly9zZWxmLmFkZENsYXNzKGF0b20uY29uZmlnLmdldCgndHJlZS12aWV3LnNob3dPblJpZ2h0U2lkZScpID8gJ3BhbmVsLXJpZ2h0JyA6ICdwYW5lbC1sZWZ0Jyk7XG5cblx0XHRzZWxmLm9mZmxpbmUuaHRtbCgnPHA+PGEgcm9sZT1cImNvbm5lY3RcIj5Db25uZWN0PC9hPiwgPGJyIC8+PGEgcm9sZT1cImNvbmZpZ3VyZVwiPmVkaXQgY29uZmlndXJhdGlvbjwvYT4gb3IgPGJyIC8+PGEgcm9sZT1cInRvZ2dsZVwiPmNsb3NlIHBhbmVsPGE+PC9wPicpO1xuXHRcdGlmIChhdG9tLnByb2plY3QucmVtb3RlZnRwLmlzQ29ubmVjdGVkKCkpXG5cdFx0XHRzZWxmLnNob3dPbmxpbmUoKTtcblx0XHRlbHNlXG5cdFx0XHRzZWxmLnNob3dPZmZsaW5lKCk7XG5cblx0XHRzZWxmLnJvb3QgPSBuZXcgRGlyZWN0b3J5VmlldyhhdG9tLnByb2plY3QucmVtb3RlZnRwLnJvb3QpO1xuXHRcdHNlbGYucm9vdC5leHBhbmQoKTtcblx0XHRzZWxmLmxpc3QuYXBwZW5kKHNlbGYucm9vdCk7XG5cblx0XHQvL3NlbGYuYXR0YWNoKCk7XG5cblx0XHQvLyBFdmVudHNcblx0XHRhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgndHJlZS12aWV3LnNob3dPblJpZ2h0U2lkZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChzZWxmLmlzVmlzaWJsZSgpKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHNlbGYuZGV0YWNoKCk7XG5cdFx0XHRcdFx0c2VsZi5hdHRhY2goKTtcblx0XHRcdFx0fSwgMSlcblx0XHRcdH1cblx0XHR9KTtcblx0XHRhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnUmVtb3RlLUZUUC5oaWRlTG9jYWxXaGVuRGlzcGxheWVkJywgZnVuY3Rpb24gKHZhbHVlcykge1xuXHRcdFx0aWYgKHZhbHVlcy5uZXdWYWx1ZSkge1xuXHRcdFx0XHRpZiAoc2VsZi5pc1Zpc2libGUoKSkge1xuXHRcdFx0XHRcdGhpZGVMb2NhbFRyZWUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHNlbGYuaXNWaXNpYmxlKCkpIHtcblx0XHRcdFx0XHRzZWxmLmRldGFjaCgpO1xuXHRcdFx0XHRcdHNob3dMb2NhbFRyZWUoKTtcblx0XHRcdFx0XHRzZWxmLmF0dGFjaCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNob3dMb2NhbFRyZWUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5vbignZGVidWcnLCBmdW5jdGlvbiAobXNnKSB7XG5cdFx0XHRzZWxmLmRlYnVnLnByZXBlbmQoJzxsaT4nK21zZysnPC9saT4nKTtcblx0XHRcdHZhciBjaGlsZHJlbiA9IHNlbGYuZGVidWcuY2hpbGRyZW4oKTtcblx0XHRcdGlmIChjaGlsZHJlbi5sZW5ndGggPiAyMClcblx0XHRcdFx0Y2hpbGRyZW4ubGFzdCgpLnJlbW92ZSgpO1xuXHRcdH0pO1xuXHRcdGF0b20ucHJvamVjdC5yZW1vdGVmdHAub24oJ3F1ZXVlLWNoYW5nZWQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxmLnByb2dyZXNzLmVtcHR5KCk7XG5cblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0aWYgKGF0b20ucHJvamVjdC5yZW1vdGVmdHAuX2N1cnJlbnQpXG5cdFx0XHRcdHF1ZXVlLnB1c2goYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5fY3VycmVudCk7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGF0b20ucHJvamVjdC5yZW1vdGVmdHAuX3F1ZXVlLmxlbmd0aDsgaSA8IGw7ICsraSlcblx0XHRcdFx0cXVldWUucHVzaChhdG9tLnByb2plY3QucmVtb3RlZnRwLl9xdWV1ZVtpXSk7XG5cblx0XHRcdGlmIChxdWV1ZS5sZW5ndGggPT0gMClcblx0XHRcdFx0c2VsZi5wcm9ncmVzcy5oaWRlKCk7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2VsZi5wcm9ncmVzcy5zaG93KCk7XG5cblx0XHRcdFx0cXVldWUuZm9yRWFjaChmdW5jdGlvbiAocXVldWUpIHtcblx0XHRcdFx0XHR2YXIgJGxpID0gJCgnPGxpPjxwcm9ncmVzcyBjbGFzcz1cImlubGluZS1ibG9ja1wiIC8+PGRpdiBjbGFzcz1cIm5hbWVcIj4nKyBxdWV1ZVswXSArJzwvZGl2PjxkaXYgY2xhc3M9XCJldGFcIj4tPC9kaXY+PC9saT4nKSxcblx0XHRcdFx0XHRcdCRwcm9ncmVzcyA9ICRsaS5jaGlsZHJlbigncHJvZ3Jlc3MnKSxcblx0XHRcdFx0XHRcdCRldGEgPSAkbGkuY2hpbGRyZW4oJy5ldGEnKSxcblx0XHRcdFx0XHRcdHByb2dyZXNzID0gcXVldWVbMl07XG5cdFx0XHRcdFx0c2VsZi5wcm9ncmVzcy5hcHBlbmQoJGxpKTtcblxuXHRcdFx0XHRcdHByb2dyZXNzLm9uKCdwcm9ncmVzcycsIGZ1bmN0aW9uIChwZXJjZW50KSB7XG5cdFx0XHRcdFx0XHRpZiAocGVyY2VudCA9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHQkcHJvZ3Jlc3MucmVtb3ZlQXR0cignbWF4JykucmVtb3ZlQXR0cigndmFsdWUnKTtcblx0XHRcdFx0XHRcdFx0JGV0YS50ZXh0KCctJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQkcHJvZ3Jlc3MuYXR0cignbWF4JywgMTAwKS5hdHRyKCd2YWx1ZScsIHBhcnNlSW50KHBlcmNlbnQgKiAxMDAsIDEwKSk7XG5cdFx0XHRcdFx0XHRcdHZhciBldGEgPSBwcm9ncmVzcy5nZXRFdGEoKTtcblx0XHRcdFx0XHRcdFx0JGV0YS50ZXh0KGVsYXBzZWRUaW1lKGV0YSkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHByb2dyZXNzLm9uY2UoJ2RvbmUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRwcm9ncmVzcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3Byb2dyZXNzJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHRzZWxmLm9mZmxpbmUub24oJ2NsaWNrJywgJ1tyb2xlPVwiY29ubmVjdFwiXScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRhdG9tLnByb2plY3QucmVtb3RlZnRwLnJlYWRDb25maWcoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRhdG9tLnByb2plY3QucmVtb3RlZnRwLmNvbm5lY3QoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHNlbGYub2ZmbGluZS5vbignY2xpY2snLCAnW3JvbGU9XCJjb25maWd1cmVcIl0nLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0YXRvbS53b3Jrc3BhY2Uub3BlbihhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKCcuZnRwY29uZmlnJykpO1xuXHRcdH0pO1xuXHRcdHNlbGYub2ZmbGluZS5vbignY2xpY2snLCAnW3JvbGU9XCJ0b2dnbGVcIl0nLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0c2VsZi50b2dnbGUoKTtcblx0XHR9KTtcblx0XHRzZWxmLmhvcml6b250YWxSZXNpemUub24oJ2RibGNsaWNrJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5yZXNpemVUb0ZpdENvbnRlbnQoZSk7IH0pO1xuXHRcdHNlbGYuaG9yaXpvbnRhbFJlc2l6ZS5vbignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5yZXNpemVIb3Jpem9udGFsU3RhcnRlZChlKTsgfSk7XG5cdFx0c2VsZi52ZXJ0aWNhbFJlc2l6ZS5vbignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHsgc2VsZi5yZXNpemVWZXJ0aWNhbFN0YXJ0ZWQoZSk7IH0pO1xuXG5cdFx0YXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5vbignY29ubmVjdGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZi5zaG93T25saW5lKCk7XG5cdFx0fSk7XG5cdFx0Ly9hdG9tLnByb2plY3QucmVtb3RlZnRwLm9uKCdjbG9zZWQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0YXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5vbignZGlzY29ubmVjdGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZi5zaG93T2ZmbGluZSgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdFRyZWVWaWV3LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKGF0b20uY29uZmlnLmdldCgndHJlZS12aWV3LnNob3dPblJpZ2h0U2lkZScpKSB7XG5cdFx0XHR0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbCh7aXRlbTogdGhpc30pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTGVmdFBhbmVsKHtpdGVtOiB0aGlzfSk7XG5cdFx0fVxuXG5cdFx0aWYgKGF0b20uY29uZmlnLmdldCgnUmVtb3RlLUZUUC5oaWRlTG9jYWxXaGVuRGlzcGxheWVkJykpXG5cdFx0XHRoaWRlTG9jYWxUcmVlKCk7XG5cdFx0ZWxzZVxuXHRcdFx0c2hvd0xvY2FsVHJlZSgpO1xuXHR9XG5cblx0VHJlZVZpZXcucHJvdG90eXBlLmRldGFjaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRUcmVlVmlldy5fX3N1cGVyX18uZGV0YWNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cblx0XHRpZiAodGhpcy5wYW5lbCkge1xuXHRcdFx0dGhpcy5wYW5lbC5kZXN0cm95KCk7XG5cdFx0XHR0aGlzLnBhbmVsID0gbnVsbDtcblx0XHR9XG5cblx0XHRzaG93TG9jYWxUcmVlKCk7XG5cdH1cblxuXHRUcmVlVmlldy5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLmlzVmlzaWJsZSgpKSB7XG5cdFx0XHR0aGlzLmRldGFjaCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmF0dGFjaCgpO1xuXHRcdH1cblx0fVxuXG5cdFRyZWVWaWV3LnByb3RvdHlwZS5zaG93T2ZmbGluZSA9IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmxpc3QuaGlkZSgpO1xuXHRcdHRoaXMucXVldWUuaGlkZSgpO1xuXHRcdHRoaXMub2ZmbGluZS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuXHR9XG5cblx0VHJlZVZpZXcucHJvdG90eXBlLnNob3dPbmxpbmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5saXN0LnNob3coKTtcblx0XHR0aGlzLnF1ZXVlLnNob3coKTtcblx0XHR0aGlzLm9mZmxpbmUuaGlkZSgpO1xuXHR9XG5cblx0VHJlZVZpZXcucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbiAocGF0aCkge1xuXHRcdHZhciB2aWV3ID0gJCgnLnJlbW90ZS1mdHAtdmlldyBbZGF0YS1wYXRoPVwiJysgcGF0aCArJ1wiXScpLm1hcChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB2ID0gJCh0aGlzKS52aWV3KCk7XG5cdFx0XHRcdHJldHVybiB2ID8gdiA6IG51bGxcblx0XHRcdH0pLmdldCgwKTtcblxuXHRcdHJldHVybiB2aWV3O1xuXHR9XG5cblx0VHJlZVZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2aWV3cyA9ICQoJy5yZW1vdGUtZnRwLXZpZXcgLnNlbGVjdGVkJykubWFwKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHYgPSAkKHRoaXMpLnZpZXcoKTtcblx0XHRcdFx0cmV0dXJuIHYgPyB2IDogbnVsbFxuXHRcdFx0fSkuZ2V0KCk7XG5cblx0XHRyZXR1cm4gdmlld3M7XG5cdH1cblxuXHRUcmVlVmlldy5wcm90b3R5cGUucmVzaXplVmVydGljYWxTdGFydGVkID0gZnVuY3Rpb24gKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR0aGlzLnJlc2l6ZUhlaWdodFN0YXJ0ID0gdGhpcy5xdWV1ZS5oZWlnaHQoKTtcblx0XHR0aGlzLnJlc2l6ZU1vdXNlU3RhcnQgPSBlLnBhZ2VZO1xuXHRcdCQoZG9jdW1lbnQpLm9uKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZVZlcnRpY2FsVmlldy5iaW5kKHRoaXMpKTtcblx0XHQkKGRvY3VtZW50KS5vbignbW91c2V1cCcsIHRoaXMucmVzaXplVmVydGljYWxTdG9wcGVkKTtcblx0fVxuXG5cdFRyZWVWaWV3LnByb3RvdHlwZS5yZXNpemVWZXJ0aWNhbFN0b3BwZWQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0ZGVsZXRlIHRoaXMucmVzaXplSGVpZ2h0U3RhcnQ7XG5cdFx0ZGVsZXRlIHRoaXMucmVzaXplTW91c2VTdGFydDtcblx0XHQkKGRvY3VtZW50KS5vZmYoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplVmVydGljYWxWaWV3KTtcblx0XHQkKGRvY3VtZW50KS5vZmYoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZVZlcnRpY2FsU3RvcHBlZCk7XG5cdH1cblxuXHRUcmVlVmlldy5wcm90b3R5cGUucmVzaXplVmVydGljYWxWaWV3ID0gZnVuY3Rpb24gKGUpIHtcblx0XHRpZiAoZS53aGljaCAhPT0gMSlcblx0XHRcdHJldHVybiB0aGlzLnJlc2l6ZVN0b3BwZWQoKTtcblxuXHRcdHZhciBkZWx0YSA9IGUucGFnZVkgLSB0aGlzLnJlc2l6ZU1vdXNlU3RhcnQsXG5cdFx0XHRoZWlnaHQgPSBNYXRoLm1heCgyNiwgdGhpcy5yZXNpemVIZWlnaHRTdGFydCAtIGRlbHRhKTtcblxuXHRcdHRoaXMucXVldWUuaGVpZ2h0KGhlaWdodCk7XG5cdFx0dGhpcy5zY3JvbGxlci5jc3MoJ2JvdHRvbScsIGhlaWdodCArICdweCcpO1xuXHR9XG5cblx0VHJlZVZpZXcucHJvdG90eXBlLnJlc2l6ZUhvcml6b250YWxTdGFydGVkID0gZnVuY3Rpb24gKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR0aGlzLnJlc2l6ZVdpZHRoU3RhcnQgPSB0aGlzLndpZHRoKCk7XG5cdFx0dGhpcy5yZXNpemVNb3VzZVN0YXJ0ID0gZS5wYWdlWDtcblx0XHQkKGRvY3VtZW50KS5vbignbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVIb3Jpem9udGFsVmlldy5iaW5kKHRoaXMpKTtcblx0XHQkKGRvY3VtZW50KS5vbignbW91c2V1cCcsIHRoaXMucmVzaXplSG9yaXpvbnRhbFN0b3BwZWQpO1xuXHR9XG5cblx0VHJlZVZpZXcucHJvdG90eXBlLnJlc2l6ZUhvcml6b250YWxTdG9wcGVkID0gZnVuY3Rpb24gKCkge1xuXHRcdGRlbGV0ZSB0aGlzLnJlc2l6ZVdpZHRoU3RhcnQ7XG5cdFx0ZGVsZXRlIHRoaXMucmVzaXplTW91c2VTdGFydDtcblx0XHQkKGRvY3VtZW50KS5vZmYoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplSG9yaXpvbnRhbFZpZXcpO1xuXHRcdCQoZG9jdW1lbnQpLm9mZignbW91c2V1cCcsIHRoaXMucmVzaXplSG9yaXpvbnRhbFN0b3BwZWQpO1xuXHR9XG5cblx0VHJlZVZpZXcucHJvdG90eXBlLnJlc2l6ZUhvcml6b250YWxWaWV3ID0gZnVuY3Rpb24gKGUpIHtcblx0XHRpZiAoZS53aGljaCAhPT0gMSlcblx0XHRcdHJldHVybiB0aGlzLnJlc2l6ZVN0b3BwZWQoKTtcblxuXHRcdHZhciBkZWx0YSA9IGUucGFnZVggLSB0aGlzLnJlc2l6ZU1vdXNlU3RhcnQsXG5cdFx0XHR3aWR0aCA9IE1hdGgubWF4KDUwLCB0aGlzLnJlc2l6ZVdpZHRoU3RhcnQgKyBkZWx0YSk7XG5cblx0XHR0aGlzLndpZHRoKHdpZHRoKTtcblx0fVxuXG5cdFRyZWVWaWV3LnByb3RvdHlwZS5yZXNpemVUb0ZpdENvbnRlbnQgPSBmdW5jdGlvbiAoZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHRoaXMud2lkdGgoMSk7XG5cdFx0dGhpcy53aWR0aCh0aGlzLmxpc3Qub3V0ZXJXaWR0aCgpKTtcblx0fVxuXG5cdHJldHVybiBUcmVlVmlldztcblxufSkoU2Nyb2xsVmlldylcbiJdfQ==