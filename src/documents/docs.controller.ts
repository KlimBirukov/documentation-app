import {Body, Controller, Delete, Get, Patch, Post} from "@nestjs/common";

import {DocsService} from "./docs.service";
import {DeleteDocDto, GetDocDto, GetChildrenDocDto, CreateDocDto, UpdateDocDto} from "./dto/dtos";
import {CommonResponse, SuccessfulResponseWithData} from "./responses/responses";


@Controller("docs")
export class DocsController {

    constructor(private docsService: DocsService) {
    }

    @Post()
    create(@Body() dto: CreateDocDto): Promise<CommonResponse> {
        return this.docsService.createDocument(dto);
    }

    @Patch()
    update(@Body() dto: UpdateDocDto): Promise<CommonResponse> {
        return this.docsService.updateDocById(dto);
    }

    @Get()
    getRootSkeletonsDocs(): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.getSkeletonsRootDocs();
    }

    @Delete()
    destroy(@Body() dto: DeleteDocDto): Promise<CommonResponse> {
        return this.docsService.destroyDocById(dto);
    }

    @Post("/children")
    getChildrenSkeletonsDocs(@Body() dto: GetChildrenDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.getChildrenSkeletonsDocs(dto);
    }

    @Post("/doc")
    getDocumentById(@Body() dto: GetDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.getDocById(dto);
    }

    @Get("/trash")
    getTrash(): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.getTrash();
    }

    @Post("/trash")
    restoreTrashById(@Body() dto: GetDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.restore(dto);
    }

    // dev query, will be deleted in production
    @Get("/all")
    getAll() {
        return this.docsService.__getAllDocs();
    }
}
