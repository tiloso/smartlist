
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , Task = require( 'models/task' )
    , DaysView = require( 'views/days.v' )
    , dateHelper = require( 'helper/date' )


  module.exports = Backbone.View.extend({
    el: $( 'body' )

  , events: { 'keypress input#task': 'createOnEnter'
            , 'click #howto': 'toggleHowto' }

  , initialize: function () {
      this.$input = this.$( 'input#task' )
      this.$howto = this.$( '#howto' )
      this.daysView = new DaysView({
        collection: this.model.get( 'days' )
      })
    }

  , renderDays: function () {
      this.daysView.render()
      return this
    }

  , createOnEnter: function ( e ) {
      var inputValue = this.$input.val()
      if ( e.keyCode != 13 ) return
      if ( !inputValue ) return
      var attrs = dateHelper.parseInput( inputValue )
      attrs.position = 1000
      var task = new Task( attrs )
      this.model.get( 'unsortedTasks' ).add( task )
      this.$input.val( '' )
    }

  , toggleHowto: function () {
      var router = this.model.get( 'router' )
        , state = this.$howto.attr( 'data-state' )
      if ( state === 'inactive' ) {
        return router.navigate( 'howto', { trigger: true })
      }
      router.navigate( '', { trigger: true })
    }
  })
})

