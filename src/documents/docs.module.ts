import {forwardRef, Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {DocsService} from "./docs.service";
import {DocsController} from "./docs.controller";
import {Docs} from "./docs.model";
import {UsersModule} from "../users/users.module";
import {User} from "../users/users.model";
import {AuthModule} from "../auth/auth.module";


@Module({
    controllers: [DocsController],
    providers: [DocsService],
    imports: [
        SequelizeModule.forFeature([Docs, User]),
        forwardRef(() => UsersModule),
        AuthModule
    ],
    exports: [DocsService]
})
export class DocsModule {
}
