migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    let user

    try {
      // Try to find the existing user
      user = app.findAuthRecordByEmail('users', 'dramarinadepaulaneuropediatra@gmail.com')
    } catch (err) {
      // If not found, create a new record
      user = new Record(users)
      user.setEmail('dramarinadepaulaneuropediatra@gmail.com')
    }

    // Ensure the password and verification status are correctly set
    user.setPassword('securepassword123')
    user.setVerified(true)
    user.set('name', 'Dra. Marina')

    app.save(user)
  },
  (app) => {
    // No down migration needed for this data fix
  },
)
