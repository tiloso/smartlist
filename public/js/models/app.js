
define( function( require, exports, module ) {
  var Backbone = require( 'backbone' )
    , configHelper = require( 'helper/config' )
    , dateHelper = require( 'helper/date' )


  module.exports = Backbone.Model.extend({
    initialize: function () {
      this.todayNum = dateHelper.getTodayNum()
      this.populateDays()
      this.dateWatch( this )
    }

  , populateDays: function () {
      var days = this.get( 'days' )
      days.populate( this.get( 'dayCount' ), this.todayNum )
    }

  , dateWatch: function ( that ) {
      var dayChangeDist = that.todayNum + configHelper.dayNum - Date.now()
      if ( dayChangeDist < 30000 ) {
        dayChangeDist = ( dayChangeDist < 0 ) ? 1000 : dayChangeDist
        setTimeout( that.resetTodayNum, dayChangeDist, that )
      }
      setTimeout( that.dateWatch, 30000, that )
    }

  , resetTodayNum: function ( that ) {
      that.todayNum = dateHelper.getTodayNum()
      that.populateDays( that.get( 'dayCount' ), that.todayNum )
    }
  })
})

