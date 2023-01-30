import {Body, Controller, Get, Post, UseGuards} from "@nestjs/common";

import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/createUser.dto";
import {AddRoleDto} from "./dto/addRole.dto";
import {Roles} from "../auth/rolesAuth.decorator";
import {RolesGuard} from "../auth/rolesGuard";


@Controller("users")
export class UsersController {

    constructor(private userService: UsersService) {
    }

    // @Post()
    // create(@Body() userDto: CreateUserDto) {
    //     return this.userService.createUser(userDto);
    // }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post("/addRole")
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRoleToUser(dto);
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post("/removeRole")
    removeRole(@Body() dto: AddRoleDto) {
        return this.userService.removeRoleFromUser(dto);
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.userService.getAll();
    }
}
