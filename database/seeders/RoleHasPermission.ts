import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from '../../app/Models/Role';
import Permission from '../../app/Models/Permission';

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    const role = await Role.findBy("name","superuser")
    const per = await Permission.findBy("name","all.permissions")
    await role?.related('permissions').attach([per?.id])
  }
}
