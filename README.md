# Social Layer Pricing App

React + Vite app converted from the static pricing HTML. All copy is in English.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app is a single page: the pricing page at `/`.

## Build

```bash
npm run build
npm run preview
```

## Chrome extension Pro unlock

When users pay on this app (pay.sociallayer.app), the Chrome extension can be notified so it enables the Pro tier. Set `VITE_EXTENSION_ID` in `.env` to your extension’s ID (from `chrome://extensions` when unpacked, or the Web Store ID when published). The extension must have `externally_connectable` for `https://pay.sociallayer.app/*` (already set in the extension manifest).

## Stack

- **Vite** – build tool
- **React 18** – UI
- **Single page** – pricing only at `/`
- **Tailwind CSS** – styling (same look as original HTML)
