import {Body, Controller, Delete, Get, Post} from "@nestjs/common";

import {DocsService} from "./docs.service";


@Controller("docs")
export class DocsController {

    constructor(private docsService: DocsService) {
    }

    @Post()
    create(@Body() {parentId, document}) {
        return this.docsService.createDocument(document, parentId);
    }

    @Get()
    getRootSkeletonsDocs(){
        return this.docsService.getSkeletonsRootDocs();
    }

    @Post("/get-child-docs-by-idx")
    getChildrenSkeletonsDocs(@Body() idx){
        return this.docsService.getChildrenSkeletonsDocs(idx);
    }
    
    @Post("/get-by-id")
    getDocumentById(@Body() id){
        return this.docsService.getDocById(id);
    }

    @Get("/all")
    getAll(){
        return this.docsService.__getAllDocs();
    }

    @Delete()
    destroy(@Body() body){
        return this.docsService.destroyDocById(body);
    }

    @Get("/trash")
    getTrash(){
        return this.docsService.getTrash();
    }

    @Post("/trash")
    restoreTrashById(@Body() body){
        return this.docsService.restore(body);
    }
}
