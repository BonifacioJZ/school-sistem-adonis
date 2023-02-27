import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AddRolesAndPermissionValidator from '../../Validators/AddRolesAndPermissionValidator';
import Role from '../../Models/Role';
import Permission from '../../Models/Permission';

export default class RolesAddPermissionsController {
  public async add({response,request}:HttpContextContract){
    try {
      const payload = await request.validate(AddRolesAndPermissionValidator)
      const role = await Role.findOrFail(payload.role_id)
      const permission = await Permission.findOrFail(payload.permission_id);
      await role.related('permissions').attach([permission.id])
      await role.load('permissions');
      return response.status(200).send({"role": role});
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
