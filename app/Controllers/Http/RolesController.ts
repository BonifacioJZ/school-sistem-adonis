import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from '../../Models/Role';
import CreateRoleValidator from '../../Validators/CreateRoleValidator';

export default class RolesController {
  public async index({response}: HttpContextContract) {
    const role = await Role.all();
    return response.status(200).send(role);
  }
  public async store({request,response}: HttpContextContract) {
    try {
      const payload = await request.validate(CreateRoleValidator)
      const role = await Role.create({
        name: payload.name.toLowerCase(),
        guardName: payload.guardName
      })
      await role.save()
      return response.created(role)
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }
  public async show({response,request}:HttpContextContract){
    const role = await Role.find(request.param('id'))
    if(!role) return response.badRequest("Not found")
    await role?.load('permissions')
    await role?.load('users')
    return response.status(200).send(role)
  }
  public async update({response,request}: HttpContextContract) {

    try {
      const role = await Role.findOrFail(request.param('id'))
      const payload = await request.validate(CreateRoleValidator)
      payload.name = payload.name.toLowerCase()
      role.merge(payload)
      await role.save()
      return response.status(200).send(role)
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async destroy({response,request}: HttpContextContract) {
    try {
      const role = await Role.findOrFail(request.param('id'))
      await role.delete()
      return response.status(200).send("Deleted")
    } catch (error) {
      return response.badRequest(error.messages)
    }

  }
}
