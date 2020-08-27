const secretStore = {
  testAPI: 'supersecret'
}

const secretProvider = (applicationID) => {
  return secretStore[applicationID]
}

module.exports = function (req, reply, done) {
  let s = secretProvider(req.query.applicationID), e = null
  if (!s) e = new Error('could not find a matching secret')
  done(e, s)
}