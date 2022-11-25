import {Column, DataType, Model, Table} from "sequelize-typescript";


interface RoleCreationAttrs {
    value: string;
    description: string;
}

@Table({tableName: "role"})
export class Role extends Model<Role, RoleCreationAttrs> {

    @Column({type: DataType.STRING, unique: true, primaryKey: true, autoIncrement: false})
    value: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string
}