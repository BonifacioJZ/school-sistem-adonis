import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Student from '../../Models/Student';
import User from '../../Models/User';
import NewStudentValidationValidator from '../../Validators/NewStudentValidationValidator';


export default class StudentsController {
  public async index({response}: HttpContextContract) {
    const students = await Student.query().preload('user')
    return response.status(200).send({"students":students})
  }

  public async store({request,response}: HttpContextContract) {
    try {
      const payload = await request.validate(NewStudentValidationValidator);
      const user = await User.findOrFail(payload.user_id)
      await user.related('students').create({
        code: payload.code,
      })
      await user.load('students')
      return response.created(user)

    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async show({request,response}: HttpContextContract) {
    try {
      const student = await Student.findByOrFail('code',request.param('code'))
      await student.load('user')
      return response.status(200).send({"student":student})
    } catch (error) {
      return response.badRequest(error)
    }
  }

  //public async update({}: HttpContextContract) {}

  //public async destroy({}: HttpContextContract) {}
}
