import {Module} from "@nestjs/common";
import {ImageController} from "./image.controller";
import {ImageService} from "./image.service";
import {HttpModule} from "@nestjs/axios";
import {NestjsFormDataModule} from "nestjs-form-data"


@Module({
    controllers: [ImageController],
    providers: [ImageService],
    imports: [
        HttpModule,

    ],
})
export class ImageModule {
}
