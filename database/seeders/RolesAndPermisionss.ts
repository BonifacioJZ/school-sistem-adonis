import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from '../../app/Models/Role';
import Permission from '../../app/Models/Permission';

export default class extends BaseSeeder {
  public async run () {
    let rol = await Role.create({
      name: "superuser",
      guardName:"Super User"
    })
    let per = await Permission.create({
      name: "all.permissions",
      guardName:"All Permissions"
    })
    await rol.related('permissions').attach([per.id])
  }
}
