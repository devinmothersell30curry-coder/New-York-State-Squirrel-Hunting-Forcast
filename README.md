# NY Squirrel Forecast

A responsive, mobile-first website for weather-informed squirrel activity planning across New York State regions.

## Features

- Screenshot-inspired green-and-cream visual design
- Region selector covering eight New York areas
- Interactive seven-day activity outlook with score meters
- Dashboard and activity details tabs
- Responsive layout for phones, tablets, and desktop browsers
- No build step or dependencies required

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server:

```bash
python3 -m http.server 8000
```

The current forecast values are clearly modeled demo data. A production version can replace the data layer in `script.js` with a weather API and NYS DEC season/regulation data.
