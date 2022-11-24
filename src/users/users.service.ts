import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";

import {User} from "./users.model";
import {CreateUserDto} from "./dto/createUser.dto";
import {AddRoleDto} from "./dto/addRole.dto";
import {RolesService} from "../roles/roles.service";


@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User, private roleService: RolesService) {
    }

    async createUser(dto: CreateUserDto) {
        const existedUser = await this.getUserByEmail(dto.email);
        if(existedUser){
                throw new HttpException("Email already in use", HttpStatus.CONFLICT);
        }
        const role = await this.roleService.getRoleByValue("ADMIN");
        const user = await this.userRepository.create(dto);
        await user.$set("roles", [role.id])
        user.roles = [role];
        return user;
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({where: {email}, include: {all: true}})
    }

    async getAllUsers() {
        return await this.userRepository.findAll({include: {all: true}});
    }

    async addRoleToUser(dto: AddRoleDto) {
        const user = await this.getUserByEmail(dto.email);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add("role", role.id);
            return dto;
        }
        throw new HttpException("User or role not found", HttpStatus.NOT_FOUND);
    }
}
