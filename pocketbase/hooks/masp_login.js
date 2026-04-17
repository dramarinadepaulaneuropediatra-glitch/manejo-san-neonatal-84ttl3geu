routerAdd('POST', '/backend/v1/masp-login', (e) => {
  const body = e.requestInfo().body || {}
  const name = (body.name || '').trim()
  const masp = (body.masp || '').trim()

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

  const normalize = (str) => {
    return str
      .toLowerCase()
      .replace(/[áàãâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòõôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '')
  }

  const searchName = normalize(name)
  const searchMasp = normalize(masp)

  let matchedUser = null
  for (let i = 0; i < users.length; i++) {
    const u = users[i]
    const uName = normalize(u.getString('name'))
    const uMasp = normalize(u.getString('masp'))

    if (uName === searchName && uMasp === searchMasp) {
      matchedUser = u
      break
    }
  }

  if (!matchedUser) {
    return e.unauthorizedError('Dados não encontrados. Por favor, verifique seu nome e MASP.')
  }

  return $apis.recordAuthResponse($app, e, matchedUser)
})
