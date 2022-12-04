import {Column, DataType, Model, Table} from "sequelize-typescript";


interface DocsCreationAttr {
    id: string;
    title: string;
    icon: string;
    isRoot: boolean;
    creatorId: string;
}

@Table({tableName: "document", paranoid: true})
export class Docs extends Model<Docs, DocsCreationAttr> {

    @Column({type: DataType.STRING, unique: true, primaryKey: true})
    id: string;

    @Column({type: DataType.STRING, allowNull: false})
    title: string;

    @Column({type: DataType.STRING, allowNull: false})
    icon: string;

    @Column({type: DataType.BOOLEAN, allowNull: false})
    isRoot: boolean;

    @Column({type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: []})
    child_id: string[];

    @Column({type: DataType.STRING, allowNull: false})
    creatorId: string;

    @Column({type: DataType.JSON})
    content: string;
}