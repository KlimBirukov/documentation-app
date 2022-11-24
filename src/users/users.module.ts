import {forwardRef, Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {Role} from "../roles/roles.model";
import {User} from "./users.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {UsersRoles} from "../roles/users-roles";


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
