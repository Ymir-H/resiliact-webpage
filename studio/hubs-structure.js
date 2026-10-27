export function hubsStructure(S) {
  return S.listItem().id('hubs').title('RESILIACT Hubs').child(
    S.document().schemaType('hubsPage').documentId('section-hubs').title('RESILIACT Hubs'),
  )
}
