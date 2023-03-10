import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from '../../Models/Permission';
import CreatePermissionValidator from '../../Validators/CreatePermissionValidator';
import { v4 as uuid } from 'uuid';
import Redis from '@ioc:Adonis/Addons/Redis';

export default class PermissionsController {
  public async index({response}: HttpContextContract) {
    await Redis.set('permissions',JSON.stringify(await Permission.all()))
    const permissions = await Redis.get('permissions')
    if(!permissions) return response.badRequest("error to cashed")
    return response.status(200).send({"permission":JSON.parse(permissions)})
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
    //search to permission by id
    const permission = await Permission.find(request.param('id'))
    //permission is exist?
    if(!permission) return response.badRequest("Not found")
    //load in permission roles and users
    await permission.load('roles')
    await permission.load('users')
    //add to cache
    await Redis.set(request.param('id'),JSON.stringify(permission))

    const jsonPermission = await Redis.get(request.param('id'))

    if(!jsonPermission) return response.badRequest("Error to cache")

    return response.status(200).send({"permission":JSON.parse(jsonPermission)})
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
