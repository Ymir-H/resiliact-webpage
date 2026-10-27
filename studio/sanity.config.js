import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes/index.js'
import {sectionTypes} from './schemaTypes/pages.js'
import {hubsStructure} from './hubs-structure.js'

const singletons = new Set(sectionTypes)
const section = (S, type, id, title) => S.listItem().id(id).title(title).child(S.document().schemaType(type).documentId(`section-${id}`).title(title))

export default defineConfig({
  name: 'resiliact',
  title: 'RESILIACT Content Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'unconfigured',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({structure: (S) => S.list().title('Project content').items([
    S.listItem().id('home').title('Home').child(S.list().title('Homepage sections').items([
      section(S, 'homePage', 'home', 'Hero gallery and project overview').id('home-content'),
      section(S, 'hubsPage', 'hubs', 'RESILIACT Hubs (shared with Hubs page)').id('home-hubs'),
      section(S, 'newsPage', 'news', 'News and Events (shared with News page)').id('home-news'),
      section(S, 'contactPage', 'contact', "Let's connect").id('home-contact'),
    ])),
    S.listItem().id('project').title('About RESILIACT').child(S.list().title('About RESILIACT sections').items([
      section(S, 'projectPage', 'project', 'About Project, timeline and research community').id('project-content'),
      section(S, 'consortiumPage', 'consortium', 'Consortium (before research community)').id('project-consortium'),
    ])),
    hubsStructure(S),
    S.listItem().id('outcomes').title('Outcomes').child(S.list().title('Outcomes').items([
      section(S, 'outcomesPage', 'outcomes', 'Page content').id('outcomes-overview'),
      section(S, 'platformPage', 'platform', 'RESILIACT Platform').id('outcomes-platform'),
      S.documentTypeListItem('outcome').id('outcomes-records').title('Published outcomes and resources'),
    ])),
    S.listItem().id('news').title('News and Events').child(S.list().title('News and Events').items([
      section(S, 'newsPage', 'news', 'Page content and media links').id('news-overview'),
      S.documentTypeListItem('news').id('news-records').title('Articles and blog posts'),
      S.documentTypeListItem('projectEvent').id('news-events').title('Events'),
    ])),
  ])})],
  schema: {types: schemaTypes, templates: templates => templates.filter(template => !singletons.has(template.schemaType) && template.schemaType !== 'innovationHub')},
  document: {
    actions: (actions, context) => singletons.has(context.schemaType) ? actions.filter(action => ['publish', 'unpublish', 'discardChanges', 'restore'].includes(action.action)) : actions,
  },
})
