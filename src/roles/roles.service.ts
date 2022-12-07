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
            return await this.roleRepository.create(dto);
        } catch (error) {
            throw new HttpException("Role already existed", HttpStatus.CONFLICT);
        }
    }

    async getRoleByValue(value: string) {
        return await this.roleRepository.findByPk(value);
    }
}
