import {forwardRef, Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {User} from "./users.model";
import {AuthModule} from "../auth/auth.module";
import {RolesModule} from "../roles/roles.module";
import {UsersRoles} from "../roles/users-roles";
import {Role} from "../roles/roles.model";
import {DocsModule} from "../documents/docs.module";
import {Docs} from "../documents/docs.model";


@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, UsersRoles, Docs]),
        RolesModule,
        forwardRef(() => AuthModule),
        forwardRef(() => DocsModule)
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule {
}
