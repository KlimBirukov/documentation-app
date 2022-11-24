import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';


@Module({
    controllers: [RolesController],
    providers: [AuthService],
    imports: [
        ConfigModule.forRoot({
            envFilePath: (`.${process.env.NODE_ENV}.env`)
        }),
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.PROCESS_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadModels: true,
            models: []
        }),
        UsersModule,
        AuthModule,
        RolesModule
    ],
})
export class AppModule {
}