
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , Task = require( 'models/task' )
    , configHelper = require( 'helper/config' )


  var eachDay = function ( days, cb ) {
    for ( var di = 0; di < days.length; di++ ) {
      if ( cb( days.at( di ))) break
    }
  }


  module.exports = Backbone.Collection.extend({
    model: Task
  , url: '/tasks'

  , initialize: function ( days ) {
      this.days = days

      this.on( 'reset', this.assignTasks, this )
      this.days.on( 'reset', this.assignTasks, this )

      this.on( 'add', this.assignSingleTask, this )
      this.on( 'unassigned', this.assignSingleTask, this )
    }

  , assignSingleTask: function ( task ) {
      eachDay( this.days, function ( day ) {
        if ( task.get( 'date' ) <
             day.get( 'date' ) + configHelper.dayNum ) {
          task.collection2 = day.get( 'tasks' )
          day.get( 'tasks' ).add( task )
          return true
        }
      })
    }

  , assignTasks: function () {
      var ti = 0
      for ( var di = 0; di < this.days.length; di++ ) {
        var day = this.days.at( di )
          , collection = []
        while ( ti < this.length &&
                this.at( ti ).get( 'date' ) <
                  day.get( 'date' ) + configHelper.dayNum ) {
          this.at( ti ).collection2 = day.get( 'tasks' )
          collection.push( this.at( ti ))
          ti++
        }
        day.get( 'tasks' ).reset( collection )
      }
    }
  })
})

