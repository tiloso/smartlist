var APP = {}

require.config({
  paths: { 'jquery': 'lib/jquery-1.8.1.min'
         , 'backbone': 'lib/backbone-0.9.2'
         , 'underscore': 'lib/underscore-1.3.3.min'
         , 'json2': 'lib/json2'
         , 'jquery-ui': 'lib/jquery-ui-1.8.22.custom.min' }

, shim: { 'backbone': {
            deps: [ 'jquery'
                   , 'underscore'
                   , 'json2' ]
          , exports: 'Backbone' }

        , 'jquery-ui': {
            deps: [ 'jquery' ]}}
})



require([ 'helper/date'
        , 'helper/backbone'
        , 'views/howto.v'
        , 'views/app.v'
        , 'collections/days'
        , 'collections/unsorted-tasks'
        , 'models/app'
        , 'jquery'
        , 'backbone'
        , 'jquery-ui' ]

, function ( dateHelper
           , backboneHelper
           , HowtoView
           , AppView
           , Days
           , UnsortedTasks
           , App
           , $
           , Backbone
           , $ui ) {


  Backbone.sync = backboneHelper.syncHttp


  var AppRouter = Backbone.Router.extend({
    routes: { ''     : 'home'
            , 'home' : 'home'
            , 'howto': 'howto' }

  , initialize: function () {
      var days = new Days()
      var unsortedTasks = APP.unsortedTasks = new UnsortedTasks( days )
      this.app = new App({ days: days
                         , unsortedTasks: unsortedTasks
                         , todayNum: dateHelper.getTodayNum()
                         , dayCount: 5
                         , router: this })
      this.appView = new AppView({ model: this.app })
      this.howtoView = new HowtoView()
    }

  , home: function () {
      this.appView.renderDays()
      this.howtoView.hide()
    }

  , howto: function () {
      this.appView.renderDays()
      this.howtoView.render()
    }
  })

  var appRouter = new AppRouter()
  Backbone.history.start({ pushState: true, root: "/app" })


  var evt = document.createEvent( 'Event' )
  evt.initEvent( 'build', true, true)
  document.dispatchEvent( evt )
})

