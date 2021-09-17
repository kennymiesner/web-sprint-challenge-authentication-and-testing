const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')
const buildToken = require('./middleware/build-token')
const jokes = require('./jokes/jokes-data')

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

test('sanity', () => {
  expect(true).not.toBe(false)
})

describe('[POST] /api/auth/register', () => {
  const user = { username: 'bob', password: '1234' }
  const user2 = { username: 'bob' }
  test('responds with correct success code of 201', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send(user)
    expect(res.status).toBe(201)
  })
  test('responds with bad request error code of 400', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send(user2)
    expect(res.status).toBe(400)
  })
})

describe('[POST] /api/auth/login', () => {
  const user = { username: 'bob', password: '1234' }
  const user2 = { username: 'bob' }
  it('responds with correct success code of 200', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send(user)
    expect(res.status).toBe(200)
  })
  it('responds with error code of 400 if missing credentials', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send(user2)
    expect(res.status).toBe(400)
  })
})

describe('[GET] /api/jokes', () => {
  const user = { id: 1, username: 'bob' }
  const token = buildToken(user)
  it('responds with correct success code of 200', async () => {
    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', token)
    expect(res.status).toBe(200)
  })
  it('responds with all jokes if proper token available', async () => {
    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', token)
    expect(res.body).toMatchObject(jokes)
  })
})
