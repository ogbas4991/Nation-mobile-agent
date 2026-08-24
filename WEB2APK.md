# PAPYLO J AGENT — Web2APK / PWA deployment

The web build is configured as an Expo Router **static export**, so it can be hosted as a normal static site and wrapped by Web2APK or another Trusted Web Activity/WebView packaging service.

## Build

```bash
pnpm install --frozen-lockfile
npx expo export --platform web
```

The generated static site is in `dist/`.

## Host

Deploy the contents of `dist/` to a static HTTPS host. The host must serve `/` and support client-side routes with a fallback to the generated entry document where required by the host.

## Web2APK settings

Use:

- **Start URL:** the HTTPS URL of the deployed PAPYLO J AGENT site
- **App name:** PAPYLO J AGENT
- **Package ID:** `com.papylo.jagent`
- **Orientation:** Portrait
- **Display mode:** Standalone/fullscreen where supported
- **Theme color:** `#6366F1`
- **Background color:** `#0B1020`
- **Internet permission:** enabled

The repository includes `public/manifest.json` for install metadata and the existing PAPYLO J icon assets are reused for the PWA icon.

## Important limitation

A Web2APK wrapper packages the **web runtime**. Native-only capabilities from the Expo application—such as Android foreground services, exact alarms, native notifications, local native model execution, and other custom native modules—are not automatically available inside the web wrapper. Those capabilities require browser-compatible implementations or the native Android build.
