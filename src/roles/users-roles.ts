import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

import {Role} from "./roles.model";
import {User} from "../users/users.model";


@Table({tableName: "users-roles", createdAt: false, updatedAt: false})
export class UsersRoles extends Model<UsersRoles> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.STRING})
    role: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
}
