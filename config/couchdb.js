
var couchURL = process.env.CLOUDANT_URL ||
                  'http://localhost:5984'


var nano = require( 'nano' )( couchURL )
  , couchDB = nano.db.use( 'smartlist' )


exports = module.exports = couchDB

