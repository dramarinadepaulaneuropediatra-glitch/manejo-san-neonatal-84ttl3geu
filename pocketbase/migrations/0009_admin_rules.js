migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.listRule =
      "id = @request.auth.id || @request.auth.email = 'dramarinadepaulaneuropediatra@gmail.com'"
    users.viewRule =
      "id = @request.auth.id || @request.auth.email = 'dramarinadepaulaneuropediatra@gmail.com'"
    app.save(users)

    const progress = app.findCollectionByNameOrId('progress')
    progress.listRule =
      "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.email = 'dramarinadepaulaneuropediatra@gmail.com')"
    progress.viewRule =
      "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.email = 'dramarinadepaulaneuropediatra@gmail.com')"
    app.save(progress)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.listRule = 'id = @request.auth.id'
    users.viewRule = 'id = @request.auth.id'
    app.save(users)

    const progress = app.findCollectionByNameOrId('progress')
    progress.listRule = "@request.auth.id != '' && user_id = @request.auth.id"
    progress.viewRule = "@request.auth.id != '' && user_id = @request.auth.id"
    app.save(progress)
  },
)
