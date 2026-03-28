# Mobile automation — Monefy (Android)

End-to-end tests for the **Monefy** Android app using **WebdriverIO**, **Appium**, and **Cucumber**. Scenarios live in Gherkin (`.feature` files); step definitions and page objects are TypeScript. **Allure** captures structured results, and failed scenarios get a screenshot attachment.

---

## What this solution does

- Automates smoke flows: app launch, onboarding, expense and income entry, editing and deleting transactions.
- Runs against a **real Android device or emulator** — you bring the hardware; the runner starts **Appium** for you on port **4723** via `@wdio/appium-service`.
- Reads device and app settings from `**mobile-automation/.env`** (or equivalent environment variables), so the same codebase works for CI, an emulator, or a physical phone without editing code.

---

## Tech stack and why it was chosen


| Area                 | Choice                          | Reason                                                                                                                     |
| -------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Test runner / client | **WebdriverIO v9**              | Mature WebDriver client with first-class **Appium** integration, solid docs, and a plugin ecosystem (reporters, services). |
| Mobile bridge        | **Appium 3** + **UiAutomator2** | Standard way to drive native Android UI; UiAutomator2 is stable on modern API levels.                                      |
| Specs                | **Cucumber (Gherkin)**          | Scenarios stay readable for both engineers and stakeholders; steps map cleanly to page objects.                            |
| Language             | **TypeScript**                  | Safer refactors across screens and steps; matches typical WDIO/Appium project setups.                                      |
| Reporting            | **Allure** + **spec** (console) | Allure gives timelines, attachments, and history-friendly HTML; spec reporter gives fast feedback in the terminal.         |
| Failure diagnostics  | Screenshot on failed scenario   | Implemented in `afterScenario` so Allure shows *what* the UI looked like when a step failed.                               |


This stack is a common, maintainable default for Android UI automation: one process runs tests, Appium is managed as a service, and reports stay separate from test code.

---

## Prerequisites

- **Node.js** (LTS recommended) and **npm**.
- **Android Studio** (or standalone SDK) with:
  - **Platform tools** and an **emulator** *or* a USB-debugging-enabled device.
- Environment variable `**ANDROID_HOME`** (macOS example: `~/Library/Android/sdk`).

Add to `~/.zshrc` (or your shell profile), then reload the shell:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
```

Your emulator’s **Android version** should match `**ANDROID_PLATFORM_VERSION`** in `.env` (for example API **30** → use `**11`** if you align with that convention, or match the API level you actually run — keep it consistent with the AVD or device).

---

## Setup

From this directory:

```bash
cd mobile-automation
npm install
```

### Configure the app under test

Create `**mobile-automation/.env**` (this file is gitignored). You must provide **either** an APK path **or** an already-installed package + activity:

**option A — app already on the device**

```bash
ANDROID_APP_PACKAGE=com.monefy.app.lite
ANDROID_APP_ACTIVITY=com.monefy.activities.main.MainActivity_
```

Optional variables (see `tests/support/hooks.ts`):


| Variable                   | Purpose                                                                          |
| -------------------------- | -------------------------------------------------------------------------------- |
| `ANDROID_UDID`             | Required when more than one device/emulator is connected; pin a specific device. |
| `ANDROID_DEVICE_NAME`      | Label for reports (default: `Android device`).                                   |
| `ANDROID_PLATFORM_VERSION` | OS version string for the session (default: `16`).                               |
| `ANDROID_NO_RESET`         | Set to `1` to skip resetting app state between runs (faster local iteration).    |


Shell exports override `.env` when the same variable is set in both.

### One-time note about `npm init wdio`

If you ever ran `**npm init wdio@latest**`, that wizard is **one-time**. Day-to-day you only use `**npm run wdio`** and the steps below — this README replaces that wizard output for routine work.

---

## How to run tests

### 1. Start a device

**Emulator** — list AVDs, pick a name, then start it (leave the process running or use Android Studio):

```bash
npm run android:list-avds
export ANDROID_AVD="Your_Avd_Name"
npm run android:emulator
```

**Physical device** — enable developer options and USB debugging; install the app or APK; set `**ANDROID_UDID`** if multiple devices appear in `adb devices`.

### 2. Run the suite

From `**mobile-automation`**:

```bash
npm run wdio
```

This starts **Appium** automatically (unless you change `wdio.conf.ts` to disable the `appium` service).

### 3. Optional checks

- **UiAutomator2 driver health:** `npm run appium:doctor`
- **Manual Appium** (only if you disable the WDIO Appium service):  
`npx appium --port 4723 --base-path /`

---

## Reports (test execution)

Raw Allure data is written to `**mobile-automation/allure-results/`** after a run.

**Generate and open a local HTML report** (this folder):

```bash
npm run allure:generate   # produces mobile-automation/allure-report/
npm run allure:open
```

**Run tests and then generate** in one go:

```bash
npm run test:allure
```

---

## Project layout (short)


| Path                         | Role                                                |
| ---------------------------- | --------------------------------------------------- |
| `tests/features/*.feature`   | Gherkin scenarios                                   |
| `tests/steps/*.steps.ts`     | Step definitions                                    |
| `tests/pages/*.ts`           | Screen objects and selectors                        |
| `tests/config/monefy-app.ts` | Monefy package / resource id helpers                |
| `tests/support/hooks.ts`     | Capabilities builder, failure screenshots           |
| `wdio.conf.ts`               | WebdriverIO + Cucumber + reporters + Appium service |


---

## Behaviour summary


| Concern                 | Automatic?                                          |
| ----------------------- | --------------------------------------------------- |
| **Appium server**       | **Yes** — started on port **4723** for the run.     |
| **Android emulator**    | **No** — start an AVD or connect a device yourself. |
| **Failure screenshots** | **Yes** — attached to Allure when a scenario fails. |


If you disable the `appium` service in `wdio.conf.ts`, start Appium manually before running tests (see optional section above).