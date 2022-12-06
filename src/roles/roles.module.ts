import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {RolesService} from "./roles.service";
import {RolesController} from "./roles.controller";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UsersRoles} from "./users-roles";
import {AuthModule} from "../auth/auth.module";


@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [
        SequelizeModule.forFeature([Role, User, UsersRoles]),
        AuthModule
    ],
    exports: [RolesService],
})
export class RolesModule {
}
