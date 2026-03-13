# Paddle checkout theme (match site)

The app uses **theme: 'dark'** in code. To make buttons, inputs, and links match the site, set branding in the Paddle dashboard.

## Where to set it

**Paddle Dashboard → Checkout → Branded inline checkout**

(Overlay checkout uses the same branding where applicable.)

## Recommended values (Social Layer site theme)

Use these so the checkout matches the current site (dark teal background, cyan accent).

| Area | Setting | Value |
|------|--------|--------|
| **Primary button** | Background color | `#22d3ee` |
| **Primary button** | Text color | `#042f2e` |
| **Primary button** | Hover background | `#0891b2` (or slightly darker cyan) |
| **Secondary button** | Border color | `rgba(255,255,255,0.2)` or `#22d3ee` |
| **Inputs** | Border color | `rgba(255,255,255,0.12)` |
| **Inputs** | Focus border / shadow | `#22d3ee` |
| **Links** | Text color | `#22d3ee` |
| **General** | Font | Inter (or match body font) |
| **General** | Text / background | Dark background, light text (slate/white) |

If the dashboard uses presets, choose **Dark** and then set the primary action color to **#22d3ee** so it matches the site CTA and accent.

## What the app does in code

- **theme: 'dark'** – passed in both overlay (Pricing) and inline (Checkout).
- **frameStyle** – checkout iframe uses transparent background and rounded corners so the glass wrapper matches the rest of the page.
- **Container** – `.checkout-container` in `index.css` uses the same glass style as the rest of the site (backdrop blur, light border).

After updating the dashboard branding, the checkout will align with the site’s look and feel.
