import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Student from '../../Models/Student';
import User from '../../Models/User';
import NewStudentValidationValidator from '../../Validators/NewStudentValidationValidator';
import Redis from '@ioc:Adonis/Addons/Redis';
import UpdateStudentValidator from '../../Validators/UpdateStudentValidator';


export default class StudentsController {
  public async index({response}: HttpContextContract) {
    await Redis.set('students',JSON.stringify(await Student.query().preload('user')))
    const students = await Redis.get('students')
    if(!students) return response.badRequest("Error to Cache")
    return response.status(200).send({"students":JSON.parse(students)})
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
      await Redis.set(request.param('code'),JSON.stringify(student))
      const jsonStudent = await Redis.get(request.param('code'))
      if(!jsonStudent) return response.badRequest("Error to cache")
      return response.status(200).send({"student":JSON.parse(jsonStudent)})
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async update({request,response}: HttpContextContract) {
    try {
      const student = await Student.findByOrFail('code',request.param('code'))
      const payload = await request.validate(UpdateStudentValidator)
      student.merge(payload)
      await student.save()
      await student.load('user')
      return response.status(200).send({"student": student})
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async destroy({request,response}: HttpContextContract) {
    try{
      const student = await Student.findByOrFail('code',request.param('code'))
      await student.delete()
      return response.status(200).send("Deleted")
    }catch(error){
      return response.badRequest(error)
    }
  }
}
