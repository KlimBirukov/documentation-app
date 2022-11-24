import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";

import {Role} from "../roles/roles.model";
import {UsersRoles} from "../roles/users-roles";


interface UserCreationAttr {
    nickname: string;
    email: string;
    password: string;
}

@Table({tableName: "user"})
export class User extends Model<User, UserCreationAttr> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    nickname: string;

    @Column({type: DataType.STRING, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @BelongsToMany(() => Role, () => UsersRoles)
    roles: Role[];
}