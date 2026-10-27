import React from 'react'

// Original line icons. Visible text labels carry their meaning for screen readers.
const paths = {
  rain: ['M9 20a6 6 0 1 1 5-10 5 5 0 1 1 2 10H9Z', 'm10 24-2 4m10-4-2 4m10-4-2 4'],
  flood: ['M5 18 16 8l11 10M9 16v8m14-8v8M14 24v-6h4v6', 'M3 27q3-3 6 0t6 0t6 0t6 0t3 0'],
  coastal: ['M4 14h5l4 7m7-16v8m-4-4h8M3 27q4-5 8 0t8 0t10 0', 'M15 23c-1-5 2-11 7-11 4 0 6 4 4 7-2-3-5-2-5 1'],
  landslide: ['M3 26 14 6l8 13m-7-9 4 1-3 5 6 1', 'm23 17 4 1 2 4-4 2-4-3Zm-8 5 4 1 2 5h-7Z'],
  volcano: ['M3 28 11 14h10l8 14H3Zm8-14 5 5 5-5', 'm12 9-2-4m6 4V3m4 6 2-4m-4 17 2 6'],
  seismic: ['M4 7h8v7H8v14H4V7Zm16 0h8v21h-4V14h-4V7Z', 'm17 3-3 8 5 5-6 6 4 7'],
  heat: ['M12 7a3 3 0 0 1 6 0v13a6 6 0 1 1-6 0V7Z', 'M15 13v12m9-18v4m4 4h3m-9-12 2 2m1 15 3 2'],
  fire: ['M18 3c1 6-5 7-3 12 2-1 3-3 3-5 6 5 9 9 7 14-3 7-14 7-18 0-4-7 4-10 4-16 0 5 3 6 4 7', 'M15 28c-5-4 0-6 1-10 0 4 5 6 2 10'],
  weather: ['M10 19a6 6 0 1 1 4-10 5 5 0 1 1 4 10H10Z', 'm18 19-5 6h5l-3 5M6 5 4 3m4 21-2 4M25 5l2-2'],
  hydrology: ['M16 3C13 8 6 15 6 21a10 10 0 0 0 20 0c0-6-7-13-10-18Z', 'M8 22q4-3 8 0t8 0'],
  geohazard: ['M3 27 12 8l6 11 4-7 8 15H3Z', 'm14 18-3 4 6 1-3 4M9 14l3 3 3-3'],
  authority: ['M3 12 16 4l13 8H3Zm3 4v10m7-10v10m6-10v10m7-10v10M3 29h26'],
  protection: ['M16 3 27 7v9c0 6-6 11-11 14C11 27 5 22 5 16V7l11-4Z', 'm10 16 4 4 8-9'],
  responder: ['M6 14a10 10 0 0 1 20 0M4 17h24M10 5v8m12-8v8', 'M8 20v4h16v-4M4 29h24m-9-9v9m-6-9v9'],
  forecast: ['M6 13a6 6 0 0 1 11-4 5 5 0 0 1 5 8H7a4 4 0 0 1-1-8', 'M5 22h15m-12 5h17m-1-5c5 0 5-5 1-5m1 10c4 0 4 4 0 4'],
  science: ['m3 12 13-7 13 7-13 7-13-7Z', 'M8 16v8c5 4 11 4 16 0v-8m5-4v10M12 23h8'],
  community: ['M9 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M2 28v-3a7 7 0 0 1 14 0v3m0 0v-3a7 7 0 0 1 14 0v3'],
  volunteer: ['M16 12C9 4 2 14 16 23 30 14 23 4 16 12Z', 'M3 20v6l8 4h9l9-6-2-3-8 4h-7m-9-5 6 1 5 4'],
  infrastructure: ['M3 29h26M5 29V15h8v14m6 0V5h8v24M9 19v1m0 4v1m14-16v2m0 4v2m0 4v2M13 22h6'],
  health: ['M5 29V8h22v21H5ZM12 8V3h8v5', 'M16 12v10m-5-5h10M12 29v-4h8v4'],
}
export function PilotIcon({name}) {
  return React.createElement('svg', {viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.65, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false},
    ...(paths[name] || paths.protection).map((d, index) => React.createElement('path', {key: index, d})))
}
