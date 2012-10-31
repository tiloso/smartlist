
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , displayHelper = require( 'helper/display' )


  module.exports = Backbone.Model.extend({
    urlRoot: '/task'

  , validate: function ( attrs ) {
      if ( !attrs.title ) {
        displayHelper.msg( 'The task couldn\'t be saved. A title is missing.' )
        return 'error'
      }
      if ( attrs.title.length > 140 ) {
        displayHelper.msg( 'Task couldn\'t be save. The title is too long ( max 140 Chars ). ')
        return 'error'
      }
      if ( attrs.position < -1 || attrs.position > 1000 ) {
        displayHelper.msg( 'wrong position format' )
        return 'error'
      }
      if ( !attrs.date ) {
        displayHelper.msg( 'date missing' )
        return 'error'
      }
    }

  , removeFromCollection: function () {
      this.collection2.remove( this )
      this.collection.trigger( 'unassigned', this )
    }

  , evaluateChange: function ( attrs ) {
      if ( attrs.date && attrs.date !== this.get( 'date' )) {
        this.set( attrs )
        this.removeFromCollection()
        return
      }
      if ( attrs.position &&
           attrs.position !== this.get( 'position' )) {
        this.set({ position: attrs.position })
        this.collection2.trigger( 'positionChange' )
        return
      }
      if ( attrs.title &&
           attrs.title !== this.get( 'title' )) {
        this.save({ title: attrs.title })
      }
      this.trigger( 'titleChange' )
    }

  , clear: function () {
      this.destroy()
    }
  })
})

