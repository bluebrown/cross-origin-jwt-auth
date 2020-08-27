const fastify = require('fastify')({
  logger: true,
})

fastify.register(require('fastify-cors'), {
  origin: true,
  credentials: true
})

fastify.register(require('fastify-jwt'), {
  secret: require('./secret-provider')
})

fastify.decorateRequest('username', '')

fastify.register(require('fastify-basic-auth'), {
  authenticate: { realm: 'cnx' },
  validate(username, password, req, reply, done) {
    if (username === 'han' && password === 'solo') {
      req.username = username
      done()
    } else {
      reply.code(401).send({ message: "not authenticated" })
    }
  },
})

fastify.after(() => {
  fastify.route({
    method: 'GET',
    url: '/login',
    onRequest: fastify.basicAuth,
    handler: (req, reply, next) => {
      req.headers.authorization = 'Bearer ' + req.query.token
      req.jwtVerify(function (err, decoded) {
        if (err) return reply.send(err)
        reply.jwtSign({ username: req.username }, function (err, token) {
          if (err) return reply.send(err)
          reply.redirect(decoded.redirect + '?token=' + token)
        })
      })
    }
  })
})

fastify.listen(4000, err => {
  if (err) throw err
})