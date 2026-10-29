// Read or set the raw backlight value once, to find the right MAX_BKLT by eye.
// Usage:
//   osascript -l JavaScript try.js          -> show current value
//   osascript -l JavaScript try.js 10000    -> set raw value to 10000
// Pressing the brightness keys restores macOS's own value.

ObjC.import('IOKit');
ObjC.bindFunction('IOServiceMatching', ['id', ['char *']]);
ObjC.bindFunction('IOServiceGetMatchingService', ['unsigned int', ['unsigned int', 'id']]);
ObjC.bindFunction('IODisplayGetIntegerRangeParameter', ['int', ['unsigned int', 'unsigned int', 'id', 'int *', 'int *', 'int *']]);
ObjC.bindFunction('IODisplaySetIntegerParameter', ['int', ['unsigned int', 'unsigned int', 'id', 'int']]);
ObjC.bindFunction('IODisplayCommitParameters', ['int', ['unsigned int', 'unsigned int']]);

function run(argv) {
  const svc = $.IOServiceGetMatchingService(0, $.IOServiceMatching('AppleBacklightDisplay'));
  if (!svc) return 'No built-in backlight display found';
  const key = $('bklt');
  const get = () => {
    const c = Ref('int'), mn = Ref('int'), mx = Ref('int');
    $.IODisplayGetIntegerRangeParameter(svc, 0, key, c, mn, mx);
    return `bklt=${c[0]} (min ${mn[0]}, max ${mx[0]})`;
  };
  let out = 'before: ' + get();
  if (argv.length) {
    $.IODisplaySetIntegerParameter(svc, 0, key, parseInt(argv[0]));
    $.IODisplayCommitParameters(svc, 0);
    out += '\nafter:  ' + get();
  }
  return out;
}
