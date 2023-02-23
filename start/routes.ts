/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})
Route.group(()=>{
  Route.group(()=>{
    Route.get('/', 'RolesController.index')
    Route.post('/', 'RolesController.store')
    Route.get('/:id', 'RolesController.show')
    Route.put('/:id', 'RolesController.update')
    Route.delete('/:id','RolesController.destroy')
  }).prefix('/role')
  Route.group(()=>{
    Route.get('/','PermissionsController.index')
    Route.post('/','PermissionsController.store')
    Route.get('/:id','PermissionsController.show')
    Route.put('/:id','PermissionsController.update')
    Route.delete('/:id','PermissionsController.destroy')
  }).prefix('/permissions')
  Route.group(()=>{
    Route.get('/', 'UsersController.index')
  }).prefix('/users')
}).prefix('/api/v1')
