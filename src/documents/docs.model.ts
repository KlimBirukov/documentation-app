import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";


const desContent = {
    time: Date.now(),
    blocks: [{id: "8_Os0SK9d2", type: "paragraph", data: {text: "Write here your awesome story"},},],
    version: "2.24.3",
}

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

    @Column({type: DataType.JSON, defaultValue: desContent})
    content: string;

    @Column({type: DataType.ARRAY(DataType.STRING), defaultValue: []})
    child_id: string[];

    @Column({type: DataType.STRING})
    parent_id: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    creatorId: string;

    @BelongsTo(() => User)
    creator: User;
}
