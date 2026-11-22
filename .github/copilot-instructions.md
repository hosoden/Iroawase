# Copilot Instructions

## Commands

- Open `index.html` directly in a browser to run the app; no build step or package install is needed.
- There is no automated test or lint command. Validate drawing, controls, guides, and responsive input in a browser.

## Architecture

- This is a static GitHub Pages site built with HTML, CSS, and vanilla JavaScript; keep local asset and script URLs relative (`./`).
- `index.html` owns the Japanese UI and layers a drawing canvas below a separate, pointer-transparent SVG guide overlay.
- `js/guides.js` defines the six animal guide SVGs in `window.IroawaseGuides`; `js/app.js` uses that data to render guide selectors and manage drawing, color, brush size, erasing, and clearing.
- The canvas is resized for its displayed dimensions and device pixel ratio while preserving the existing drawing. Keep guide artwork separate from canvas pixels so erasing never removes it.
- `css/style.css` contains the responsive layout and large touch-friendly controls. There is no bundler, framework, or dependency manifest.
