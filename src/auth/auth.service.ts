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
        return this.generateToken(user);
    }

    async registration(userDto: CreateUserDto){
        const candidate = await this.userService.getUserByEmail(userDto.password);
        if (candidate) {
            throw new HttpException("A user with this email already exists", HttpStatus.BAD_REQUEST)
        }
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        const user = await this.userService.createUser({...userDto, password: hashedPassword});
        return await this.generateToken(user);
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) return user;
        throw new UnauthorizedException({message: "Invalid email or password"});
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {token: this.jwtService.sign(payload)}
    }

}
