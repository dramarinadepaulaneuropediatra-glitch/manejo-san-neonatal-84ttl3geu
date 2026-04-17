routerAdd('POST', '/backend/v1/name-login', (e) => {
  const body = e.requestInfo().body || {}
  const name = (body.name || '').trim()

  if (!name) {
    return e.badRequestError('Nome é obrigatório.')
  }

  const users = $app.findRecordsByFilter(
    'users',
    "email != 'dramarinadepaulaneuropediatra@gmail.com'",
    '',
    1000,
    0,
  )

  const searchName = name.toLowerCase()

  const normalize = (str) => {
    return str
      .toLowerCase()
      .replace(/[áàãâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòõôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
  const searchNameNormalized = normalize(name)

  let matchedUser = null
  for (let i = 0; i < users.length; i++) {
    const u = users[i]
    const uNameRaw = u.getString('name')

    // Strict exact match but case-insensitive
    if (uNameRaw.toLowerCase().trim() === searchName) {
      matchedUser = u
      break
    }
  }

  if (!matchedUser) {
    // Fallback to normalized match for better UX
    for (let i = 0; i < users.length; i++) {
      const u = users[i]
      const uNameRaw = u.getString('name')
      if (normalize(uNameRaw) === searchNameNormalized) {
        matchedUser = u
        break
      }
    }
  }

  if (!matchedUser) {
    return e.unauthorizedError('Dados não encontrados. Por favor, verifique seu nome.')
  }

  return $apis.recordAuthResponse($app, e, matchedUser)
})
