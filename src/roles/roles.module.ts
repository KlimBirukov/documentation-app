import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {RolesService} from "./roles.service";
import {RolesController} from "./roles.controller";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UsersRoles} from "./users-roles";


@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [
      SequelizeModule.forFeature([Role,User, UsersRoles]),
    ],
    exports: [RolesService],
})
export class RolesModule {
}
