import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';

import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/createRole.dto";
import {Roles} from "../auth/rolesAuth.decorator";
import {RolesGuard} from "../auth/rolesGuard";

//@Roles("ADMIN")
//@UseGuards(RolesGuard)
@Controller("roles")
export class RolesController {

    constructor(private roleService: RolesService) {
    }

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @Get("/:value")
    getByValue(@Param("value") value: string){
        return this.roleService.getRoleByValue(value);
    }

    @Get()
    getAllRoles(){
        return this.roleService.getAllRoles();
    }
}
