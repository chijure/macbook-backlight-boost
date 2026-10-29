// backlight-boost: scales the built-in display backlight for MacBooks with an
// aftermarket replacement screen that looks dim on macOS but fine on Windows.
//
// macOS maps 100% brightness to a raw backlight value ("bklt") calibrated for
// the original Apple panel (e.g. 1385 out of 65535 on a MacBookPro15,4).
// This script reads the brightness macOS wants ("linear-brightness") and
// rescales it so that 100% becomes MAX_BKLT. Brightness keys keep working.
//
// Usage: osascript -l JavaScript backlight-boost.js [MAX_BKLT]

ObjC.import('IOKit');
ObjC.bindFunction('IOServiceMatching', ['id', ['char *']]);
ObjC.bindFunction('IOServiceGetMatchingService', ['unsigned int', ['unsigned int', 'id']]);
ObjC.bindFunction('IODisplayGetIntegerRangeParameter', ['int', ['unsigned int', 'unsigned int', 'id', 'int *', 'int *', 'int *']]);
ObjC.bindFunction('IODisplaySetIntegerParameter', ['int', ['unsigned int', 'unsigned int', 'id', 'int']]);
ObjC.bindFunction('IODisplayCommitParameters', ['int', ['unsigned int', 'unsigned int']]);

function get(svc, name) {
  const c = Ref('int'), mn = Ref('int'), mx = Ref('int');
  if ($.IODisplayGetIntegerRangeParameter(svc, 0, $(name), c, mn, mx) !== 0) return null;
  return { value: c[0], max: mx[0] };
}

function run(argv) {
  const maxBklt = parseInt(argv[0] || '10000');
  while (true) {
    const svc = $.IOServiceGetMatchingService(0, $.IOServiceMatching('AppleBacklightDisplay'));
    if (svc) {
      const lin = get(svc, 'linear-brightness');
      const bklt = get(svc, 'bklt');
      if (lin && bklt && lin.max > 0) {
        const target = Math.min(bklt.max, Math.round(lin.value / lin.max * maxBklt));
        if (Math.abs(bklt.value - target) > 20) {
          $.IODisplaySetIntegerParameter(svc, 0, $('bklt'), target);
          $.IODisplayCommitParameters(svc, 0);
        }
      }
    }
    delay(1);
  }
}
