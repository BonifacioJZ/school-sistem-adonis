import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User';
import CreateUserValidator from '../../Validators/CreateUserValidator';
import { v4 as uuid } from 'uuid';
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
  public async index({response}: HttpContextContract) {
    const users = await User.all();
    return response.status(200).send(users)
  }

  public async store({response,request}: HttpContextContract) {
    try {
      const payload = await request.validate(CreateUserValidator)
      const user_id = uuid()
      const user = await User.create({
        id: user_id,
        name: payload.name,
        lastName: payload.last_name,
        email: payload.email,
        userName: payload.user_name,
        password:payload.password
      });
      await user.save()
      user.id = user_id
      return response.created(user)
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async show({request,response}: HttpContextContract) {
    try {
      const user = await User.find(request.param('id'))
      if(!user) return response.badRequest("Not found")
      return response.status(200).send(user)
    } catch (error) {
      return response.badRequest(error.messages)
    }

  }

  //public async update({}: HttpContextContract) {}

  //public async destroy({}: HttpContextContract) {}
}
