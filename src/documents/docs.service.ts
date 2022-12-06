import {HttpException, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";

import {Docs} from "./docs.model";
import {CreateDocDto, DeleteDocDto, GetDocDto, GetChildrenDocDto, UpdateDocDto} from "./dto/dtos";
import {CommonResponse, SuccessfulResponseWithData} from "./responses/responses";


@Injectable()
export class DocsService {

    constructor(@InjectModel(Docs) private documentRepository: typeof Docs) {
    }

    async createDocument(dto: CreateDocDto): Promise<CommonResponse> {
        try {
            console.log(dto);
            if (!dto.parent_id) {
                await this.documentRepository.create(dto);
                return {success: true, message: "Root document created"}
            }
            const parentDoc = await this.documentRepository.findByPk(dto.parent_id);
            const document = await this.documentRepository.create(dto);
            parentDoc.child_id = [...parentDoc.child_id, document.id];
            await parentDoc.save();
            return {success: true, message: "Document created"}
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async updateDocById(dto: UpdateDocDto): Promise<CommonResponse> {
        try {
            const doc = await this.documentRepository.findByPk(dto.id);
            await doc.update({icon: dto.icon, title: dto.title, content: dto.content});
            return {success: true, message: "Document was updated"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async getSkeletonsRootDocs(): Promise<CommonResponse | SuccessfulResponseWithData> {
        const data = await this.documentRepository.findAll({
            where: {parent_id: null},
            attributes: ["id", "title", "icon", "parent_id", "child_id"],
            order: [
                ['id', 'ASC'],
            ]
        });
        return data.length !== 0 ? {success: true, data} : {success: false, message: "No root documents"};
    }

    async getChildrenSkeletonsDocs(dto: GetChildrenDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        try {
            const data = await this.__customQuery(
                dto.idx,
                `"id", "title", "icon", "parent_id", "child_id"`,
            )
            return data.length !== 0 ? {success: true, data} : {success: false, message: "No document(s)"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async destroyDocById(dto: DeleteDocDto): Promise<CommonResponse> {
        try {
            const doc = await this.documentRepository.findByPk(dto.id);
            if (dto.flag && doc.parent_id) {
                const parentDoc = await this.documentRepository.findByPk(doc.parent_id);
                const newIdx = parentDoc.child_id.filter(index => index !== doc.id);
                await parentDoc.update({"child_id": [...newIdx]});
            }

            await this.__recursiveDestruction(dto.id, dto.flag);

            return {success: true, message: `The document has been deleted${dto.flag ? " irrevocably" : ""}`};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    private async __recursiveDestruction(id: string, flag: boolean): Promise<CommonResponse> {
        try {
            const idxArray = await this.documentRepository.findByPk(id).then(data => data.child_id)
            await this.documentRepository.destroy({where: {id: id}, force: flag});

            if (idxArray.length === 0) {
                return;
            }

            await idxArray.forEach(childId => this.__recursiveDestruction(childId, flag));
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async getDocById(dto): Promise<CommonResponse | SuccessfulResponseWithData> {
        try {
            const data = await this.documentRepository.findByPk(dto.id);
            return data ? {success: true, data} : {success: false, message: "Document not found"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async getTrash(): Promise<CommonResponse | SuccessfulResponseWithData> {
        try {
            const data = await this.documentRepository.findAll({
                where: {deletedAt: {[Op.not]: null}},
                paranoid: false,
                order: [
                    ['id', 'ASC'],
                ]
            })
            return data ? {success: true, data} : {success: false, message: "Document not found"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async restore(dto: GetDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        try {
            const doc = await this.documentRepository.findByPk(dto.id, {paranoid: false});
            const parent = await this.documentRepository.findByPk(doc.parent_id, {paranoid: false});
            if (parent.deletedAt) {
                return {
                    success: false,
                    message: `You cannot restore a document if its parent document is not restored. parent_id="${doc.parent_id}" `
                   };
            }
            await this.documentRepository.restore({where: {id: dto.id}});
            const data = await this.documentRepository.findByPk(dto.id);
            return data ? {success: true, data} : {success: false, message: "Document not found"};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    private async __customQuery(idx: string[], whatSelect: string) {
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

