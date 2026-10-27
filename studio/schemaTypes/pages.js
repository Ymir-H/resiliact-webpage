import {defineArrayMember, defineField, defineType} from 'sanity'
import {hubKeys, drmiDefaults} from '../../scripts/hub-content.mjs'
import {replicationDefaults} from '../../scripts/replication-content.mjs'
import {hubContentFields} from './hub-fields.js'

export const sectionTypes = ['homePage', 'projectPage', 'platformPage', 'hubsPage', 'outcomesPage', 'consortiumPage', 'newsPage', 'contactPage']
const string = (name, title, required = true) => defineField({name, title, type: 'string', ...(required ? {validation: R => R.required()} : {})})
const text = (name, title, required = true) => defineField({name, title, type: 'text', rows: 3, ...(required ? {validation: R => R.required()} : {})})
const common = [string('navigationLabel', 'Navigation label'), string('eyebrow', 'Section label'), text('heading', 'Heading (new lines are supported)'),
  defineField({name: 'homeSummary', title: 'Homepage summary', type: 'text', rows: 3, description: 'Short introduction on the homepage. Leave empty to use the page introduction. Full content below appears only on this dedicated page.'}),
  defineField({name: 'pageBody', title: 'Additional page content', type: 'array', description: 'Extend the existing section content with headings, paragraphs, links and images. This content appears only on the dedicated page.', of: [
    defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}, {title: 'Heading', value: 'h2'}, {title: 'Subheading', value: 'h3'}, {title: 'Quote', value: 'blockquote'}], marks: {
      decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}],
      annotations: [{name: 'link', title: 'Link', type: 'object', fields: [defineField({name: 'href', title: 'URL or page path', type: 'url', validation: R => R.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']})})]}],
    }}),
    defineArrayMember({type: 'image', fields: [string('alt', 'Image description'), string('credit', 'Image credit', false)]}),
  ]}),
  defineField({name: 'pageAttachments', title: 'Page downloads', type: 'array', of: [defineArrayMember({type: 'file', fields: [string('title', 'Download label')]})]}),
]
const list = (name, title, fields, minimum = 1) => defineField({name, title, type: 'array', validation: R => R.required().min(minimum), of: [defineArrayMember({type: 'object', fields})]})
const url = (name, title) => defineField({name, title, type: 'url', validation: R => R.required().uri({scheme: ['https', 'http']})})
const overviewFields = [string('eyebrow', 'Section label'), text('heading', 'Homepage section heading'), text('lead', 'Opening paragraph'),
  defineField({name: 'paragraphs', title: 'Description paragraphs', type: 'array', of: [defineArrayMember({type: 'text'})], validation: R => R.required().min(1)}),
  list('principles', 'Project principles', [string('title', 'Title'), text('description', 'Description')]),
  ...common.filter(field => ['pageBody', 'pageAttachments'].includes(field.name)).map(field => ({...field,
    title: field.name === 'pageBody' ? 'Additional homepage Project content' : 'Homepage Project downloads',
    description: 'Appears in The project section on the homepage.',
  })),
]
const page = (name, title, fields) => defineType({name, title, type: 'document',
  fields: [...(name === 'projectPage' ? common.filter(field => ['navigationLabel', 'pageBody', 'pageAttachments'].includes(field.name)) : common).map(field => {
  if (field.name === 'homeSummary') return {...field, hidden: true}
  if (field.name === 'navigationLabel' && ['platformPage', 'consortiumPage'].includes(name)) return {...field, hidden: true}
  if (field.name === 'pageBody' || field.name === 'pageAttachments') return {...field, description: name === 'platformPage' ? 'Appears in the RESILIACT Platform section on the Outcomes page.' : name === 'consortiumPage' ? 'Appears in this section within About RESILIACT.' : ['hubsPage', 'newsPage'].includes(name) ? 'Appears on the homepage and the corresponding page.' : name === 'contactPage' ? "Appears in Let's connect on the homepage." : 'Appears on this page.'}
  return field
}), ...fields], ...(name === 'hubsPage' ? {initialValue: {drmihSites: drmiDefaults, replicationSites: replicationDefaults}} : {}), preview: {prepare: () => ({title})}})

export const pageSchemaTypes = [
  defineType({name: 'homePage', title: 'Home', type: 'document', fields: [
    string('pageTitle', 'Browser page title'), text('pageDescription', 'Page description'),
    string('eyebrow', 'Opening section label'), text('heading', 'Main heading (before highlighted text)'),
    string('highlight', 'Highlighted heading text'), text('lead', 'Introduction'), text('description', 'Project description'),
    defineField({name: 'heroImage', title: 'Background image (optional replacement)', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroGallery', title: 'Hero media gallery', type: 'array', description: 'Add pictures or muted background videos, and drag to reorder. An empty gallery uses the background image above.', of: [defineArrayMember({name: 'heroMediaItem', title: 'Hero media', type: 'object', fields: [
      string('title', 'Media title'),
      defineField({name: 'mediaType', title: 'Media type', type: 'string', initialValue: 'image', options: {list: [{title: 'Image', value: 'image'}, {title: 'Video', value: 'video'}], layout: 'radio'}, validation: R => R.required()}),
      defineField({name: 'image', title: 'Picture', type: 'image', options: {hotspot: true}, hidden: ({parent}) => parent?.mediaType !== 'image', validation: R => R.custom((value, context) => context.parent?.mediaType === 'image' && !value?.asset ? 'Upload a picture' : true)}),
      defineField({name: 'video', title: 'Video file', type: 'file', options: {accept: 'video/mp4,video/webm'}, description: 'Upload a web-ready MP4 or WebM. Videos play without sound.', hidden: ({parent}) => parent?.mediaType !== 'video', validation: R => R.custom((value, context) => context.parent?.mediaType === 'video' && !value?.asset ? 'Upload a video' : true)}),
      defineField({name: 'poster', title: 'Video preview picture', type: 'image', hidden: ({parent}) => parent?.mediaType !== 'video'}),
      defineField({name: 'durationSeconds', title: 'Display duration (seconds)', type: 'number', description: 'Optional. Leave blank for 7 seconds per photo or the full video. For videos, this sets the maximum playback time; a shorter clip advances when it ends.', validation: R => R.integer().min(1).max(300)}),
      string('alt', 'Media description'), string('credit', 'Photo or video credit', false),
      defineField({name: 'creditUrl', title: 'Credit link', type: 'url', validation: R => R.uri({scheme: ['https', 'http']})}),
    ], preview: {select: {title: 'title', subtitle: 'mediaType', media: 'image'}}})]}),
    string('imageAlt', 'Background image description'),
    list('actions', 'Action buttons', [string('label', 'Button label'), defineField({name: 'target', title: 'Section anchor or website URL', type: 'string', validation: R => R.required().custom(value => {
      if (value === '/#contact' || /^#[a-z][a-z0-9-]*$/.test(value || '') || /^\/(project|platform|innovation-hubs|outcomes|consortium|news|contact)?\/?$/.test(value || '')) return true
      try {return ['https:', 'http:'].includes(new URL(value).protocol) || 'Use a page path, section anchor or HTTP(S) URL'} catch {return 'Use a page path, section anchor or HTTP(S) URL'}
    })})]),
    string('sideLabel', 'Side caption label'), text('sideCaption', 'Side caption'),
    string('bottomLabel', 'Bottom banner label'), string('exploreLabel', 'Explore link label'),
    list('facts', 'Project facts', [string('value', 'Number or value'), string('label', 'Label')]),
    defineField({name: 'projectOverview', title: 'The project — homepage section', type: 'object', fields: overviewFields}),
  ], preview: {prepare: () => ({title: 'Home'})}}),
  page('projectPage', 'About RESILIACT', [
    defineField({name: 'projectDetails', title: 'About Project, timeline and research community', description: 'Page order: About Project, timeline, Consortium, Research community. Edit Consortium under About RESILIACT and the RESILIACT Platform under Outcomes.', type: 'object', fields: [
      string('aboutHeading', 'About Project heading'),
      text('aboutIntro', 'Project introduction', false),
      {...string('objectivesHeading', 'Objectives and expected results heading', false), hidden: true},
      defineField({name: 'aboutText', title: 'About Project paragraphs', type: 'array', hidden: true, of: [defineArrayMember({type: 'text'})]}),
      {...list('objectives', 'Project objectives', [string('title', 'Title'), text('description', 'Description')]), hidden: true, validation: undefined},
      {...list('results', 'Expected results', [string('title', 'Title'), text('description', 'Description')]), hidden: true, validation: undefined},
      defineField({name: 'figure', title: 'Project overview figure (replaces placeholder)', type: 'image', fields: [string('alt', 'Image description')]}),
      text('figureCaption', 'Figure caption'),
      string('timelineHeading', 'Timeline heading'), text('timelineIntro', 'Timeline introduction'),
      list('milestones', 'Interactive timeline phases (drag to reorder)', [string('label', 'Short phase label'), string('dateLabel', 'Date or period'), string('title', 'Milestone title'), text('description', 'Milestone description')]),
      string('communityHeading', 'Research community heading'), text('communityIntro', 'Research community introduction'),
      defineField({name: 'sisterProjects', title: 'Sister projects', type: 'array', of: [defineArrayMember({type: 'object', fields: [
        string('name', 'Project name'), text('description', 'Description'),
        defineField({name: 'logo', title: 'Project or network logo', type: 'image', fields: [string('alt', 'Logo alternative text', false)]}),
        defineField({name: 'logoSource', title: 'Logo source', type: 'url', readOnly: true}),
        defineField({name: 'category', title: 'Project or network label', type: 'string', options: {list: ['Sister project', 'Research project', 'Research network']}}),
        defineField({name: 'placeholder', title: 'Mark as placeholder', type: 'boolean', initialValue: false}),
        defineField({name: 'website', title: 'Sister project website', type: 'url', validation: R => R.uri({scheme: ['http', 'https']})}),
      ]})]}),
    ]}),
  ]),
  page('platformPage', 'Platform section', [text('intro', 'Introduction'),
    defineField({name: 'headingColor', title: 'Heading colour', type: 'string', initialValue: '#ffffff', description: 'Choose a light colour for the heading on the dark Platform background.', options: {list: [{title: 'White', value: '#ffffff'}, {title: 'Light cyan', value: '#76dfe8'}, {title: 'Pale blue', value: '#d5e6ed'}]}, validation: R => R.custom(value => !value || ['#ffffff', '#76dfe8', '#d5e6ed'].includes(value) || 'Choose one of the available heading colours')}),
    list('components', 'Platform components (drag to reorder)', [string('label', 'Button label'), string('code', 'Short code'), string('title', 'Detail title'), text('description', 'Description'), text('outcome', 'What this enables')]),
    string('developmentNote', 'Development note', false),
  ]),
  page('hubsPage', 'RESILIACT Hubs', [text('intro', 'Introduction'), string('listHeading', 'Pilot button rows heading'),
    {...list('drmihSites', 'DRMIH hub list', [
      defineField({name: 'hubKey', title: 'Map location', type: 'string', options: {list: hubKeys}, validation: R => R.required()}),
      string('title', 'Location'), string('country', 'Country'), text('summary', 'Site description', false),
      text('localAuthority', 'Local authority or participating organisations', false), text('livingLabApproach', 'The local charter for multi-stakeholders', false),
      ...hubContentFields,
    ]), description: 'Open a Nordic hub to edit its map summary, full content, images, gallery and downloads.'},
    defineField({name: 'replicationEyebrow', title: 'Legacy replication section label', type: 'string', hidden: true}),
    list('replicationSites', 'Replication site list', [
      defineField({name: 'siteKey', title: 'Map location', type: 'string', options: {list: replicationDefaults.map(site => site.siteKey)}, validation: R => R.required()}),
      string('title', 'Location'), string('country', 'Country'), text('summary', 'Site description', false),
      text('localAuthority', 'Local authority or participating organisations', false), text('livingLabApproach', 'The local charter for multi-stakeholders', false),
      ...hubContentFields,
    ]),
  ]),
  page('outcomesPage', 'Outcomes overview', [text('intro', 'Introduction'), string('publishedHeading', 'Published outcomes heading'),
    list('expectedOutcomes', 'Expected outcome cards', [text('title', 'Title'), text('description', 'Description'), string('linkLabel', 'Link label'),
      defineField({name: 'linkTarget', title: 'Link destination', type: 'string', validation: R => R.required().custom(value => {
        if (!value || value === '/#contact' || /^#[a-z][a-z0-9-]*$/.test(value) || /^\/(project|platform|innovation-hubs|outcomes|consortium|news|contact)?\/?$/.test(value)) return true
        try {return ['https:', 'http:'].includes(new URL(value).protocol) || 'Use a section anchor or an HTTP(S) URL'} catch {return 'Use a section anchor or an HTTP(S) URL'}
      })}),
    ]),
  ]),
  page('consortiumPage', 'Consortium section', [text('intro', 'Introduction'), string('coordinatorLabel', 'Coordinator label'), string('coordinatorName', 'Coordinator name'), string('coordinatorCountry', 'Coordinator country'),
    {...string('pageHeading', 'Consortium section heading', false), initialValue: 'Who we are'},
    {...string('teamHeading', 'Team introduction heading', false), initialValue: 'Meet the RESILIACT team'},
    {...string('partnersHeading', 'Partner grid heading', false), initialValue: 'Partners'},
    {...string('associatedHeading', 'Associated partner grid heading', false), initialValue: 'Associated partners'},
    defineField({name: 'teamPhoto', title: 'Optional consortium team photo', type: 'image', options: {hotspot: true}, fields: [string('alt', 'Alternative text'), text('caption', 'Photo caption', false)]}),
    defineField({name: 'coordinatorLogo', title: 'Coordinator logo', type: 'image', fields: [string('alt', 'Alternative text')]}),
    defineField({name: 'coordinatorWebsite', title: 'Coordinator official website', type: 'url', validation: R => R.uri({scheme: ['http', 'https']})}),
    text('coordinatorDescription', 'Coordinator introduction (optional)', false),
    list('partners', 'Partner organisations (drag to reorder)', [string('name', 'Organisation'), string('country', 'Country'),
      defineField({name: 'logo', title: 'Partner logo', type: 'image', fields: [string('alt', 'Alternative text')]}),
      url('website', 'Official website'), text('description', 'Partner introduction (optional)', false),
      defineField({name: 'group', title: 'Partner group', type: 'string', initialValue: 'partner', options: {list: [{title: 'Partner', value: 'partner'}, {title: 'Associated partner', value: 'associated'}]}}),
      defineField({name: 'logoBackground', title: 'Logo background', type: 'string', initialValue: 'white', options: {list: ['white', 'navy', 'pale']}}),
      text('logoNote', 'Logo clarification (optional)', false),
      defineField({name: 'logoSource', title: 'Original logo source', type: 'url', readOnly: true}),
    ]),
  ]),
  page('newsPage', 'News and Events overview', [text('intro', 'Introduction', false),
    {...string('pageHeading', 'Dedicated page heading', false), initialValue: 'News & Events'},
    {...string('eventsHeading', 'Events section heading', false), initialValue: 'Events calendar'},
    text('eventsIntro', 'Events introduction', false),
    {...string('calendarButtonLabel', 'Calendar button label', false), initialValue: 'Go to the events calendar'},
    defineField({name: 'calendarUrl', title: 'Legacy external calendar URL', type: 'url', hidden: true}),
    {...string('calendarHeading', 'Calendar page heading', false), initialValue: 'Events calendar'},
    text('calendarIntro', 'Calendar page introduction', false),
    {...string('newsHeading', 'Media news heading', false), initialValue: 'News'}, text('newsIntro', 'Media news introduction', false),
    defineField({name: 'mediaLinks', title: 'Media and partner news links', type: 'array', description: 'External coverage shown under News. Project articles appear in the Blog Posts archive.', of: [defineArrayMember({type: 'object', fields: [
      string('title', 'Headline'), url('url', 'Article URL'), string('source', 'Publication or partner'),
      defineField({name: 'date', title: 'Publication date', type: 'date', validation: R => R.required()}),
    ], preview: {select: {title: 'title', subtitle: 'source'}}})]}),
    {...string('blogHeading', 'Article archive heading', false), initialValue: 'Blog Posts'}, text('blogIntro', 'Article archive introduction', false),
  ]),
  page('contactPage', "Let's connect (homepage)", [text('intro', 'Introduction'), string('organisation', 'Organisation'), string('role', 'Contact role'), text('address', 'Address'),
    defineField({name: 'email', title: 'Contact email (optional)', type: 'email'}),
    string('websiteLabel', 'Organisation website link label'), url('websiteUrl', 'Organisation website URL'), string('projectLinkLabel', 'Project reference link label'), url('projectLinkUrl', 'Project reference URL'),
  ]),
]
