import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {ServeStaticModule} from "@nestjs/serve-static";
import {SeederModule} from "nestjs-sequelize-seeder";
import {MailerModule} from "@nestjs-modules/mailer";
import {join} from "path";

import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";
import {RolesModule} from "./roles/roles.module";
import {DocsModule} from "./documents/docs.module";
import {ImageModule} from "./image/image.module";
import {MailSenderModule} from "./mail-sender/mail-sender.module";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: (`.${process.env.NODE_ENV === undefined ? "production" : process.env.NODE_ENV}.env`)
        }),
        SequelizeModule.forRoot({
            dialect: "postgres",
            host: process.env.PROCESS_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadModels: true,
        }),
        SeederModule.forRoot({
            runOnlyIfTableIsEmpty: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "client"),
            exclude: ["/api*"],
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                secure: true,
                auth: {
                    user: process.env.MAIL_AUTH_USER,
                    pass: process.env.MAIL_AUTH_PASS,
                }
            }
        }),
        UsersModule,
        AuthModule,
        RolesModule,
        DocsModule,
        ImageModule,
        MailSenderModule
    ],
})
export class AppModule {
}