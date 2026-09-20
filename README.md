# New-York-State-Squirrel-Hunting-Forcast

Public New York State squirrel hunting activity forecasts by region, with weather-informed predictions and safety guidance.

## Overview

This project models squirrel activity using a few interacting signals:

- weather conditions (temperature, rain, and wind)
- seasonal squirrel activity patterns, including mating-season shifts
- habitat and food availability (mast-heavy hardwoods, oak, hickory, beech)
- daylight and feeding windows
- current New York DEC rules for legal seasons, limits, and licensing

## Local development

Open `index.html` in a browser, or run a tiny static server:

```bash
python3 -m http.server 8000
```

## Data sources used

- Open-Meteo weather API for regional temperature, rain, and wind
- New York DEC squirrel regulations summary for season dates and bag limits (for planning and display, verify official DEC updates before hunting)
- Modeled squirrel activity logic tuned for New York conditions

## Note

The values are designed for an informational forecast experience and should not replace current DEC regulations or local conditions.
