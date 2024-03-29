import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";

import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";
import {RolesModule} from "./roles/roles.module";
import {DocsModule} from "./documents/docs.module";
import {ImageModule} from "./image/image.module";


@Module({
    controllers: [],
    providers: [],
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
        RolesModule,
        DocsModule,
        ImageModule
    ],
})
export class AppModule {
}