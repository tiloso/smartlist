
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , DayView = require( 'views/day.v' )


  module.exports = Backbone.View.extend({
    el: $( 'section#days' )

  , initialize: function () {
      this.collection.on( 'reset', this.render, this )
    }

  , render: function () {
      this.$el.empty()
      this.addAll()
    }

  , addAll: function () {
      this.collection.each( this.addOne, this )
    }

  , addOne: function ( day ) {
      var view = new DayView({ model: day })
      this.$el.append( view.render().el )
    }
  })
})

