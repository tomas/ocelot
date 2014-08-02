Ocelot
======

Spawn/exec commands as other users on OS X and Linux, by impersonating them. Like Ocelot.

Example
-------

    var ocelot = require('./');

    ocelot.exec_as('someone', 'whoami', function(err, out) {
      console.log(err || out);
    })

    // Or for long running commands, use the spawn method:

    ocelot.spawn_as('deploy', 'tail', ['-f', '/var/log/nginx/access.log'], function(err, child) {

      child.stdout.on('data', function(chunk) {
        console.log(chunk.toString());
      })

      setTimeout(function() {
        child.kill();
      }, 5000);

    })

Author
------

Written by Tomas Pollak. MIT.
