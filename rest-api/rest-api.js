const fastify = require('fastify')({
  logger: true,
})

fastify.register(require('fastify-cors'), {
  origin: true,
  credentials: true,
})

fastify.register(require('fastify-jwt'), {
  secret: 'supersecret'
})

fastify.get("/authenticate", async function (req, reply) {
  try {
    await fastify.jwt.verify(req.query.token)
    const payload = { username: fastify.jwt.decode(req.query.token).username, role: 'admin' }
    reply.send({ token: fastify.jwt.sign(payload, { expiresIn: '1m' }) })
  } catch (err) {
    reply.send(err)
  }
})

fastify.get("/login", async (req, reply) => {
  const token = fastify.jwt.sign({ redirect: 'http://localhost:5000/authenticate' }, {
    expiresIn: '30s'
  })
  reply.redirect('http://localhost:4000/login?token=' + token)
})

fastify.register((fastify, options, done) => {
  fastify.addHook("onRequest", async (req, reply) => {
    try {
      await req.jwtVerify()
    } catch (err) {
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