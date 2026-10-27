const paragraph = (key, text, style = 'normal') => ({_type: 'block', _key: key, style, markDefs: [], children: [{_type: 'span', _key: `${key}-text`, text, marks: []}]})
export const blogTemplate = [
  paragraph('context-heading', 'Background and context', 'h2'),
  paragraph('context-text', 'Editorial placeholder: introduce the background, people involved and purpose of this story.'),
  paragraph('approach-heading', 'Activities and insights', 'h2'),
  paragraph('approach-text', 'Editorial placeholder: describe the activities and confirmed findings. Add links, lists or further subsections as needed.'),
  {_type: 'pullQuote', _key: 'participant-quote', quote: 'Add an approved participant quote here.', attribution: 'Name and organisation to confirm', placeholder: true},
  {_type: 'image', _key: 'story-photo', alt: 'Describe the article photo', caption: 'Editorial placeholder: upload a photo and add a caption.', placeholder: true},
  paragraph('next-heading', 'Next steps', 'h2'),
  paragraph('next-text', 'Editorial placeholder: add confirmed next steps and a closing reflection.'),
]
export const osloBlogTemplate = structuredClone(blogTemplate).map(block => {
  if (block._key === 'context-heading') block.children[0].text = 'Bringing the partnership together'
  if (block._key === 'context-text') block.children[0].text = 'The first in-person consortium meeting brought RESILIACT partners together at Oslo City Hall.'
  if (block._key === 'approach-heading') block.children[0].text = 'Project activities and coordination'
  if (block._key === 'approach-text') block.children[0].text = 'Partners discussed project activities, coordination and the development of the RESILIACT solutions. Editorial placeholder: add confirmed details and observations from the meeting.'
  return block
})
