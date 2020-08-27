const fastify = require('fastify')()
fastify.register(require('fastify-cors'), {})
fastify.register(require('fastify-jwt'), {
  secret: 'supersecret'
})

fastify.get("/authenticate", async function (req, reply) {
  try {
    await fastify.jwt.verify(req.query.token)
    reply.send(fastify.jwt.sign({username: fastify.jwt.decode(req.query.token).username, role: 'admin'}, {
      expiresIn: '1d'
    }))
  } catch (err) {
    reply.send(err)
  }
})

fastify.register((fastify, options, done) => {
  fastify.addHook("onRequest", async (req, reply) => {
    try {
      await req.jwtVerify()
    } catch (err) {
      const token = fastify.jwt.sign({ redirect: 'http://localhost:5000/authenticate' }, {
        expiresIn: '30s'
      })
      reply.redirect('http://localhost:4000/login?token=' + token)
      reply.send(err)
    }
  })

  fastify.get("/api", async function (req, reply) {
    return req.user
  })

  done()
})

fastify.listen(5000, err => {
  if (err) throw err
})