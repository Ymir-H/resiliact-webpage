import assert from 'node:assert/strict'
import {Schema} from '@sanity/schema'
import {createStructureBuilder} from 'sanity/structure'
import config from '../sanity.config.js'

const schema = Schema.compile({name: 'structure-check', types: config.schema.types})
const builder = createStructureBuilder({source: {
  schema, projectId: config.projectId, dataset: config.dataset, templates: [],
}, perspectiveStack: ['published']})
const root = config.plugins[0].tools[0].options.structure(builder).serialize()
assert.deepEqual(root.items.map(item => item.title), ['Home', 'About RESILIACT', 'RESILIACT Hubs', 'Outcomes', 'News and Events'])
assert.deepEqual(root.items[0].child.items.map(item => item.child.options.id), ['section-home', 'section-hubs', 'section-news', 'section-contact'])
assert.deepEqual(root.items[1].child.items.map(item => item.child.options.id), ['section-project', 'section-consortium'])
assert.equal(root.items.find(item => item.id === 'outcomes').child.items[1].child.options.id, 'section-platform')
assert.ok(schema.get('homePage').fields.some(field => field.name === 'projectOverview'))
assert.ok(schema.get('projectPage').fields.some(field => field.name === 'projectDetails'))
assert.equal(schema.get('projectPage').fields.some(field => field.name === 'lead'), false)
assert.ok(schema.get('projectEvent').fields.some(field => field.name === 'startsAt'))
assert.ok(schema.get('projectEvent').fields.some(field => field.name === 'slug'))
assert.ok(schema.get('projectEvent').fields.some(field => field.name === 'heroImage'))
assert.ok(schema.get('projectEvent').fields.some(field => field.name === 'organizer'))
assert.ok(schema.get('newsPage').fields.some(field => field.name === 'mediaLinks'))
assert.ok(schema.get('consortiumPage').fields.some(field => field.name === 'coordinatorLogo'))
assert.ok(schema.get('consortiumPage').fields.find(field => field.name === 'partners').type.of[0].fields.some(field => field.name === 'logo'))
assert.ok(schema.get('consortiumPage').fields.find(field => field.name === 'partners').type.of[0].fields.some(field => field.name === 'website'))
assert.ok(schema.get('news').fields.some(field => field.name === 'byline'))
assert.ok(schema.get('news').fields.find(field => field.name === 'body').type.of.some(member => member.name === 'pullQuote'))
assert.equal(root.items.find(item => item.id === 'news').child.items[2].id, 'news-events')
function checkMenu(menu) {
  assert.equal(new Set(menu.items.map(item => item.id)).size, menu.items.length)
  for (const item of menu.items) if (item.child.type === 'list') checkMenu(item.child)
}
checkMenu(root)
assert.equal(root.items.find(item => item.id === 'hubs').child.options.id, 'section-hubs')
for (const id of ['outcomes', 'news']) {
  const children = root.items.find(item => item.id === id).child.items
  assert.equal(children[0].child.options.id, `section-${id}`)
  assert.equal(children.find(item => item.id === `${id}-records`).id, `${id}-records`)
}
for (const type of ['platformPage', 'consortiumPage']) assert.equal(config.schema.types.find(item => item.name === type).fields.find(field => field.name === 'navigationLabel').hidden, true)
console.log('PASS: New site hierarchy, shared homepage editors, unique menu IDs and unchanged content document IDs')
