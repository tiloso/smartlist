
var layout = function () {
  var innerHeight = window.innerHeight

  var articlePadding = Math.round(( innerHeight - ( 16 + 266 + 24 )) / 4 )
  articlePadding = ( articlePadding > 0 ) ? articlePadding : 0

  var footerPadding = articlePadding * 3

  var article = document.getElementById( 'start' ).style
    , footer = document.getElementsByTagName( 'footer' )[0].style

  article.paddingTop = [ articlePadding, 'px' ].join( '' )
  footer.paddingTop = [ footerPadding, 'px' ].join( '' )
}


window.onload = function () {
  layout()
}
