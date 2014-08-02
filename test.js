var ocelot = require('./');

ocelot.exec_as('daemon', 'whoami', function(err, out) {
  console.log(err || out);
})
