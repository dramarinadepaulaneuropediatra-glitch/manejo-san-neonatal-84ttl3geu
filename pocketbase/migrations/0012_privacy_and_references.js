migrate(
  (app) => {
    // 1. Update rules for responses collection to enforce privacy and admin access
    const responses = app.findCollectionByNameOrId('responses')
    responses.listRule =
      "user_id = @request.auth.id || @request.auth.email = 'dramarinadepaulaneuropediatra@gmail.com'"
    responses.viewRule =
      "user_id = @request.auth.id || @request.auth.email = 'dramarinadepaulaneuropediatra@gmail.com'"
    app.save(responses)

    // 2. Remove external links from medications and update to standardized text references
    const meds = app.findRecordsByFilter('medications', "id != ''", '', 100, 0)
    for (const med of meds) {
      med.set('references', 'Fontes Base: JAMA, Pediatrics, Neurology, SBP, Neofax')
      app.save(med)
    }
  },
  (app) => {
    // Revert responses collection rules
    const responses = app.findCollectionByNameOrId('responses')
    responses.listRule = "@request.auth.id != ''"
    responses.viewRule = "@request.auth.id != ''"
    app.save(responses)

    // Clear references since we can't reliably restore previous external links
    const meds = app.findRecordsByFilter('medications', "id != ''", '', 100, 0)
    for (const med of meds) {
      med.set('references', '')
      app.save(med)
    }
  },
)
