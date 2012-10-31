
var Exceptional = require( '../config/exceptional' )


exports.handleErrors = function ( er, req, res, next ) {
  Exceptional.handle( er )
  var accept = req.headers.accept || ''
  if ( ~accept.indexOf( 'json' )) {
    return res.json( req.succ ||
                     { er: [ 'Something went wrong. Please reload'
                           , 'the page and try again.' ].join(' ')
                     })
  }
  if ( er.status ) res.statusCode = er.status
  if ( res.statusCode < 400 ) res.statusCode = 500
  res.setHeader( 'Content-Type', 'text/html; charset=utf-8' )
  res.render( '500', { error: 'Something went wrong.' })
}

