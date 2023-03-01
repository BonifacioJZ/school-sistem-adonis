import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from '../../app/Models/Role';
import Permission from '../../app/Models/Permission';
import { v4 as uuid } from 'uuid';
import User from '../../app/Models/User';

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
    permission.id = permission_id
    await permission.related('roles').attach([role_id])
    const user_id = uuid()
    const user = await User.create({
      id: user_id,
      name:"root",
      lastName:"name",
      email:"root@root.com",
      password:"root1234",
      userName:"superuser",
    })
    user.id = user_id
    await user.related('roles').attach([role_id])
    await user.related('permissions').attach([permission_id])
  }
}
