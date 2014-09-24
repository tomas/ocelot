var fs     = require('fs'),
    join   = require('path').join,
    spawn  = require('child_process').spawn,
    exec   = require('child_process').exec;

var runner = join(__dirname, 'runner.js');

function is_absolute_node() {
  var node = process.argv[0];

  if (node.match('node') && fs.existsSync(node))
    return node;
}

exports.spawn_as = function(user, command, args, cb) {
  var out,
      bin      = runner,
      full_cmd = [user, command].concat(args),
      node     = is_absolute_node();

  if (node) {
    full_cmd = [bin].concat(full_cmd);
    bin = node;
  }

  var done = function(e) {
    if (out) return;
    out = true;
    cb(e, child);
  }

  var child = spawn(bin, full_cmd);
  child.on('error', done);
  process.nextTick(done);
}

exports.exec_as = function(user, command, cb) {
  var full_cmd = [runner, user, command], 
      bin      = is_absolute_node();

  if (bin)
    full_cmd = [bin].concat(full_cmd);

  exec(full_cmd.join(' '), function(e, out, err) {
    if (!e && err.match('a password is required')) {
      e = new Error('Unable to impersonate ' + user);
    }

    cb(e, out, err);
  });
}
