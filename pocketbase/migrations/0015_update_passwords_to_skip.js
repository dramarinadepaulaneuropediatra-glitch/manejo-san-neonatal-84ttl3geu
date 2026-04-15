migrate(
  (app) => {
    const users = app.findRecordsByFilter('users', "id != ''", '', 1000, 0)
    for (const user of users) {
      user.setPassword('Skip@2026')
      app.saveNoValidate(user)
    }
  },
  (app) => {
    const users = app.findRecordsByFilter('users', "id != ''", '', 1000, 0)
    for (const user of users) {
      user.setPassword('HJK@2026')
      app.saveNoValidate(user)
    }
  },
)
