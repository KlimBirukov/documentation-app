import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";

import {RolesService} from "./roles.service";
import {RolesController} from "./roles.controller";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UsersRoles} from "./users-roles";
import {AuthModule} from "../auth/auth.module";
import {SeederModule} from "nestjs-sequelize-seeder";
import {SeedRole} from "./seeders/SeedRole";


@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [
        SequelizeModule.forFeature([Role, User, UsersRoles]),
        AuthModule,
        SeederModule.forFeature([SeedRole])
    ],
    exports: [RolesService],
})
export class RolesModule {
}
