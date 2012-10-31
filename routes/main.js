
exports.app = function ( req, res ) {
  res.render( 'app', { layout: false
                     , user: req.user
                     , tasks: JSON.stringify( req.succ.data )
                     })
}

exports.start = function ( req, res ) {
  if ( req.isAuthenticated() ) {
    res.redirect( '/app' )
    return
  }
  res.render( 'start', { title: 'Register'
                       , msg: '' })
}


exports.socket = function ( req, res ) {
  res.render( 'socket', { layout: false })
}

