
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , template = require( 'lib/text!../../templates/task.html!strip' )
    , dateHelper = require( 'helper/date' )
    , configHelper = require( 'helper/config' )
    , backboneHelper = require( 'helper/backbone' )


  module.exports = Backbone.View.extend({
    className:  'task'

  , template: _.template( template )

  , events: { 'click .checkbox': 'clear'
            , 'click .destroy': 'clear'
            , 'click label': 'edit'
            , 'keydown .edit': 'updateOnEnter'
            , 'blur .edit': 'getInput' }

  , initialize: function () {
      this.$el.draggable( configHelper.draggable )
      this.$el.data( 'backbone-view', this )
      this.model.on( 'titleChange', this.reset, this )
      this.model.on( 'remove', this.destroy, this )

      var position = this.model.get( 'position' ) - 0.5
      var date = this.model.get( 'date' )
      this.$el.droppable( configHelper.droppable( date, position ))
    }

  , render: function () {
      this.$el.html( this.template( this.getEditableTitle()))
      this.input = this.$( '.edit' )
      return this
    }

  , reset: function () {
      this.$el.html( this.template( this.getEditableTitle()))
      this.$el.attr( 'data-view', 'display' )
      this.delegateEvents()
    }

  , destroy: function () {
      this.remove()
      backboneHelper.event.trigger( 'howto' )
    }

  , getEditableTitle: function () {
      var copy = this.model.toJSON()
      readableDate = dateHelper.makeReadable( copy.date )
      copy.editableTitle = [copy.title, readableDate].join( ' ' )
      return copy
    }

  , edit: function () {
      this.$el.attr( 'data-view', 'editing' )
      this.input.focus()
    }

  , getInput: function () {
      var value = this.input.val()
      if ( !value ) return this.clear()
      this.model.evaluateChange( dateHelper.parseInput( value ))
    }

  , updateOnEnter: function ( e ) {
      if ( e.keyCode === 13 || e.keyCode === 27 ) {
        this.undelegateEvents()
        if ( e.keyCode === 13 ) {
          return this.getInput()
        }
        return this.reset()
      }
    }

  , evaluateChange: function ( attrs ) {
      this.model.evaluateChange( attrs )
    }

  , clear: function () {
      this.model.clear()
    }
  })
})

