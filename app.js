
var express = require( 'express' )
  , http = require( 'http' )
  , flash = require( 'connect-flash' )

  , passport = require( './config/passport' )
  , Exceptional = require( './config/exceptional' )
  , connectRedis = require( './config/connectredis' )

  , metrics = require( './middleware/metrics' )
  , middleware = require( './middleware' )

  , router = require( './routes' )



var app = module.exports = express()
  , redisDB = connectRedis.init( express )

app.configure( function () {
  app.use( metrics.collect )
  app.use( express.bodyParser())
  app.use( express.cookieParser())
  app.use( express.session({ store: redisDB
                           , cookie: { maxAge: 2592000000 }
                           , secret: "rosenthaler" }))
  app.use( flash())
  app.use( passport.initialize())
  app.use( passport.session())
  app.use( app.router )
  app.set( 'views', __dirname + '/views' )
  app.set( 'view engine', 'jade' )
  app.use( express.static( __dirname + '/public' ))
  app.use( middleware.handleErrors )
})


router( app )
metrics.initSubmission()


/* domains */
process.on( 'uncaughtException', function ( er ) {
  console.error( 'uncaughtException: ', er.message )
  console.error( er.stack )
  Exceptional.handle( er )
  process.exit( 1 )
})



var port = process.env.PORT || 3000
  , server = http.createServer( app )

server.listen( port, function () {
  console.log( 'Express server listening on port %d in %s mode'
             , port
             , app.settings.env )
})

