# Mobile automation (WebdriverIO + Appium + Android)

## What `npm run wdio` does (and does not do)

| Step | Automatic? |
|------|----------------|
| **Appium server** | **Yes.** `@wdio/appium-service` starts Appium on port **4723** when the run begins. Look for log lines like `Will spawn Appium process` and `Appium started`. |
| **Android emulator** | **No.** You must start an AVD yourself (Android Studio → Device Manager, or the script below). WebdriverIO does not launch emulators by default. |
| **Setup tips** | The long checklist you saw after **`npm init wdio@latest`** is a **one-time** wizard. Running **`npm run wdio`** only runs tests; it does not print that help again. This file replaces that for day-to-day use. |

## Android environment (macOS)

1. Install **Android Studio** and open **SDK Manager** → note the **Android SDK location** (often `~/Library/Android/sdk`).
2. In your shell profile (`~/.zshrc`), set:

   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export ANDROID_SDK_ROOT="$ANDROID_HOME"
   export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
   ```

3. Reload the shell (`source ~/.zshrc`) or open a new terminal.
4. Create an AVD in **Device Manager** if you do not have one. Its **Android version** must match **`appium:platformVersion`** in `wdio.conf.ts` (e.g. `11` for an API 30 emulator).

## Typical workflow

1. **List AVDs:** `npm run android:list-avds`  
   (requires `ANDROID_HOME`.)
2. **Start an emulator** (pick the name from the list):

   ```bash
   export ANDROID_AVD="Your_Avd_Name"
   npm run android:emulator
   ```

   Leave that terminal open, or run the emulator from Android Studio.

3. **Run tests** (starts Appium for you): `npm run wdio`

## Optional: Appium / driver checks

- `npm run appium:doctor` — quick check for the UiAutomator2 driver setup.

## Manual Appium (only if you turn off the WDIO service)

If you ever disable the `appium` service in `wdio.conf.ts`, start the server yourself:

```bash
npx appium --port 4723 --base-path /
```

Normally you do **not** need this; the WebdriverIO Appium service handles it.
