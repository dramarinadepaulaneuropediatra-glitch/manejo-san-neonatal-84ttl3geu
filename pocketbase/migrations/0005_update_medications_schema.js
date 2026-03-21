migrate(
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('medications')

      if (!col.fields.getByName('initial_dose')) {
        col.fields.add(new TextField({ name: 'initial_dose' }))
      }
      if (!col.fields.getByName('maintenance_dose')) {
        col.fields.add(new TextField({ name: 'maintenance_dose' }))
      }
      if (!col.fields.getByName('references')) {
        col.fields.add(new TextField({ name: 'references' }))
      }

      app.save(col)
    } catch (err) {
      console.log('Error updating medications schema:', String(err))
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('medications')
      col.fields.removeByName('initial_dose')
      col.fields.removeByName('maintenance_dose')
      col.fields.removeByName('references')
      app.save(col)
    } catch (err) {}
  },
)
