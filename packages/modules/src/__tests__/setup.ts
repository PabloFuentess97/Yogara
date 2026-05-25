import { beforeAll, afterAll } from 'vitest'

beforeAll(() => {
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://yogara:yogara@localhost:5432/yogara_test'
})

afterAll(() => {
  // cleanup if needed
})
