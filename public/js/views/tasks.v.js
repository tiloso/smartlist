
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , TaskView = require( 'views/task.v' )
    , backboneHelper = require( 'helper/backbone' )


  module.exports = Backbone.View.extend({
    className: 'tasks'

  , initialize: function () {
      this.collection.on( 'reset', this.render, this )
    }

  , render: function () {
      this.$el.empty()
      this.addAll()
      return this
    }

  , addOne: function ( model ) {
      var taskView = new TaskView({ model: model })
      this.$el.append( taskView.render().el )
    }

  , addAll: function () {
      this.collection.each( this.addOne, this )
      backboneHelper.event.trigger( 'howto' )
    }
  })
})

