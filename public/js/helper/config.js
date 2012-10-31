
define( function ( require, exports ) {
  var dayNum = exports.dayNum = 86400000

  exports.weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday'
                    , 'Thursday', 'Friday', 'Saturday' ]

  exports.terms = {
    'today': function () { return Date.now() }
  , 'tomorrow': function () { return Date.now() + dayNum }
  , 'later': function () { return 7258114800000 }
  }

  exports.droppable = function ( date, position ) {
    position = position || 1000
    return { addClasses: false
           , hoverClass: 'active'
           , tolerance: 'intersect'
           , drop: function( ev, ui ) {
               var drag = $( ui.draggable ).data( 'backbone-view' )
                                           .model
               var attrs = { date: date, position: position }
               drag.evaluateChange( attrs )
             }
    }
  }

  exports.draggable = { revert: "invalid"
                      , addClasses: false
                      , cursorAt: { top: 19, left: 5 }
                      , delay: 50 }
})

