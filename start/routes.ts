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
  }).prefix('/role').middleware('auth')
  Route.group(()=>{
    Route.get('/','PermissionsController.index')
    Route.post('/','PermissionsController.store')
    Route.get('/:id','PermissionsController.show')
    Route.put('/:id','PermissionsController.update')
    Route.delete('/:id','PermissionsController.destroy')
  }).prefix('/permissions').middleware('auth')
  Route.group(()=>{
    Route.post('/','RolesAddPermissionsController.add')
  }).prefix('/role-add-permissions')

  Route.group(()=>{
    Route.get('/', 'UsersController.index')
    Route.post('/', 'UsersController.store')
    Route.get('/:id', 'UsersController.show')
    Route.put('/:id', 'UsersController.update')
    Route.delete('/:id','UsersController.destroy')
    Route.post('/add-rol','UsersController.addRol');
    Route.post('/add-permission','UsersController.addPermission');
  }).prefix('/users').middleware('auth')
  Route.post('/login','AuthController.login')
  Route.group(()=>{
    Route.get('/','StudentsController.index')
    Route.post('/','StudentsController.store')
    Route.get('/:code','StudentsController.show')
  }).prefix('/students')
}).prefix('/api/v1')
