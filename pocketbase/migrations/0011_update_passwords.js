migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    // Attempt to update the min length of the password field to allow 'HJK2026' (7 chars)
    try {
      const pwdField = users.fields.getByName('password')
      if (pwdField) {
        pwdField.min = 7
        app.save(users)
      }
    } catch (err) {
      console.log('Skipping password field schema update or field not found:', err)
    }

    // Update all existing users to the unified password 'HJK2026'
    const records = app.findRecordsByFilter('users', '1=1', '', 10000, 0)
    for (const record of records) {
      record.setPassword('HJK2026')
      app.saveNoValidate(record)
    }
  },
  (app) => {
    // Reverting passwords to previous state is not possible
  },
)
