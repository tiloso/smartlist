
var check = require( 'validator' ).check
  , bcrypt = require( 'bcrypt' )

  , couchDB = require( '../config/couchdb' )
  , passport = require( '../config/passport' )
  , Exceptional = require( '../config/exceptional' )

  , session = require( './session' )



exports.validate = function ( req, res, next ) {
  var user = req.body
    , errors = []

  try {
    check( user.email, 'Please enter a valid email address.' ).len( 6, 64 ).isEmail()
  } catch ( e ) {
    errors.push( e.message )
  }

  try {
    check( user.password, 'Please enter a valid password.' ).len( 3, 64 )
  } catch ( e ) {
    errors.push( e.message )
  }

  if ( errors.length ) {
    req.flash( 'error', errors.join( ' ' ))
    return res.redirect( '/register' )
  }

  req.user = { email: user.email, password: user.password }
  next()
}


var createInitialTask = function ( user_id ) {
  var task = { user_id: user_id
             , date: Date.now()
             , title: 'First time on here? Click \'how it works\' to get started.'
             , position: 0 }
  couchDB.insert( task, function ( er, succ ) {
    if ( er ) Exceptional.handle( er )
  })
}



exports.create = function ( req, res, next ) {
  var newUser = { email: req.user.email.toLowerCase()
                , created_at: Date.now() }
    , password = req.user.password

  couchDB.view( 'users', 'by_email'
         , { key: newUser.email }
         , function ( er, body ) {
    if ( er ) return next( er )

    if ( body.rows[0] ) {
      req.flash( 'error', 'user already exists.' )
      return res.redirect( '/register' )
    }

    bcrypt.genSalt( 11, function ( er, salt ) {
      bcrypt.hash( password, salt, function ( er, hash ) {
        newUser.pwhash = hash

        couchDB.insert( newUser, function ( er, user ) {
          if ( er ) return next( er )

          createInitialTask( user.id )

          req.body = { email: newUser.email, password: password }
          next()
        })
      })
    })
  })
}


exports.register = function ( req, res ) {
  res.render( 'start', { title: 'Register'
                       , msg: req.flash( 'error' )})
}




exports.validatePassword = function ( req, res ) {
  res.render( 'destroy', { msg: req.flash( 'error' )})
}


exports.authorize = function ( req, res, next ) {
  var pw = req.body.password

  couchDB.get( req.user.id, function ( er, body ) {
    if ( er ) return next( new Error( er ))
    req.user.rev = body._rev
    bcrypt.compare( pw, body.pwhash, function ( er, didSucceed ) {
      if ( er ) return next( new Error( er ))
      if ( !didSucceed ) {
        req.flash( 'error', 'wrong password.' )
        return res.redirect( '/destroy' )
      }
      next()
    })
  })
}

exports.destroyTasks = function ( req, res, next ) {
  couchDB.view( 'tasks', 'by_userid', { key: req.user.id }
         , function ( er, result ) {
    if ( er ) return next( er )

    var tasks = result.rows.map( function ( doc ) {
      return { _id: doc.id, _rev: doc.value[3], _deleted: true }
    })

    couchDB.bulk({ docs: tasks }, function ( er, response ) {
      if ( er ) return next( er )
      next()
    })
  })
}

exports.destroy = function ( req, res, next ) {
  couchDB.destroy( req.user.id, req.user.rev, function ( er, body ) {
    if ( er ) return next( er )
    next()
  })
}


exports.isAuthenticated = function ( req , res, next ) {
  if ( req.isAuthenticated()) return next()
  var accept = req.headers.accept || ''
  if ( ~accept.indexOf( 'json' )) {
    req.succ = { redirect: '/login' }
    return next( new Error( 'not authenticated' ))
  }
  res.redirect( '/login' )
}

