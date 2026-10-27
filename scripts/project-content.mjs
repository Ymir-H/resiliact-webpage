import {researchProjects} from './research-projects.mjs'

export const projectDetails = {
  aboutHeading: 'About Project',
  aboutIntro: 'RESILIACT brings together public authorities, researchers, technology providers and communities to strengthen preparedness for complex and cascading disasters. The project is developing an integrated web-based platform that connects data, multi-hazard impact forecasting, early warning, decision support and emergency risk communication. Through five Nordic innovation hubs and six replication sites, partners co-create and evaluate practical approaches to help authorities anticipate impacts, coordinate action and build resilient governance across regions.',
  objectivesHeading: 'Project objectives and expected results',
  aboutText: [
    'RESILIACT connects multi-hazard impact forecasting, early warning and resilient governance. The project develops an integrated web-based platform to help authorities anticipate interacting hazards and coordinate early action across organisations and sectors.',
    'Research and development are shaped by local practice. Authorities, researchers, businesses and civil society work together through Nordic innovation hubs, while replication activities explore how the solutions can be adapted to other regions.',
  ],
  objectives: [
    {_key: 'impacts', title: 'Anticipate connected impacts', description: 'Connect hazard, exposure and vulnerability information to understand concurrent and cascading risks.'},
    {_key: 'decisions', title: 'Turn warnings into decisions', description: 'Link impact forecasts with decision support and coordinated risk communication.'},
    {_key: 'practice', title: 'Build with local communities', description: 'Co-design and evaluate solutions with authorities and practitioners through Living Labs.'},
  ],
  results: [
    {_key: 'platform', title: 'An integrated platform', description: 'A shared environment for data, forecasting, early warning, decision support and risk communication.'},
    {_key: 'evidence', title: 'Evidence from local practice', description: 'Knowledge from co-design and evaluation in the Nordic innovation hubs.'},
    {_key: 'transfer', title: 'Transferable knowledge', description: 'Lessons on adapting solutions and governance approaches across regions and institutions.'},
  ],
  figureCaption: 'Project objectives and expected results — figure placeholder. Upload the project overview figure in Sanity.',
  timelineHeading: 'Project timeline',
  timelineIntro: 'Explore how the project moves from shared needs to practical solutions. The phases below are illustrative; dates and milestones will be confirmed by the project team.',
  milestones: [
    {_key: 'design', label: 'Co-design', dateLabel: 'Dates to be confirmed', title: 'Understand needs and shape the approach', description: 'Bring together authorities, researchers and communities to define needs, use cases and requirements.'},
    {_key: 'development', label: 'Development', dateLabel: 'Dates to be confirmed', title: 'Develop and connect the platform', description: 'Connect shared data, hazard interactions, impact forecasting, decision support and risk communication.'},
    {_key: 'evaluation', label: 'Evaluation', dateLabel: 'Dates to be confirmed', title: 'Test with the innovation hubs', description: 'Co-design, test and evaluate solutions in the Living Labs with local authorities and practitioners.'},
    {_key: 'replication', label: 'Replication', dateLabel: 'Dates to be confirmed', title: 'Share lessons across regions', description: 'Explore how solutions and governance approaches can be adapted and share the knowledge gained.'},
  ],
  communityHeading: 'Research community',
  communityIntro: 'Connect with sister projects and research networks working on disaster resilience, multi-hazard risk management and coordinated action.',
  sisterProjects: [
    {_key: 'together', name: 'TOGETHER', category: 'Sister project', description: 'Improving coordination and governance in disaster risk management through cross-sector collaboration and communication.', website: 'https://together-euproject.eu/', placeholder: false},
    {_key: 'mediate', name: 'MEDiate', category: 'Sister project', description: 'Decision support for local and regional disaster risk management, considering interacting natural hazards and cascading impacts.', website: 'https://mediate-project.eu/', placeholder: false},
    {_key: 'cmine', name: 'CMINE', category: 'Research network', description: 'Crisis Management Innovation Network Europe.', website: 'https://www.cmine.eu/', placeholder: false},
    ...researchProjects,
  ],
}
