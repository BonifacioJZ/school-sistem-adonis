import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from '../../Models/Role';
import CreateRoleValidator from '../../Validators/CreateRoleValidator';
import { v4 as uuid } from 'uuid';
import Redis from '@ioc:Adonis/Addons/Redis';

export default class RolesController {
  public async index({response}: HttpContextContract) {
    await Redis.set('roles',JSON.stringify(await Role.all()));
    const role =  await Redis.get('roles');
    if(!role) return response.badRequest("Error to cache")
    return response.status(200).send({"roles":JSON.parse(role)});
  }
  public async store({request,response}: HttpContextContract) {
    try {
      const payload = await request.validate(CreateRoleValidator)
      const role_id = uuid()
      const role = await Role.create({
        id: role_id,
        name: payload.name.toLowerCase(),
        guardName: payload.guardName
      })
      await role.save()
      if(!role.$isPersisted) return response.badRequest("Error to create role ")
      role.id = role_id
      return response.created(role)
    } catch (error) {
      return response.badRequest(error)
    }
  }
  public async show({response,request}:HttpContextContract){

    const role = await Role.find(request.param('id'))

    if(!role) return response.badRequest("Not found")

    await role.load('permissions')
    await role.load('users')

    await Redis.set(request.param('id'),JSON.stringify(role));

    const jsonRole = await Redis.get(request.param('id'))
    if(!jsonRole) return response.badRequest("Error to cache")

    return response.status(200).send({"role": jsonRole})
  }
  public async update({response,request}: HttpContextContract) {

    try {
      const role = await Role.findOrFail(request.param('id'))
      const payload = await request.validate(CreateRoleValidator)
      payload.name = payload.name.toLowerCase()
      role.merge(payload)
      await role.save()
      if(!role.$isPersisted) return response.badRequest("Error to update role")
      return response.status(200).send(role)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async destroy({response,request}: HttpContextContract) {
    try {
      const role = await Role.findOrFail(request.param('id'))
      await role.delete()
      if(!role.$isDeleted) return response.badRequest("Error to delete role")
      return response.status(200).send("Deleted")
    } catch (error) {
      return response.badRequest(error)
    }

  }
}
