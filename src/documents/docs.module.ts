import {forwardRef, Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {DocsService} from "./docs.service";
import {DocsController} from "./docs.controller";
import {Docs} from "./docs.model";
import {UsersModule} from "../users/users.module";
import {User} from "../users/users.model";


@Module({
    controllers: [DocsController],
    providers: [DocsService],
    imports: [
        SequelizeModule.forFeature([Docs, User]),
        forwardRef(() => UsersModule),
    ],
    exports: [DocsService]
})
export class DocsModule {
}
