import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from '../../app/Models/Role';
import Permission from '../../app/Models/Permission';
import { v4 as uuid } from 'uuid';

export default class extends BaseSeeder {
  public async run () {
    await Role.create({
      id:uuid(),
      name: "superuser",
      guardName:"Super User"
    })

    await Permission.create({
      id: uuid(),
      name: "all.permissions",
      guardName:"All Permissions"
    })

  }
}
