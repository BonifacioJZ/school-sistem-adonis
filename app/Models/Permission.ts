import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import Role from './Role';
import User from './User';
import { v4 as uuid } from 'uuid';

export default class Permission extends BaseModel {
  @column({
    isPrimary: true,
    prepare: (value: string) => value ? value : uuid()
  })
  public id: string

  @column()
  public name: string

  @column()
  public guardName: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(()=>Role)
  public roles: ManyToMany<typeof Role>

  @manyToMany(()=> User)
  public users: ManyToMany<typeof User>

}
