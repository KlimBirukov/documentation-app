import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {DocsService} from "./docs.service";
import {DocsController} from "./docs.controller";
import {Docs} from "./docs.model";


@Module({
    controllers: [DocsController],
    providers: [DocsService],
    imports: [
        SequelizeModule.forFeature([Docs])
    ],
    exports: [DocsService]
})
export class DocsModule {
}
