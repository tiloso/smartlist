
var Measured = require( 'measured' )
  , librato = require( '../config/librato' )


var collection = new Measured.Collection( 'http' )
  , rps = collection.meter( 'requestsPerSecond' )


exports.collect = function ( req, res, next ) {
  rps.mark()
  next()
}

exports.initSubmission = function () {
  setInterval( function () { librato.send( rps )}, 30000 )
}

