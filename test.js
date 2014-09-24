#!/usr/bin/env node

var ocelot = require('./'),
    method = process.argv[2];

if (method == 'exec') {

  ocelot.exec_as('prey', 'whoami', function(e, out, err) {
    console.log(e || out);
  })

} else if (method == 'spawn') {

  ocelot.spawn_as('prey', 'whoami', [], function(e, child) {
    child.stdout.on('data', function(data) {
      console.log('Child stdout: ' + data.toString().trim());
    })
  })

} else {
  console.log('test.js [spawn|exec]');
}
