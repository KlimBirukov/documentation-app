import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";

import {Role} from "./roles.model";
import {CreateRoleDto} from "./dto/createRole.dto";


@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {
    }

    async createRole(dto: CreateRoleDto) {
        try {
            const {value, description} = dto;
            const newRole = await this.roleRepository.create({
                value: value,
                description: description,
                isDestroyable: true
            });
            return {value: newRole.value, description: newRole.description, isDestroyable: newRole.isDestroyable};
        } catch (error) {
            throw new HttpException("Role already existed", HttpStatus.CONFLICT);
        }
    }

    async getRoleByValue(value: string) {
        return await this.roleRepository.findByPk(value);
    }

    async getExistedRoles() {
        try {
            return this.roleRepository.findAll({attributes: {exclude: ["createdAt", "updatedAt"]}});
        } catch (error) {
            throw new HttpException("Couldn\'t get roles", HttpStatus.NOT_FOUND)
        }
    }

    async deleteRole(roleName) {
        try {
            const {value} = roleName;
            return this.roleRepository.destroy({where: {value: value}});
        } catch {
            throw new HttpException("Couldn\'t delete role", HttpStatus.BAD_REQUEST);
        }
    }
}
