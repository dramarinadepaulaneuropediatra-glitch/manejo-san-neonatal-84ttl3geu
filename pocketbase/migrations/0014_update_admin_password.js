migrate(
  (app) => {
    try {
      const adminUser = app.findAuthRecordByEmail(
        'users',
        'dramarinadepaulaneuropediatra@gmail.com',
      )
      adminUser.setPassword('HJK@2026')
      app.save(adminUser)
    } catch (_) {
      try {
        const users = app.findCollectionByNameOrId('users')
        const record = new Record(users)
        record.setEmail('dramarinadepaulaneuropediatra@gmail.com')
        record.setPassword('HJK@2026')
        record.setVerified(true)
        record.set('name', 'Admin')
        app.save(record)
      } catch (e) {
        console.log('Could not create admin user:', e)
      }
    }
  },
  (app) => {
    // down migration
  },
)
