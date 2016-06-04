#activator-play-slick-angularjs

This is an activator project providing a seed for starting with Play & Slick using AngularJS , how to write unit test and how to use mocking for unit testing.

 Clone and run the app(default database is H2):

      $ git clone git@github.com:knoldus/activator-play-slick-angularjs.git
      $ cd activator-play-slick-angularjs
      $ bin/activator run
    
 Run the all unit test:

     $ bin/activator test
    
Run the app using Postgres database:

     $ bin/activator 'run   -Dconfig.file=conf/postgres.conf'
