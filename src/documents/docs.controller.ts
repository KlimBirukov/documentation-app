import {Body, Controller, Delete, Get, Patch, Post, UseGuards} from "@nestjs/common";

import {DocsService} from "./docs.service";
import {DeleteDocDto, GetDocDto, GetChildrenDocDto, CreateDocDto, UpdateDocDto, SearchDto} from "./dto/dtos";
import {CommonResponse, SuccessfulResponseWithData} from "./responses/responses";
import {Roles} from "../auth/rolesAuth.decorator";
import {JwtAuthGuard} from "../auth/jwtAuth.guard";
import {RolesGuard} from "../auth/rolesGuard";


@Controller("docs")
export class DocsController {

    constructor(private docsService: DocsService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateDocDto): Promise<CommonResponse> {
        return this.docsService.createDocument(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    update(@Body() dto: UpdateDocDto): Promise<CommonResponse> {
        return this.docsService.updateDocById(dto);
    }

    @Get()
    getRootSkeletonsDocs(): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.getSkeletonsRootDocs();
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    destroy(@Body() dto: DeleteDocDto): Promise<CommonResponse> {
        return this.docsService.destroyDocById(dto);
    }

    @Post("children")
    getChildrenSkeletonsDocs(@Body() dto: GetChildrenDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.getChildrenSkeletonsDocs(dto);
    }

    @Post("doc")
    getDocumentById(@Body() dto: GetDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.getDocById(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get("trash")
    getTrash(): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.getTrash();
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post("trash")
    restoreTrashById(@Body() dto: GetDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.restore(dto);
    }

    @Post("search")
    searchDocs(@Body() dto: SearchDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.search(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post("duplicate")
    duplicate(@Body() dto: GetDocDto): Promise<CommonResponse | SuccessfulResponseWithData> {
        return this.docsService.duplicate(dto);
    }
}
