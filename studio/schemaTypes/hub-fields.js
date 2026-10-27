import {defineArrayMember, defineField} from 'sanity'
import {hazardIcons, stakeholderIcons} from '../../scripts/pilot-profile.mjs'

const imageFields = [
  defineField({name: 'alt', title: 'Alternative text', type: 'string', validation: R => R.required()}),
  defineField({name: 'caption', title: 'Caption', type: 'text', rows: 2}),
  defineField({name: 'credit', title: 'Image credit', type: 'string'}),
]

export const hubContentFields = [
  defineField({name: 'contentMerged', title: 'Content stored in this list', type: 'boolean', hidden: true, initialValue: true}),
  defineField({name: 'slug', title: 'Content address', type: 'slug', options: {source: (_document, {parent}) => parent?.title}}),
  defineField({name: 'heroImage', title: 'Featured image', type: 'image', options: {hotspot: true}, fields: imageFields}),
  defineField({name: 'siteOverview', title: 'Site profile: aim, why, how and icons', type: 'object', description: 'The three-column purpose row and labelled icon sections on this site’s individual page. Keep these aligned with the summary and local charter.', fields: [
    ...[['aim', 'Aim'], ['why', 'Why'], ['how', 'How']].map(([name, title]) => defineField({name, title, type: 'text', rows: 5})),
    ...[['hazards', 'Hazards', hazardIcons], ['stakeholders', 'Stakeholders involved', stakeholderIcons]].map(([name, title, choices]) => defineField({name, title, type: 'array', description: 'Add, remove or reorder icons. Give each icon a clear, site-specific label.', of: [defineArrayMember({type: 'object', fields: [
      defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: choices}, validation: R => R.required()}),
      defineField({name: 'label', title: 'Display label', type: 'string', validation: R => R.required()}),
    ], preview: {select: {title: 'label', subtitle: 'icon'}}})]})),
  ]}),
  defineField({name: 'body', title: 'Full content', type: 'array', description: 'Write the full hub or replication-site story with paragraphs, headings, lists, links and images.', of: [
    defineArrayMember({type: 'block', styles: [
      {title: 'Normal', value: 'normal'}, {title: 'Heading', value: 'h2'},
      {title: 'Subheading', value: 'h3'}, {title: 'Quote', value: 'blockquote'},
    ], marks: {
      decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}],
      annotations: [{name: 'link', title: 'Link', type: 'object', fields: [
        defineField({name: 'href', title: 'URL', type: 'url', validation: R => R.uri({scheme: ['http', 'https', 'mailto']})}),
      ]}],
    }}),
    defineArrayMember({type: 'image', options: {hotspot: true}, fields: imageFields}),
  ]}),
  defineField({name: 'gallery', title: 'Gallery', type: 'array', of: [
    defineArrayMember({type: 'image', options: {hotspot: true}, fields: imageFields}),
  ]}),
  defineField({name: 'attachments', title: 'Downloadable files', type: 'array', of: [
    defineArrayMember({type: 'file', fields: [
      defineField({name: 'title', title: 'Download label', type: 'string', validation: R => R.required()}),
    ]}),
  ]}),
]
