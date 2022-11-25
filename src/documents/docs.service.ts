import {HttpException, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";

import {Docs} from "./docs.model";
import {CreateDocDto} from "./dto/createDoc.dto";


@Injectable()
export class DocsService {

    constructor(@InjectModel(Docs) private documentRepository: typeof Docs) {
    }

    async createDocument(dto: CreateDocDto, parentId: string) {
        try {
            if (!parentId) {
                await this.documentRepository.create(dto);
                return {message: "Document created"}
            }
            const parentDoc = await this.documentRepository.findByPk(parentId);
            const document = await this.documentRepository.create(dto);
            parentDoc.childrenIdx = [...parentDoc.childrenIdx, document.id];
            await parentDoc.save();
            return {message: "Document created"}
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }

    async getDocById({id}: { id: string }) {
        return this.documentRepository.findByPk(id, {
            attributes: ["creatorId", "content", "createdAt", "updatedAt"]
        });
    }

    async getSkeletonsRootDocs() {
        return await this.documentRepository.findAll({
            where: {isRoot: true},
            attributes: ["id", "title", "icon", "isRoot", "childrenIdx"]
        });
    }

    async getChildrenSkeletonsDocs({idx}: { idx: string[] }) {
        try {
            const query = idx.map(el => `id = '${el}'`).join(" OR ")

            const whereQuery = `SELECT "id",
                                       "title",
                                       "icon",
                                       "isRoot",
                                       "childrenIdx",
                                FROM document
                                WHERE ${query};`

            return await this.documentRepository.sequelize.query(whereQuery).then(res => res[0]);
        } catch (error) {
            throw new Error;
        }
    }


    async __getAllDocs() {
        return await this.documentRepository.findAll();
    }
}