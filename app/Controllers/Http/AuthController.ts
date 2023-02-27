 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from '../../Validators/LoginValidator';

export default class AuthController {
  public async login({response, request,auth}:HttpContextContract){
    const payload = await request.validate(LoginValidator);
    try {
      const token = await auth.use('api').attempt(payload.email, payload.password)
      return response.status(200).send({
        "toke":token
      })
    } catch (error) {
      return response.unauthorized('Invalid credentials')
    }
  }
}
