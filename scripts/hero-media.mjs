import {additionalHeroMedia} from './additional-hero-media.mjs'
export const heroMediaDefaults = [
  {_key: 'nordic-landscape', _type: 'heroMediaItem', mediaType: 'image', title: 'Nordic coastal community', mediaUrl: '/assets/resilience-landscape.jpg', alt: 'Concept landscape of a Nordic coastal community between a fjord and mountains'},
  {_key: 'wildfire', _type: 'heroMediaItem', mediaType: 'video', title: 'Wildfire in a forest', mediaUrl: '/assets/wildfire-hero.mp4', posterUrl: '/assets/wildfire-poster.jpg', alt: 'Flames and smoke from a wildfire in a forest', credit: 'Video by Arnav Kainthola from Pexels', creditUrl: 'https://www.pexels.com/video/wildfire-in-a-forest-7533265/'},
  ...additionalHeroMedia,
]
