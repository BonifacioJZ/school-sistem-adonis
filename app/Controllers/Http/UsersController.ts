import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User';
import CreateUserValidator from '../../Validators/CreateUserValidator';
import { v4 as uuid } from 'uuid';
import UpdateUserValidator from '../../Validators/UpdateUserValidator';
import UserAndRolValidator from '../../Validators/UserAndRolValidator';
import Role from '../../Models/Role';
import UserAndPermissionValidator from '../../Validators/UserAndPermissionValidator';
import Permission from '../../Models/Permission';

export default class UsersController {
  public async index({response}: HttpContextContract) {
    const users = await User.all();
    return response.status(200).send(users)
  }

  public async store({response,request}: HttpContextContract) {
    try {
      const payload = await request.validate(CreateUserValidator)
      const user_id = uuid()
      const user = await User.create({
        id: user_id,
        name: payload.name,
        lastName: payload.last_name,
        email: payload.email,
        userName: payload.user_name,
        password:payload.password
      });
      await user.save()
      if(!user.$isPersisted) return response.badRequest("Error to Create User")
      user.id = user_id
      return response.created(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async show({request,response}: HttpContextContract) {
    try {
      const user = await User.findOrFail(request.param('id'))
      await user.load('permissions')
      await user.load('roles')
      return response.status(200).send(user)
    } catch (error) {
      return response.badRequest(error)
    }

  }

  public async update({request,response}: HttpContextContract) {
    try {
      const user = await User.findOrFail(request.param('id'))
      const payload = await request.validate(UpdateUserValidator)
      user.merge(payload)
      await user.save()
      if(!user.$isPersisted) return response.badRequest("Error to update user")
      return response.status(200).send({"user":user})
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async destroy({request,response}: HttpContextContract) {
    try {
      const user = await User.findOrFail(request.param('id'))
      await user.delete()
      if(!user.$isDeleted) return response.badRequest("Error to delete user")
      return response.status(200).send("Deleted")
    } catch (error) {
      return response.badRequest(error)
    }
  }
  public async addRol({request,response}:HttpContextContract){

    try {
      const payload = await request.validate(UserAndRolValidator)
      const user = await User.findOrFail(payload.user_id)
      const role = await Role.findOrFail(payload.role_id)
      await user.related('roles').attach([role.id])
      await user.load('roles')
      return response.status(200).send({"user":user})
    } catch (error) {
      return response.badRequest(error)
    }
  }
  public async addPermission({request,response}:HttpContextContract){
    try {
      const payload = await request.validate(UserAndPermissionValidator)
      const user = await User.findOrFail(payload.user_id)
      const permission = await Permission.findOrFail(payload.permission_id)
      await user.related('permissions').attach([permission.id])
      await user.load('permissions')
      return response.status(200).send({"user":user})
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
