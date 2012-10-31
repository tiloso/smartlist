
var passport = require( 'passport' )
  , LocalStrategy = require( 'passport-local' ).Strategy
  , couchDB = require( './couchdb' )
  , bcrypt = require( 'bcrypt' )


var msg = 'Wrong email / password combination.'


passport.use( new LocalStrategy({
  usernameField: 'email' }
, function ( username, password, done ) {
    couchDB.view( 'users', 'by_email'
                , { key: username }
                , function ( er, res ) {
      if ( er ) return done( er.message || er )
      var user = res.rows[ 0 ]
      if ( !user ) {
        return done( null, false, { message: msg })
      }
      bcrypt.compare( password, user.value
                    , function ( er, didSucceed ) {
        if ( er ) return done( er )
        if ( !didSucceed ) {
          return done( null, false, { message: msg })
        }
        return done( null, user )
      })
    })
  }
))


passport.serializeUser( function ( user, done ) {
  done( null, user.id )
})


passport.deserializeUser( function ( id, done ) {
  couchDB.get( id, function ( er, res ) {
    if ( er ) {
      console.log( er )
      return done ( er, false )
    }
    try {
      done( er, { id: res._id, email: res.email })
    } catch ( er ) {
      console.log( JSON.stringify( er ))
      done( er, false )
    }
  })
})


exports = module.exports = passport

