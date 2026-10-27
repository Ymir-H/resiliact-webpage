import {defineArrayMember, defineField, defineType} from 'sanity'
import {pageSchemaTypes} from './pages.js'
import {blogTemplate} from '../../scripts/blog-template.mjs'
import {hubKeys} from '../../scripts/hub-content.mjs'
import {replicationDefaults} from '../../scripts/replication-content.mjs'

const image = (name, title) => defineField({
  name, title, type: 'image', options: {hotspot: true},
  fields: [
    defineField({name: 'alt', title: 'Alternative text', type: 'string', validation: R => R.required()}),
    defineField({name: 'credit', title: 'Image credit', type: 'string'}),
    defineField({name: 'caption', title: 'Caption', type: 'text', rows: 2}),
  ],
})
const attachments = defineField({
  name: 'attachments', title: 'Downloadable files', type: 'array',
  of: [defineArrayMember({type: 'file', fields: [
    defineField({name: 'title', title: 'Download label', type: 'string', validation: R => R.required()}),
  ]})],
})
const body = defineField({
  name: 'body', title: 'Full content', type: 'array',
  of: [defineArrayMember({type: 'block',
    styles: [{title: 'Normal', value: 'normal'}, {title: 'Heading', value: 'h2'}, {title: 'Subheading', value: 'h3'}, {title: 'Quote', value: 'blockquote'}],
    marks: {decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}],
      annotations: [{name: 'link', title: 'Link', type: 'object', fields: [defineField({name: 'href', title: 'URL', type: 'url', validation: R => R.uri({scheme: ['http', 'https', 'mailto']})})]}]},
  }), defineArrayMember({type: 'image', options: {hotspot: true}, fields: [
    defineField({name: 'alt', title: 'Alternative text', type: 'string', validation: R => R.required()}),
    defineField({name: 'credit', title: 'Image credit', type: 'string'}),
  ]})],
})
const title = defineField({name: 'title', title: 'Title', type: 'string', validation: R => R.required().max(160)})
const slug = defineField({name: 'slug', title: 'Page address', type: 'slug', options: {source: 'title', maxLength: 96}, validation: R => R.required()})
const summary = defineField({name: 'summary', title: 'Short description', type: 'text', rows: 3, validation: R => R.required().max(500)})
const publishedAt = defineField({name: 'publishedAt', title: 'Display date', type: 'datetime', description: 'The date shown on the website. Use Publish to make the item public; this field does not schedule publication.', validation: R => R.required()})
const articleBody = {...body, title: 'Article body — drag blocks to reorder', description: 'Build the story with paragraphs, headings, lists, photos/captions and attributed quotes. Replace or remove all editorial placeholders before final publication.', group: 'story',
  of: body.of.map(member => member.type !== 'image' ? member : {...member, fields: [...member.fields,
    defineField({name: 'caption', title: 'Photo caption', type: 'text', rows: 2}),
    defineField({name: 'placeholder', title: 'Show a placeholder until a photo is uploaded', type: 'boolean', initialValue: false}),
  ]}).concat(defineArrayMember({name: 'pullQuote', title: 'Quote with attribution', type: 'object', fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: R => R.required()}),
    defineField({name: 'attribution', title: 'Speaker name and organisation', type: 'string', validation: R => R.required()}),
    defineField({name: 'placeholder', title: 'Mark as editorial placeholder', type: 'boolean', initialValue: false}),
  ], preview: {select: {title: 'quote', subtitle: 'attribution'}}})),
}

export const schemaTypes = [
  ...pageSchemaTypes,
  defineType({name: 'projectEvent', title: 'Event', type: 'document', fields: [title, slug, summary,
    defineField({name: 'startsAt', title: 'Start date and time', type: 'datetime', validation: R => R.required()}),
    defineField({name: 'endsAt', title: 'End date and time (optional)', type: 'datetime', validation: R => R.min(R.valueOfField('startsAt'))}),
    defineField({name: 'location', title: 'Location or online meeting', type: 'string'}),
    defineField({name: 'address', title: 'Venue address', type: 'text', rows: 2}),
    defineField({name: 'organizer', title: 'Organizer', type: 'string'}),
    defineField({name: 'category', title: 'Event category', type: 'string'}),
    defineField({name: 'website', title: 'Details or registration URL', type: 'url', validation: R => R.uri({scheme: ['http', 'https']})}),
    defineField({name: 'registrationLabel', title: 'Registration button label', type: 'string', initialValue: 'Event details and registration'}),
    image('heroImage', 'Event image'), body, attachments,
  ], orderings: [{title: 'Event date', name: 'eventDate', by: [{field: 'startsAt', direction: 'asc'}]}], preview: {select: {title: 'title', subtitle: 'location'}}}),
  defineType({name: 'news', title: 'News article or blog post', type: 'document',
    groups: [{name: 'details', title: 'Article details', default: true}, {name: 'story', title: 'Story content'}, {name: 'resources', title: 'Files and links'}],
    initialValue: {category: 'Blog post', body: blogTemplate},
    fields: [title, slug, summary, publishedAt].map(field => ({...field, group: 'details'})).concat([
      defineField({name: 'category', title: 'Category', group: 'details', type: 'string', description: 'For example: Project news, Blog post or Event update. Shown beside the date in the Blog Posts archive.'}),
      defineField({name: 'author', title: 'Author or publishing organisation', type: 'string', group: 'details'}),
      defineField({name: 'tags', title: 'Topics / tags', type: 'array', group: 'details', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
      defineField({name: 'byline', title: 'Contributor byline', type: 'string', group: 'story', description: 'Optional separate writing credit, for example “By [name], [organisation]”. Appears before the introduction.'}),
      {...image('heroImage', 'Featured photo / card image'), group: 'story'}, articleBody, {...attachments, group: 'resources'},
      defineField({name: 'hub', title: 'Related innovation hub', type: 'reference', group: 'resources', to: [{type: 'innovationHub'}]}),
    ]),
    orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
    preview: {select: {title: 'title', subtitle: 'category', media: 'heroImage'}},
  }),
  defineType({name: 'outcome', title: 'Outcome', type: 'document',
    fields: [title, slug, summary, publishedAt,
      defineField({name: 'kind', title: 'Outcome type', type: 'string', options: {list: ['Publication', 'Report', 'Deliverable', 'Tool', 'Dataset', 'Guidance']}}),
      defineField({name: 'externalUrl', title: 'External link or DOI URL', type: 'url', validation: R => R.uri({scheme: ['http', 'https']})}),
      image('heroImage', 'Outcome image'), body, attachments,
      defineField({name: 'hub', title: 'Related innovation hub', type: 'reference', to: [{type: 'innovationHub'}]}),
    ], preview: {select: {title: 'title', subtitle: 'kind', media: 'heroImage'}},
  }),
  defineType({name: 'innovationHub', title: 'Individual hub or replication site', type: 'document',
    groups: [{name: 'details', title: 'Site details', default: true}, {name: 'story', title: 'Full content'}, {name: 'media', title: 'Images and downloads'}],
    fields: [title, slug,
      defineField({name: 'hubKey', title: 'Homepage map location', type: 'string', options: {list: [
        ...hubKeys.map(key => ({title: `${key[0].toUpperCase()}${key.slice(1)} (DRMIH)`, value: key})),
        ...replicationDefaults.map(site => ({title: `${site.title} (Replication site)`, value: site.siteKey})),
      ]}, validation: R => R.required(), description: 'Use one record per location. Map summaries are edited in RESILIACT Hubs > Page content; edit full content, images, galleries and downloads here.'}),
      defineField({name: 'country', title: 'Country', type: 'string', validation: R => R.required()}),
      summary,
      defineField({name: 'localAuthority', title: 'Local authority or partner', type: 'string', validation: R => R.required()}),
      defineField({name: 'livingLabApproach', title: 'The local charter for multi-stakeholders', type: 'text', rows: 3}),
      image('heroImage', 'Hub image'), body,
      defineField({name: 'gallery', title: 'Gallery', type: 'array', of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string', validation: R => R.required()})]})]}),
      attachments,
    ].map(field => ({...field, group: field.name === 'body' ? 'story' : ['heroImage', 'gallery', 'attachments'].includes(field.name) ? 'media' : 'details'})),
    preview: {select: {title: 'title', subtitle: 'country', media: 'heroImage'}},
  }),
]
