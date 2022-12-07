import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";

import {ImageController} from "./image.controller";
import {ImageService} from "./image.service";


@Module({
    controllers: [ImageController],
    providers: [ImageService],
    imports: [
        HttpModule,
    ],
})
export class ImageModule {
}
