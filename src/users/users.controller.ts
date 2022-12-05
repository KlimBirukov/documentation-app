import {Body, Controller, Get, Post} from "@nestjs/common";

import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/createUser.dto";
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
    getAll() {
        return this.userService.getAllUsers()
    }

    @Post("/addRole")
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRoleToUser(dto);
    }
}
