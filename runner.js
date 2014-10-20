#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

// This script lets us call programs as a local user rather than root.
// Usage: ./runner.js [user_name] [command] [arg1] [arg2] [arg3]

if (process.platform == 'win32') {
  console.log('Unsupported in Windows.');
  process.exit(1);
}

var spawn    = require('child_process').spawn,
    args     = process.argv,
    sudo_bin = '/usr/bin/sudo';

args.shift() && args.shift();

var currrent = process.getuid(),
    run_as   = args.shift(),
    command  = args.shift();

if (!run_as || !command) {
  console.log('Usage: runner.js [user_name] [command] <args>');
  process.exit(1);
}

var debugging = !!process.env.DEBUG || process.argv.indexOf('-D') !== -1,
    debug     = debugging ? console.log : function() { };

var safe_escape = function(str) {
  return str.replace(/[\"\`\$\|]/g, "\\$&");
}

var exit = function(err, code) {
  if (err && !code) code = 1;
  setTimeout(function(){
    process.exit(code);
  }, 10)
}

var run_command = function(command, args) {

  debug('Running ' + command + ' with uid ' + process.getuid());
  var opts = { env: process.env }

  if (process.platform == 'linux' && !opts.env.DISPLAY)
    opts.env.DISPLAY = ':0'; // so it uses active display

  var child = spawn(command, args, opts);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  process.on('SIGTERM', function(){
    child.kill('SIGTERM');
  })

  process.on('SIGINT', function(){
    child.kill('SIGINT');
  })

  child.on('error', function(err) {
    console.log('Error running command: ' + err.message);
    exit(err);
  })

  child.on('exit', function(code){
    debug('Child exited with code ' + code);
    exit(null, code);
  })
}

try {
  process.setuid(run_as);
  debug('Switched to uid: ' + process.getuid());
} catch (err) {
  debug('Unable to setuid. Falling back to sudo mode. Error was: ' + err.message);
  args = args.map(function(a) { return safe_escape(a) });
  command = ['"' + command].concat(args).join('" "') + '"';
  args = ['-n', 'su', run_as, '-c', command];
  command = sudo_bin;
}

run_command(command, args);

