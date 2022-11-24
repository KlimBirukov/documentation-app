import {Body, Controller, Get, Post, UseGuards} from "@nestjs/common";

import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/createUser.dto";
import {Roles} from "../auth/rolesAuth.decorator";
import {RolesGuard} from "../auth/rolesGuard";
import {AddRoleDto} from "./dto/addRole.dto";


@Controller("users")
export class UsersController {

    constructor(private userService: UsersService) {
    }

    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.userService.createUser(userDto);
    }

    @Get()
    //@Roles("ADMIN")
    //@UseGuards(RolesGuard)
    getAll() {
        return this.userService.getAllUsers()
    }

    @Post()
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRoleToUser(dto);
    }
}
