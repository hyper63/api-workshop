import tape from 'tape'
import supertest from 'supertest'
import app from '../server.js'

tape("test", t => {
  supertest(app)
    .get('/')
    .expect(200)
    .expect('Hello World')
    .end(function (err, res) {
      if (err) { throw err }
      t.ok(true)
      console.log(res.text)
      t.end()
    })
})