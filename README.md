# Siddharth Singh (Sid) — The Magnifying Glass Portfolio

A bold red poster portfolio with high-contrast typography, interactive pop-ups, and a real, physically-modeled magnifying glass that enlarges whatever it passes over and reveals hidden secrets.

Built with clean HTML5, modern CSS3, and vanilla JavaScript — zero framework overhead, zero dependencies.

---

## ⚡ Concept & Experience

- **Poster Aesthetic:** Full-height, bottom-aligned typographical poster in bold red radial gradient (`#f0352a` → `#e3211b` → `#cf1a14`) with near-black (`#0e0d0c`) typography.
- **Real Optical Magnification (1.9×):** 
  - The hero content is cloned into the lens container (`inert`, `aria-hidden="true"`).
  - Exact geometric optical translation formula: `translate(R − x·1.9, R − y·1.9) scale(1.9)`.
  - Polished chrome rim with conic gradient masked to a thin ring.
  - Soft top-left specular highlight, darker edges, and realistic red-brown ambient drop shadows.
  - Machined chrome collar, ribbed neck, glossy black grip with specular shine line, and chrome pommel extending at `-50°`.
- **4 Hidden Secrets:**
  - Invisible on the page (`opacity: 0`) and rendered exclusively under the magnifying lens.
  - Collision detection tracks the lens center against the secrets' actual screen positions.
  - Interactive counter (`0 of 4 secrets found`) with 4 outlined dots that fill upon discovery.
  - When all 4 are uncovered, transitions to `"All 4 found. Let's build something? ↗"`.
- **Micro-Text Block:**
  - Tiny 7px uppercase technical resume block at 16% opacity on the top-right corner, becoming sharp and legible under the glass.
- **Drift Physics:**
  - Glides smoothly with the cursor, touch taps/drags, and keyboard arrow keys (`Shift` for larger steps).
  - After 3.5 seconds of inactivity, gently drifts in a smooth looping path over the headline (respects `prefers-reduced-motion`).
- **Accessible Native Dialogs (`<dialog>`):**
  - Rounded 22px black cards with red kicker labels and Clash Display titles.
  - Modals for **Work**, **About**, **Process**, and **Contact**.
  - Closes on Escape, Close button, or clicking the backdrop blur; returns focus to the trigger.

---

## 🚀 Running Locally

No npm install or build step required. Simply serve using any local static web server:

### Option 1: Python HTTP Server (Recommended)
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: VS Code Live Server / Any Static Host
Open the project directory in VS Code and click **"Go Live"** via the Live Server extension.

---

## 🛠️ Configuration (`config.js`)

All personal details, contact channels, and project links are centralized in `config.js`:

```javascript
const PORTFOLIO_CONFIG = {
  identity: {
    fullName: "Siddharth Singh",
    preferredName: "Sid",
    email: "siddharthsingh6621e@gmail.com",
    githubUrl: "https://github.com/siddharth-singh-cs",
    linkedinUrl: "https://linkedin.com/in/siddharth-singh-1b9693378/",
    resumeUrl: "https://drive.google.com/file/d/1p0gFTrkM4deLIiLc_hxShkc09-yEtG1t/view?usp=drive_link"
  },
  ...
};
```

---

## 📂 Project Structure

```
portfolio - v2/
├── assets/
│   ├── logo-reference.png    # Authentic personal signature/logo asset
│   └── logo.svg              # Vector logo fallback
├── index.html                # Semantic HTML5 poster layout & native dialogs
├── styles.css                # Pure CSS3 styling, conic rims, gradients, responsive breakpoints
├── app.js                    # Magnifier optics, LERP physics, secret detection & touch/keyboard handlers
├── config.js                 # Centralized personal info & verified project data
└── README.md                 # Project documentation & local setup instructions
```

---

## 📱 Responsive Testing

Tested and verified across all standard responsive breakpoints:
- **Desktop (1440×900+):** Full-bleed poster layout with ~48px padding, empty space on right housing the 4 secrets.
- **Tablet (768px):** Secrets cleanly stacked under buttons, responsive magnifying glass diameter.
- **Mobile (390px / 375px):** Two-row navigation (Logo + CTA on row 1, centered navigation links on row 2), touch-optimized lens interaction, zero horizontal overflow.

