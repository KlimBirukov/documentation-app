import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";

import {User} from "./users.model";
import {CreateUserDto} from "./dto/createUser.dto";
import {AddRoleDto} from "./dto/addRole.dto";
import {RolesService} from "../roles/roles.service";
import {Role} from "../roles/roles.model";
import {UsersRoles} from "../roles/users-roles";
import {Roles} from "../auth/rolesAuth.decorator";


@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User, private roleService: RolesService) {
    }

    async createUser(dto: CreateUserDto) {
        try {
            const existedUser = await this.getUserByEmail(dto.email);
            if (existedUser) {
                throw new HttpException("Email already in use", HttpStatus.CONFLICT);
            }
            const role = await this.roleService.getRoleByValue("USER");
            const user = await this.userRepository.create(dto);
            await user.$add("roles", [role.value])
            user.roles = [role];

            return user;
        } catch (error) {
            return
        }
    }

    async getUserByEmail(email: string) {
        const data = await this.userRepository.findOne({
                where: {email},
                include: [{
                    model: Role,
                    attributes: {
                        exclude: ["description", "createdAt", "updatedAt", "UsersRoles"],
                        include: ["value"],
                    },
                }],
            }
        )
        if(data) {
            const roles = []
            data.roles.forEach(item => roles.push(item.value))
            data.roles = [...roles];
        }
        return data;
    }

    async getAllUsers() {
        return await this.userRepository.findAll({include: {all: true}});
    }

    async addRoleToUser(dto: AddRoleDto) {
        const user = await this.getUserByEmail(dto.email);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add("roles", role.value);
            return dto;
        }
        throw new HttpException("User or role not found", HttpStatus.NOT_FOUND);
    }
}
