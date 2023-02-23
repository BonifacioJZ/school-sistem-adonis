import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from '../../Models/Permission';
import CreatePermissionValidator from '../../Validators/CreatePermissionValidator';

export default class PermissionsController {
  public async index({response}: HttpContextContract) {
    const permissions = await Permission.all()
    return response.status(200).send(permissions)
  }
  public async store({response,request}: HttpContextContract) {
    try {
      const payload = await request.validate(CreatePermissionValidator)
      const permission = await  Permission.create({
        name: payload.name.toLowerCase(),
        guardName: payload.guardName,
      })
      await permission.save()
      return response.created(permission)
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async show({request,response}: HttpContextContract) {
    const permission = await Permission.find(request.param('id'))
    if(!permission) return response.badRequest("Not found")
    await permission.load('roles')
    await permission.load('users')
    return response.status(200).send(permission)
  }
  public async update({response,request}: HttpContextContract) {
    try {
      const permissions = await Permission.findOrFail(request.param('id'))
      const payload = await request.validate(CreatePermissionValidator)
      payload.name = payload.name.toLowerCase()
      permissions.merge(payload)
      await permissions.save()
      return response.status(200).send(permissions)
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async destroy({response,request}: HttpContextContract) {
    try {
      const permission = await Permission.findOrFail(request.param('id'))
      await permission.delete()
      return response.status(200).send("Deleted")
    } catch (error) {
      return response.badRequest(error.messages)
    }

  }
}
