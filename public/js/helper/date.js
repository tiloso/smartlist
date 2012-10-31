
define( function ( require, exports ) {
  var configHelper = require( 'helper/config' )
    , displayHelper = require( 'helper/display' )


  exports.getTodayNum = function () {
    var now = new Date()
      , today = new Date( now.getFullYear()
                        , now.getMonth()
                        , now.getDate() )
    return today.getTime()
  }


  exports.makeReadable = function ( dateNum ) {
    if ( dateNum == 7258114800000 ) return '#later'

    var date = new Date( dateNum )
    return '#'.concat([ date.getDate()
                      , date.getMonth() + 1
                      , date.getFullYear()
                      ].join( '.' ))
  }


  var parse = exports.parse = function ( dateStr ) {
    var dIs = new Date().getDate()
      , dWIs = new Date().getDay()
      , mIs = new Date().getMonth()
      , yIs = new Date().getFullYear()

    var num = dateStr.split( '.' ).filter( function ( el ) {
      return el
    })

    if ( num.length > 3 ) return [ true, null ]

    if ( num.length == 3 ) {
      if ( !( 0 < num[0] && num[0] < 32 )) return [ true, null ]
      if ( !( 0 < num[1] && num[1] < 13 )) return [ true, null ]
      if ( !( 2011 < num[2] && num[2] < 2113 )) return [ true, null ]
      return [ null, new Date( num[2], num[1] - 1, num[0] ).getTime() ]
    }

    var dayIn = parseInt( num[0], 10 )

    if ( num.length == 2 ) {
      if ( !( 0 < num[0] && num[0] < 32 )) return [ true, null ]
      if ( !( 0 < num[1] && num[1] < 13 )) return [ true, null ]

      var monthIn = parseInt( num[1], 10 ) - 1

      if ( monthIn < mIs )
        return [ null, new Date( yIs + 1, monthIn, dayIn ).getTime() ]
      if ( dayIn < dIs )
        return [ null, new Date( yIs + 1, monthIn, dayIn ).getTime() ]
      return [ null, new Date( yIs, monthIn, dayIn ).getTime() ]
    }

    if ( 0 < dayIn && dayIn < 32 ) {
      if ( dayIn > dIs ) {
        return [ null, new Date( yIs, mIs, dayIn ).getTime() ]
      }
      return [ null, new Date( yIs, mIs + 1, dayIn ).getTime() ]
    }

    var term = num[0].toLowerCase()
    var wds = configHelper.weekdays.map( function( wd ) {
      return wd.toLowerCase()
    })

    dayIn = wds.indexOf( term )
    if ( dayIn > -1 ) {
      if ( dayIn < dWIs + 1 ) dayIn += 7
      return [ null, Date.now() + configHelper.dayNum * ( dayIn - dWIs )]
    }

    var date = configHelper.terms[ term ]
    if ( !date ) return [ true, null ]

    return [ null, date() ]
  }


  exports.parseInput = function ( input ) {
    var inputEl = input.split( ' ' )
      , titleEl = inputEl.filter( function( el, i, ar ) {
                    return ( el.charAt( 0 ) !== '#' )
                 })
      , dateEl = inputEl.filter( function( el, i, ar ) {
                   return ( el.charAt( 0 ) === '#' )
                 })
      , date = Date.now()

    if ( dateEl.length ) {
      var parsed = parse( dateEl[0].substr( 1 ))
      if ( parsed[0] ) {
        displayHelper.msg([ 'No valid date input detect. Task was ',
                    ' assigned to today.' ].join(' '))
      }
      date = parsed[1]
    }

    return { title: titleEl.join( ' ' )
           , date: date || Date.now() }
  }
})

