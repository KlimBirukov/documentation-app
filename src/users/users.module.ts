import {forwardRef, Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {User} from "./users.model";
import {AuthModule} from "../auth/auth.module";
import {RolesModule} from "../roles/roles.module";
import {UsersRoles} from "../roles/users-roles";
import {Role} from "../roles/roles.model";


@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, UsersRoles]),
        RolesModule,
        forwardRef(() => AuthModule),
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule {
}
