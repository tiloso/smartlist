
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , TasksView = require( 'views/tasks.v' )
    , template = require( 'lib/text!../../templates/day.html!strip' )
    , configHelper = require( 'helper/config' )


  module.exports = Backbone.View.extend({
    className: 'day'

  , template: _.template( template )

  , render: function () {
      this.$el.html( this.template( this.model.toJSON()))
      this.renderTasks()
      this.$( '.label' ).droppable(
        configHelper.droppable( this.model.get( 'date' ))
      )
      return this
    }

  , renderTasks: function () {
      var tasksView = new TasksView({
        collection: this.model.get( 'tasks' )
      })
      this.$el.append( tasksView.render().el )
    }
  })
})

