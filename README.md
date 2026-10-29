# macbook-backlight-boost

Fix for Intel MacBooks with an **aftermarket replacement screen** that looks very dim on macOS, even at 100% brightness, but reaches full brightness on Windows (Boot Camp).

*[Español abajo](#español)*

## The problem

macOS drives the built-in backlight through a raw value, `bklt` (range 0–65535). At 100% brightness it only sends the value calibrated for the original Apple panel. On a MacBookPro15,4 that value is **1385**, about 2% of the range. A non-original panel can need far more to reach the same brightness. Windows uses the full range, so the same screen looks fine there.

You can check this yourself:

```bash
ioreg -r -c AppleBacklightDisplay -l -w0 | grep -o '"bklt"={[^}]*}'
```

If `value` is small compared to `max` while macOS is at 100% brightness, this tool can help.

Screens like this often also lack the **ambient light sensor**, which means no True Tone, no auto-brightness and, on 2016–2019 models, no keyboard backlight once macOS loads. This tool does **not** fix those.

## How it works

A small JavaScript for Automation script, run with the built-in `osascript` and needing no Xcode or extra installs, runs in the background. Every second it reads the brightness macOS wants (`linear-brightness`), rescales it so that 100% becomes your chosen `MAX_BKLT`, and writes it to `bklt` using IOKit. The brightness keys keep working proportionally, and the setting survives sleep and restarts.

## Usage

1. **Find your value.** Close any running instance first, then raise the value step by step until you no longer see a difference, or until it matches Windows:

   ```bash
   osascript -l JavaScript try.js 5000
   osascript -l JavaScript try.js 10000
   osascript -l JavaScript try.js 15000
   ```

   Don't press the brightness keys while testing, because they reset the value. Toggle between two values in a dark room to compare them.

2. **Install** with the value you chose:

   ```bash
   ./install.sh 25000
   ```

3. **Uninstall:**

   ```bash
   ./uninstall.sh
   ```

## Warnings

- Driving the backlight harder means more heat, more battery drain and possibly a shorter backlight lifespan. Stop raising the value once you no longer see a difference, and avoid going past what Windows shows.
- This relies on undocumented display parameters. A macOS update could break it.
- Tested on a MacBookPro15,4 (13" 2019, Intel, T2) running macOS 15 Sequoia. Apple silicon Macs use a different display stack, so this will most likely not work there.

## License

MIT

---

## Español

Solución para MacBooks Intel con una **pantalla de reemplazo no original** que se ve muy oscura en macOS, aun al 100% de brillo, pero en Windows (Boot Camp) se ve con brillo completo.

**El problema:** macOS controla la luz de fondo con un valor interno, `bklt`, que va de 0 a 65535. Al 100% de brillo solo envía el valor calibrado para el panel original de Apple. En una MacBookPro15,4 ese valor es **1385**, alrededor del 2% del rango. Una pantalla no original puede necesitar mucho más para dar el mismo brillo. Windows usa el rango completo.

Estas pantallas muchas veces tampoco tienen el **sensor de luz ambiental**, así que no hay True Tone, ni brillo automático, ni luz del teclado en los modelos 2016–2019. Esta herramienta **no** arregla eso.

**Uso:**

1. **Encuentra tu valor:** súbelo de a poco con `osascript -l JavaScript try.js 10000`, `15000`, etc., hasta que ya no notes diferencia o se vea como en Windows. No toques las teclas de brillo mientras pruebas.
2. **Instala:** `./install.sh 25000`, con tu valor.
3. **Desinstala:** `./uninstall.sh`.

Las teclas de brillo siguen funcionando en proporción, y el ajuste se mantiene al dormir o reiniciar la Mac. Más brillo significa más calor y más consumo de batería, y la luz de fondo puede desgastarse antes. No pases del brillo que ves en Windows.
