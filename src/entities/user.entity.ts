import { Table, Column, Unique, Model, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'User',
})
export class UserEntity extends Model {
  @PrimaryKey
  @Unique
  @Column
  id: string;
  @Column
  username: string;
  @Column
  email: string;
  @Column
  password: string;
  @Column
  createdAt: Date;
  @Column
  updatedAt: Date;
}
