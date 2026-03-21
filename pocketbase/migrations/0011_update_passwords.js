migrate(
  (app) => {
    // Update all existing users to the unified password 'HJK@2026'
    const records = app.findRecordsByFilter('users', '1=1', '', 10000, 0)
    for (const record of records) {
      record.setPassword('HJK@2026')
      app.saveNoValidate(record)
    }
  },
  (app) => {
    // Reverting passwords to previous state is not possible
  },
)
