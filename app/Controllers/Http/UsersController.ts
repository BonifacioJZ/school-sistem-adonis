import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User';

export default class UsersController {
  public async index({response}: HttpContextContract) {
    const users = await User.all();
    return response.status(200).send(users)
  }

  //public async store({}: HttpContextContract) {}

  //public async show({}: HttpContextContract) {}

  //public async update({}: HttpContextContract) {}

  //public async destroy({}: HttpContextContract) {}
}
