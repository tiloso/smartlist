
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , Day = require( 'models/day' )
    , Tasks = require( 'collections/tasks' )
    , configHelper = require( 'helper/config' )


  module.exports = Backbone.Collection.extend({
    model: Day

  , populate: function ( dayCount, todayNum ) {
      var weekday
        , currentDayNum = todayNum
        , collection = []
      for ( i = 0; i < dayCount; i++ ) {
        weekday = i ? configHelper.weekdays[ new Date( currentDayNum ).getDay() ] : 'Today'
        collection.push({ name: weekday
                        , date: currentDayNum
                        , tasks: new Tasks()})
        currentDayNum += configHelper.dayNum
      }
      collection.push({ name: 'Later'
                      , date: 7258114800000
                      , tasks: new Tasks()})
      this.reset( collection )
    }
  })
})

