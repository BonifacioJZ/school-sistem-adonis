import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from '../../app/Models/Role';
import Permission from '../../app/Models/Permission';
import { v4 as uuid } from 'uuid';

export default class extends BaseSeeder {
  public async run () {
    const role_id = uuid()
    await Role.create({
      id:role_id,
      name: "superuser",
      guardName:"Super User"
    })
    const permission_id = uuid()
    const permission =await Permission.create({
      id: permission_id,
      name: "all.permissions",
      guardName:"All Permissions"
    })
    await permission.related('roles').attach([role_id])
  }
}
