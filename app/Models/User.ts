import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash'
import Role from './Role';
import Permission from './Permission';
import {v4 as uuid }from 'uuid'

export default class User extends BaseModel {
  @column({
    isPrimary: true,
    prepare: (value: string) => value ? value : uuid(),
  })
  public id: string

  @column()
  public name: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column({serializeAs: null })
  public password:string

  @column()
  public userName: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }


  @manyToMany(()=> Role)
  public roles: ManyToMany<typeof Role>

  @manyToMany(()=> Permission)
  public permissions: ManyToMany<typeof Permission>

}
