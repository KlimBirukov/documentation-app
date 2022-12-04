import {
    Body,
    Controller,
    HttpStatus,
    ParseFilePipeBuilder,
    Post,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";

import {ImageService} from "./image.service";


@Controller("image")
export class ImageController {

    constructor(private imageService: ImageService) {
    }

    @Post("url")
    uploadImageUrl(@Body() object: { url: string }) {
        return this.imageService.uploadImageUrl(object)
    }

    @Post("file")
    @UseInterceptors(FileInterceptor("image"))
    uploadImageFile(@UploadedFile(
        new ParseFilePipeBuilder()
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            }),
    ) file: Express.Multer.File) {
        return this.imageService.fileToBase64(file);
    }
}
