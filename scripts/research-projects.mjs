const researchSummaries = {
  turnkey: {
    description: 'Connecting earthquake forecasting, early warning and rapid response in a multi-sensor information system to help communities prepare for earthquakes and reduce their impacts.',
    summarySource: 'https://earthquake-turnkey.eu/',
  },
  c2impress: {
    description: 'Combining multi-hazard risk assessment, forecasting and citizen participation to help authorities and communities understand disaster risks, improve preparedness and support climate adaptation.',
    summarySource: 'https://www.c2impress.com/about-us',
  },
  gobeyond: {
    description: 'Developing impact-based early warning for geological and weather hazards to help civil protection authorities anticipate consequences and coordinate faster, more effective emergency response.',
    summarySource: 'https://gobeyond-project.eu/our-vision/',
  },
  'driver-plus': {
    description: 'Helping crisis management practitioners assess innovative solutions through realistic trials, shared testing tools and a portfolio of technologies, supported by a European knowledge network.',
    summarySource: 'https://www.driver-project.eu/',
  },
  engage: {
    description: 'Strengthening societal resilience by connecting citizens, communities and emergency organisations, with practical knowledge and guidance for cooperation before, during and after disasters.',
    summarySource: 'https://www.project-engage.eu/',
  },
  synergies: {
    description: 'Turning results from disaster risk management projects into practical preparedness measures, with a focus on training, citizen communication, volunteer coordination and collaboration across society.',
    summarySource: 'https://synergiesproject.eu/',
  },
  paratus: {
    description: 'Co-developing tools to understand interacting hazards, cascading impacts and systemic vulnerability, helping responders and other stakeholders prepare for complex disasters and assess risk reduction options.',
    summarySource: 'https://www.paratus-project.eu/',
  },
  anywhere: {
    description: 'Combining weather impact forecasts, multi-hazard early warning and locally tailored decision support to help civil protection authorities and communities anticipate and manage extreme weather emergencies.',
    summarySource: 'http://anywhere-h2020.eu/',
  },
  links: {
    description: 'Improving how social media and crowdsourcing support disaster management, through practical tools, guidance and shared learning that connect technologies, practitioners and communities.',
    summarySource: 'https://links-project.eu/',
  },
  direktion: {
    description: 'Connecting first responders, researchers and technology providers to identify capability gaps, assess innovative solutions and accelerate the uptake of technologies for disaster response and recovery.',
    summarySource: 'https://www.direktion-network.org/',
  },
  riskpacc: {
    description: 'Bringing citizens and civil protection authorities together to close gaps between risk perception and action, co-creating tools and approaches that improve communication, preparedness and disaster resilience.',
    summarySource: 'https://www.riskpacc.eu/about-riskpacc/',
  },
  'aristotle-enhsp': {
    description: 'Providing round-the-clock scientific advice on multiple natural hazards worldwide to support the European Emergency Response Coordination Centre with monitoring, situational awareness and emergency assessment.',
    summarySource: 'https://aristotle.ingv.it/HomePage',
  },
}

export const researchProjects = [
  {_key: 'turnkey', name: 'TURNkey', website: 'https://earthquake-turnkey.eu/'},
  {_key: 'c2impress', name: 'C2IMPRESS', website: 'https://www.c2impress.com'},
  {_key: 'gobeyond', name: 'Gobeyond', website: 'https://gobeyond-project.eu/'},
  {_key: 'driver-plus', name: 'Driver+', website: 'https://www.driver-project.eu/'},
  {_key: 'engage', name: 'engage', website: 'https://www.project-engage.eu'},
  {_key: 'synergies', name: 'Synergies', website: 'https://synergiesproject.eu'},
  {_key: 'paratus', name: 'Paratus', website: 'https://www.paratus-project.eu'},
  {_key: 'anywhere', name: 'ANYWHERE', website: 'http://anywhere-h2020.eu'},
  {_key: 'links', name: 'Links', website: 'https://links-project.eu'},
  {_key: 'direktion', name: 'DIREKTION', website: 'https://www.direktion-network.org'},
  {_key: 'riskpacc', name: 'RiskPACC', website: 'https://www.riskpacc.eu'},
  {_key: 'aristotle-enhsp', name: 'ARISTOTLE-ENHSP', website: 'http://aristotle.ingv.it'},
].map(project => ({...project, ...researchSummaries[project._key], category: 'Research project', placeholder: false}))
