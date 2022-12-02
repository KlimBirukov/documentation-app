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

    async updateDocById(dto: UpdateDocDto) {
        try {
            const doc = await this.documentRepository.findByPk(dto.id);
            await doc.update({icon: dto.icon, title: dto.title, content: dto.content});
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }

    async getDocById({id}: { id: string }) {
        const data = await this.documentRepository.findByPk(id, {
            attributes: ["creatorId", "content", "createdAt", "updatedAt"]
        });
        return data ? data : {message: "Document not found"};
    }

    async getSkeletonsRootDocs() {
        const data = await this.documentRepository.findAll({
            where: {isRoot: true},
            attributes: ["id", "title", "icon", "isRoot", "childrenIdx"]
        });
        return data.length !== 0 ? data : {message: "No root documents"};
    }

    async getChildrenSkeletonsDocs({idx}: { idx: string[] }) {
        try {
            const data = await this.__customQuery({
                idx,
                whatSelect: `"id", "title", "icon", "isRoot", "childrenIdx"`
            })
            return data.length !== 0 ? data : {message: "No document(s)"};
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }

    async destroyDocById({parentId, id, flag}: { parentId: string, id: string, flag: boolean }) {
        try {
            const rId = id;
            if (flag) {
                const doc = await this.documentRepository.findByPk(parentId);
                const newIdx = doc.childrenIdx.filter(index => index !== rId);
                await doc.update({"childrenIdx": [...newIdx]});
            }

            await this.__recursiveDestruction({id, flag});

            return {message: "The document has been deleted irrevocably"};
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }

    async getTrash() {
        try {
            return await this.documentRepository.findAll({
                where: {deletedAt: {[Op.not]: null}},
                paranoid: false
            })
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }

    async restore({id}: { id: string }) {
        try {
            await this.documentRepository.restore({where: {id: id}});
            return {message: "Document has been restored"};
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }


    private async __recursiveDestruction({id, flag}: { id: string, flag: boolean }) {
        try {
            const data = await this.__customQuery({idx: Array(id), whatSelect: `"childrenIdx"`});
            await this.documentRepository.destroy({where: {id: id}, force: flag});

            if (data.length === 0) {
                return;
            }
            // @ts-ignore: error message
            const {childrenIdx} = data[0];
            await childrenIdx.forEach(childId => this.__recursiveDestruction({id: childId, flag}));
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }

    private async __customQuery({idx, whatSelect}: { idx: string[], whatSelect: string }): Promise<Object[]> {
        try {
            const whereQuery = idx.map(el => `id = '${el}'`).join(" OR ");
            const query = `SELECT ${whatSelect}
                           FROM "document"
                           WHERE ${whereQuery};`;

            return await this.documentRepository.sequelize.query(query).then(data => data[0]);
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }

    async __getAllDocs() {
        return await this.documentRepository.findAll({paranoid: false});
    }

    async clearTrash(interval) {
        setInterval(() => {
            this.getTrash()
                .then(data => data.forEach(item => {
                    const {id, deletedAt} = item;
                    if (Date.now() - deletedAt > interval) {
                        //const doc = this.documentRepository.findOne({where: {childrenIdx: {[Op.contained]: id}}})
                        //this.documentRepository.destroy({where: {id: id}, force: true})
                    }
                }));
        }, interval)
    }
}

