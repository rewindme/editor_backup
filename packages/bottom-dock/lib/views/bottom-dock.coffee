{CompositeDisposable, Emitter} = require 'atom'
{View} = require 'space-pen'
TabManager = require './tab-manager'
DockPaneManager = require './dock-pane-manager'
Header = require './header'

class BottomDock extends View
  @content: (config) ->
    @div class: 'bottom-dock', =>
      @subview 'header', new Header()
      @subview 'dockPaneManager', new DockPaneManager()
      @subview 'tabManager', new TabManager()

  initialize: (config) ->
    config = config ? {}
    @subscriptions = new CompositeDisposable()
    @active = false

    @panel = @createPanel startOpen: config.startOpen
    @emitter = new Emitter()

    @subscriptions.add @tabManager.onTabClicked @changePane

  onDidFinishResizing: (callback) ->
    @header.onDidFinishResizing callback

  onDidChangePane: (callback) ->
    @emitter.on 'pane:changed', callback

  onDidDeletePane: (callback) ->
    @emitter.on 'pane:deleted', callback

  onDidAddPane: (callback) ->
    @emitter.on 'pane:added', callback

  onDidToggle: (callback) ->
    @emitter.on 'pane:toggled', callback

  addPane: (pane, title, isInitial) ->
    @dockPaneManager.addPane pane

    config =
      title: title
      id: pane.getId()
      
    if not isInitial
      @panel.show()

    @tabManager.addTab config

    if pane.isActive()
      @changePane pane.getId()
    else
      tabButton.setActive false

    @emitter.emit 'pane:added', pane.getId()

  getPane: (id) ->
    @dockPaneManager.getPane id

  getCurrentPane: ->
    @dockPaneManager.getCurrentPane()

  changePane: (id) =>
    @dockPaneManager.changePane id
    @tabManager.changeTab id
    @header.setTitle @tabManager.getCurrentTabTitle()
    @emitter.emit 'pane:changed', id

  deletePane: (id) =>
    success = @dockPaneManager.deletePane id
    return unless success

    @tabManager.deleteTab id

    if @dockPaneManager.getCurrentPane()
      @header.setTitle @tabManager.getCurrentTabTitle()
    else
      @active = false
      @toggle()

    @emitter.emit 'pane:deleted', id

  deleteCurrentPane: =>
    currentPane = @dockPaneManager.getCurrentPane()
    return unless currentPane

    @deletePane currentPane.getId()

  createPanel: ({startOpen}) ->
    @active = startOpen

    options =
      item: this,
      visible: startOpen
      priority: 1000

    return atom.workspace.addBottomPanel options

  toggle: ->
    if not @panel.isVisible() and @dockPaneManager.getCurrentPane()
      @active = true
      @panel.show()
    else
      @active = false
      @panel.hide()

    @emitter.emit 'pane:toggled', @active

  paneCount: -> @dockPaneManager.paneCount()

  destroy: ->
    @subscriptions.dispose()
    @panel.destroy()
    @header.destroy()
    @tabManager.destroy()
    @dockPaneManager.destroy()

module.exports = BottomDock
