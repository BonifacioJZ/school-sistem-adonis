import { test } from '@japa/runner'

test.group('Roles List', () => {
  test('get all roles',async ({client})=>{
    const response = await client.get('/api/v1/role')
    response.assertStatus(200)


  })
})
