
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , template = require( 'lib/text!../../templates/howto.html!strip' )
    , backboneHelper = require( 'helper/backbone' )


  module.exports = Backbone.View.extend({
    el: $( '#howto' )

  , template: _.template( template )

  , render: function () {
      $( 'article#tasks' ).css({ 'margin': '0 190px' })
      this.$el.attr({ 'data-state': 'active' })
      var input = $( 'input#task' )
        , tasks = $( '.task' )
      var items = [ 'ht_hashtag'
                  , 'ht_add'
                  , 'ht_checkbox'
                  , 'ht_dragdrop'
                  , 'ht_edit'
                  , 'ht_destroy' ]
      var len = ( tasks.length > 12 ) ? 12 : tasks.length
      var oneThird = Math.round( len / 3 ) - 1
        , twoThird = Math.round( len / 3 * 2 ) - 1
      var el = [ input
               , input
               , tasks.eq( 0 )
               , tasks.eq( oneThird )
               , tasks.eq( twoThird )
               , tasks.eq( len - 1 )]
      var max = ( len ) ? 6 : 2
      for ( var i = 0; i < max; i++ ) {
        var item = $( this.template() )
        item.attr({ 'id': items[ i ]})
        el[ i ].before( item )
      }
      backboneHelper.event.on( 'howto', this.reset, this )
    }

  , hide: function () {
      this.$el.attr({ 'data-state': 'inactive' })
      $( '.howto' ).remove()
      $( 'article#tasks' ).css({ 'margin': '0 auto' })
      backboneHelper.event.off( 'howto' )
    }

  , reset: function () {
      this.hide()
      this.render()
    }
  })
})

