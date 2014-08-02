var ocelot = require('./');

ocelot.exec_as('prey', 'whoami', function(err, out) {
  console.log(err || out);
})