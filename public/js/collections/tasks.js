
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , Task = require( 'models/task' )


  module.exports = Backbone.Collection.extend({
    model: Task

  , comparator: function ( model ) {
      return -model.get( 'position' )
    }

  , initialize: function () {
      this.on( 'add', this.checkConsistency, this )
      this.on( 'positionChange', this.positionChange, this )
    }

  , positionChange: function () {
      this.sort({ silent: true })
      this.checkConsistency()
    }

  , checkConsistency: function ( added ) {
      var inconsistent = []
      for ( var i = 0; i < this.length; i++ ) {
        var task = this.at( i )
        var position = this.length - ( i + 1 )
        if ( task.get( 'position' ) !== position || task === added ) {
          task.set({ position: position })
          inconsistent.push( task )
        }
      }
      inconsistent.forEach( function ( task ) {
        task.save()
      })
      this.trigger( 'reset' )
    }
  })
})

