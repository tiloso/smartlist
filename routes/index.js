
var main = require( './main' )
  , task = require( './task' )
  , user = require( './user' )
  , session = require( './session' )


exports = module.exports = function ( app ) {
  app.get( '/', main.start )
  app.get( '/app/:backboneRoute?', user.isAuthenticated
                                 , task.getAll
                                 , main.app )

  app.all( '/task/:id?', user.isAuthenticated )
  app.post( '/task', task.validate( 'create' )
                   , task.save
                   , task.sendJSON )
  app.put( '/task/:id', task.isUserAuthorized
                      , task.validate( 'update' )
                      , task.save
                      , task.sendJSON )
  app.delete( '/task/:id', task.isUserAuthorized
                         , task.destroy
                         , task.sendJSON )

  app.get( '/register', user.register )
  app.post( '/register', user.validate
                       , user.create
                       , session.create( '/register' ))

  app.all( '/destroy', user.isAuthenticated )
  app.get( '/destroy', user.validatePassword )
  app.post( '/destroy', user.authorize
                      , user.destroyTasks
                      , user.destroy
                      , session.destroy )

  app.get( '/login', session.new)
  app.post( '/login', session.create( '/login' ))
  app.get( '/logout', session.destroy )

  app.get( '/health', function ( req, res ) {
    res.send({ pid: process.pid
             , memory: process.memoryUsage()
             , uptime: process.uptime()})
  })
}

