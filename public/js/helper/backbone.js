
define( function ( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , displayHelper = require( 'helper/display' )


  var event = exports.event = {}
  _.extend( event, Backbone.Events )



  var methodMap = { 'create': 'POST'
                  , 'update': 'PUT'
                  , 'delete': 'DELETE'
                  , 'read': 'GET' }


  var getValue = function( object, prop ) {
    if ( !( object && object[ prop ] )) return null
    return _.isFunction( object[ prop ] ) ? object[ prop ]() : object[ prop ]
  }


  exports.syncHttp = function ( method, model, options ) {
    var type = methodMap[ method ]
    options = options || {}

    var params = { type: type, dataType: 'json' }
    if ( !options.url ) {
      params.url = getValue( model, 'url' ) || urlError()
    }
    if ( !options.data && model && ( method == 'create' || method == 'update' )) {
      params.contentType = 'application/json'
      params.data = JSON.stringify( model.toJSON())
    }
    if ( !options.data && model && method == 'delete' ) {
      params.contentType = 'application/json'
      params.data = JSON.stringify({ rev: model.attributes.rev })
    }
    if ( params.type !== 'GET' && !Backbone.emulateJSON ) {
      params.processData = false
    }

    var success = options.success
    options.success = function ( resp, status, xhr ) {
      if ( resp.redirect )
        return window.location.href = resp.redirect

      if ( resp.er ) displayHelper.msg( resp.er )
      success( resp.data, status, xhr )
    }

    var error = options.error
    options.error = function ( xhr, status, errorThrown ) {
      displayHelper.msg([ 'Something went wrong. Please check your'
                        , 'internet connection and reload the page.'
                        ].join(' '))
      error( xhr, status, errorThrown )
    }
    return $.ajax( _.extend( params, options ))
  }

})

