const path = require('path')
const fastify = require('fastify')();
fastify.register(require('fastify-cookie'));
fastify.register(require('fastify-session'), {secret: 'a secret with minimum length of 32 characters'});


fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
})

fastify.listen(3000, err => {
  if (err) throw err
})