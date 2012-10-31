
var fs = require( 'fs' )


module.exports = function ( grunt ) {

  grunt.initConfig({
    lint: { all: [ 'grunt.js', 'app.js', 'public/js/*' ]}

  , jshint: { options: { node: true
                       , laxcomma: true
                       , asi: true }}

  , watch: { files: [ 'public/styl/style.styl' ]
           , tasks: [ 'stylus' ]}
  })


  grunt.registerTask( 'stylus', 'convert stylus-files to css', function () {
    var stylus = require( 'stylus' )
      , files = fs.readdirSync( 'public/styl' )

    var styl = fs.readFileSync( 'public/styl/style.styl', 'utf8' )

    stylus( styl )
      .render( function ( e, css ) {
        if ( e ) throw e

        var write = fs.writeFileSync( 'public/css/style.css', css )
        if ( write ) throw write
      })
  })


  grunt.registerTask( 'optimize', 'optimize required frontend js files', function () {
    var requirejs = require( 'requirejs' )

    var config = { baseUrl: 'public/js'
                 , mainConfigFile: 'public/js/init.js'
                 , name: 'init'
                 , out: 'public/js/init-built.js'
                 , optimize: 'uglify'
                 , uglify: { max_line_length: 1000 }}

    requirejs.optimize( config, function ( buildResponse ) {
        var contents = fs.readFileSync( config.out, 'utf8' )
    })
  })


  grunt.registerTask( 'default', 'watch' )

}

