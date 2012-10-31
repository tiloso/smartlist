
var passport = require( '../config/passport' )

exports.new = function ( req, res ) {
  res.render( 'start', { title: 'Login'
                       , msg: req.flash( 'error' )})
}



var lowerCase = function ( req, res, next ) {
  if ( req.body && req.body.email ) {
    req.body.email = req.body.email.toLowerCase()
  }
  next()
}


var createSession = function ( path ) {
  return passport.authenticate(
    'local', { successRedirect: '/app'
             , failureRedirect: path
             , failureFlash: true }
  )
}


exports.create = function ( path ) {
  return [ lowerCase, createSession( path )]
}



exports.destroy = function ( req, res ) {
  req.logOut()
  res.redirect( '/login' )
}

