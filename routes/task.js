
var couchDB = require( '../config/couchdb' )



exports.getAll = function ( req, res, next ) {
  couchDB.view( 'tasks', 'by_userid', { key: req.user.id }
         , function ( er, result ) {
    if ( er ) return next( new Error( er ))

    var tasks = result.rows.map( function ( task ) {
      return { id: task.id
             , date: task.value[0]
             , title: task.value[1]
             , position: task.value[2]
             , rev: task.value[3] }
    })
    tasks.sort( function ( a, b ) {
      return a.date - b.date
    })

    req.succ = { data: tasks }
    next()
  })
}


exports.validate = function ( type ) {
  return function ( req, res, next ) {
    var task = {}
    if ( type == 'update' ) {
      task._id = req.body.id
      task._rev = req.body.rev

      if ( !task._id ) return next( new Error( '_id missing' ))
      if ( !task._rev ) return next( new Error( '_rev missing' ))
    } else {
      task.created_at = Date.now()
    }

    task.user_id = req.user.id
    task.date = req.body.date
    task.title = req.body.title
    task.position = req.body.position

    if ( !task.title ) return next( new Error( 'title missing' ))
    if ( typeof( task.title ) !== 'string' )
      return next( new Error( 'invalid title format' ))
    if ( task.title.length > 140 )
      return next( new Error( 'title is too long' ))

    if ( !task.date ) return next( new Error( 'date required' ))
    // std.-date for '#later': 2200.0.1
    if ( !( 0 < task.date && task.date <  4512668400000
            || task.date == 7258114800000 ))
      return next( new Error( 'invalid date format' ))

    if ( !task.user_id ) return next( new Error( 'user_id is missing' ))
    if ( typeof( task.user_id ) !== 'string' )
      return next( new Error( 'invalid user_id format' ))
    if ( task.position == undefined || task.position == null )
      return next( new Error( 'position is missing' ))

    req.task = task
    next()
  }
}


exports.save = function ( req, res, next ) {
  couchDB.insert( req.task, function ( er, succ ) {
    if ( er ) return next(  er )
    req.succ = { data: { id: succ.id, rev: succ.rev }}
    next()
  })
}


exports.destroy = function ( req, res, next ) {
  couchDB.destroy( req.params.id
            , req.body.rev
            , function ( er, succ ) {
                if ( er ) return next( er )
                req.succ = { data: succ }
                next()
  })
}


exports.isUserAuthorized = function ( req, res, next ) {
  if ( req.body.id && req.body.id !== req.params.id ) {
    return next( new Error( 'body.id !== params.id' ))
  }

  couchDB.get( req.params.id, function ( er, body ) {
    if ( er ) return next( new Error( er ))
    if ( req.user.id !== body.user_id ) {
      return next( new Error( 'authorization failed' ))
    }
    next()
  })
}


exports.sendJSON = function ( req, res ) {
  res.json( req.succ )
}

