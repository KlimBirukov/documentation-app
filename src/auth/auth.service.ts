import {HttpException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/createUser.dto";
import {User} from "../users/users.model";


@Injectable()
export class AuthService {

    constructor(private userService: UsersService, private jwtService: JwtService) {
    }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        const token = await this.generateToken(user);
        return {token, id: user.id, nickname: user.nickname, roles: user.roles, email: user.email};
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException("A user with this email already exists", HttpStatus.BAD_REQUEST)
        }
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        await this.userService.createUser({...userDto, password: hashedPassword});
        const user = await this.userService.getUserByEmail(userDto.email);
        const token = await this.generateToken(user);
        return {token, id: user.id, nickname: user.nickname, roles: user.roles, email: user.email};
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) return user;
        throw new UnauthorizedException({message: "Invalid email or password"});
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return this.jwtService.sign(payload);
    }
}
