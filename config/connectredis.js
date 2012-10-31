
var connectRedis = require( 'connect-redis' )
  , url = require( 'url' )
  , Exceptional = require( './exceptional' )


var getRedisConf = function () {
  if ( !process.env.REDISTOGO_URL ) return {}

  var redisUrl = url.parse( process.env.REDISTOGO_URL )
    , redisAuth = redisUrl.auth.split( ':' )

  return { host: redisUrl.hostname
         , port: redisUrl.port
         , db: redisAuth[0]
         , pass: redisAuth[1] }
}


var handle = function ( er ) {
  console.log( er )
  Exceptional.handle( er )
}


exports.init = function ( express ) {
  RedisStore = connectRedis( express )
  var redisDB = new RedisStore( getRedisConf())

  redisDB.client.on( 'error', handle )

  return redisDB
}

