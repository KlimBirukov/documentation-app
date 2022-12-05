import {HttpException, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";

import {Docs} from "./docs.model";
import {CreateDocDto} from "./dto/createDoc.dto";
import {UpdateDocDto} from "./dto/updateDoc.dto";


@Injectable()
export class DocsService {

    constructor(@InjectModel(Docs) private documentRepository: typeof Docs) {
    }

    async createDocument(dto: CreateDocDto, parentId: string) {
        try {
            if (parentId === "root") {
                await this.documentRepository.create(dto);
                return {message: "Root document created"}
            }
            const parentDoc = await this.documentRepository.findByPk(parentId);
            const document = await this.documentRepository.create(dto);
            parentDoc.child_id = [...parentDoc.child_id, document.id];
            await parentDoc.save();
            return {message: "Document created"}
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async updateDocById(dto: UpdateDocDto) {
        try {
            const doc = await this.documentRepository.findByPk(dto.id);
            await doc.update({icon: dto.icon, title: dto.title, content: dto.content});
            return {success: true, message: "Document was updated"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async getDocById({id}: { id: string }) {
        const data = await this.documentRepository.findByPk(id);
        return data ? data : {success: false, message: "Document not found"};
    }

    async getSkeletonsRootDocs() {
        const data = await this.documentRepository.findAll({
            where: {isRoot: true},
            attributes: ["id", "title", "icon", "isRoot", "child_id"],
            order: [
                ['id', 'ASC'],
            ]

        });
        return data.length !== 0 ? data : {success: false, message: "No root documents"};
    }

    async getChildrenSkeletonsDocs({idx}: { idx: string[] }) {
        try {
            const data = await this.__customQuery({
                idx,
                whatSelect: `"id", "title", "icon", "isRoot", "child_id"`,
            })
            return data.length !== 0 ? data : {message: "No document(s)"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async destroyDocById({parentId, id, flag}: { parentId: string, id: string, flag: boolean }) {
        try {
            const rId = id;
            if (flag ?? parentId !== "root") {
                const doc = await this.documentRepository.findByPk(parentId);
                const newIdx = doc.child_id.filter(index => index !== rId);
                await doc.update({"child_id": [...newIdx]});
            }

            await this.__recursiveDestruction({id, flag});

            return {message: "The document has been deleted irrevocably"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async getTrash() {
        try {
            return await this.documentRepository.findAll({
                where: {deletedAt: {[Op.not]: null}},
                paranoid: false,
                order: [
                    ['id', 'ASC'],
                ]
            })
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async restore({id}: { id: string }) {
        try {
            await this.documentRepository.restore({where: {id: id}});
            const data = this.documentRepository.findByPk(id);
            return {data, message: "Document has been restored"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }


    private async __recursiveDestruction({id, flag}: { id: string, flag: boolean }) {
        try {
            const data = await this.__customQuery({idx: Array(id), whatSelect: `"child_id"`});
            await this.documentRepository.destroy({where: {id: id}, force: flag});

            if (data.length === 0) {
                return;
            }
            // @ts-ignore: error message
            const {childrenIdx} = data[0];
            await childrenIdx.forEach(childId => this.__recursiveDestruction({id: childId, flag}));
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    private async __customQuery({idx, whatSelect}: { idx: string[], whatSelect: string }): Promise<Object[]> {
        try {
            const whereQuery = idx.map(el => `id = '${el}'`).join(" OR ");
            const query = `SELECT ${whatSelect}
                           FROM "document"
                           WHERE ${whereQuery}
                           ORDER BY "id" DESC;`;

            return await this.documentRepository.sequelize.query(query).then(data => data[0]);
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }

    async __getAllDocs() {
        return await this.documentRepository.findAll({paranoid: false});
    }
}

