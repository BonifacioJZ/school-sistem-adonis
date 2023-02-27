import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from '../../Models/Permission';
import CreatePermissionValidator from '../../Validators/CreatePermissionValidator';
import { v4 as uuid } from 'uuid';

export default class PermissionsController {
  public async index({response}: HttpContextContract) {
    const permissions = await Permission.all()
    return response.status(200).send(permissions)
  }
  public async store({response,request}: HttpContextContract) {
    try {
      const payload = await request.validate(CreatePermissionValidator)
      const permissions_id =  uuid()
      const permission = await  Permission.create({
        id: permissions_id,
        name: payload.name.toLowerCase(),
        guardName: payload.guardName,
      })
      await permission.save()
      if(!permission.$isPersisted) return response.badRequest("Error to create permission")
      permission.id = permissions_id
      return response.created(permission)
    } catch (error) {
      return response.badRequest(error)
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
      if(!permissions.$isPersisted) return response.badRequest("error to update permissions")
      return response.status(200).send(permissions)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async destroy({response,request}: HttpContextContract) {
    try {
      const permission = await Permission.findOrFail(request.param('id'))
      await permission.delete()
      if (!permission.$isDeleted) return response.badRequest("Error to delete permission")
      return response.status(200).send("Deleted")
    } catch (error) {
      return response.badRequest(error)
    }

  }
}
