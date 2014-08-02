var join   = require('path').join,
    which  = require('which'),
    spawn  = require('child_process').spawn,
    exec   = require('child_process').exec;

var runner = join(__dirname, 'runner.js');

exports.spawn_as = function(user, bin, args, cb) {
  var out,
      bin = which.sync(bin),
      cmd = [user, bin].concat(args);

  var done = function(e) {
    if (out) return;
    out = true;
    cb(e, child);
  }

  var child = spawn(runner, cmd);
  child.on('error', done);
  process.nextTick(done);
}

exports.exec_as = function(user, command, cb) {
  exec(runner + ' ' + user + ' ' + command, cb);
}
