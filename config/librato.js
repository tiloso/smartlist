
var Exceptional = require( './exceptional' )
  , https = require( 'https' )


var options = { host: 'metrics-api.librato.com'
              , path: '/v1/metrics'
              , method: 'POST'
              , auth: process.env.LIBRATO_AUTH || ''
              , headers: { 'Content-Type': 'application/json' }}


var libratoReq = https.request( options, function ( res ) {})


libratoReq.on( 'error', function ( e ) {
  Exceptional.handle( e )
})


exports.send = function ( rps ) {
  libratoReq.write( JSON.stringify({
    gauges: [ { name: 'requests_per_second'
              , value: rps.toJSON().currentRate }
    ]
  }))
}

