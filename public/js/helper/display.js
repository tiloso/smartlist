
define( function ( require, exports ) {
  exports.msg = function ( msg ) {
    var $el = $( '<p>' + msg + '</p>' )
    $( '#msg' ).append( $el )
    $el.delay( 10000 ).fadeOut()
  }
})

