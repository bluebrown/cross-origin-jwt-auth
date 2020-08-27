const fastify = require('fastify')({
  logger: true,
})

fastify.register(require('fastify-cors'), {
  origin: true,
  credentials: true
})

fastify.register(require('fastify-jwt'), {
  secret: 'supersecret'
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
    handler: async (req, reply) => {
      try {
        await fastify.jwt.verify(req.query.token)
        const token = fastify.jwt.sign({ username: req.username }, {
          expiresIn: '15s'
        })
        let info = fastify.jwt.decode(req.query.token)
        reply.redirect(info.redirect + '?token=' + token)
      } catch (err) {
        reply.send(err)
      }
    }
  })
})

fastify.listen(4000, err => {
  if (err) throw err
})