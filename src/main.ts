import {NestFactory} from "@nestjs/core";
import {json} from "express";

import {AppModule} from "./app.module";


async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(json({limit: "50mb"}));
    app.setGlobalPrefix("api");
    await app.listen(PORT, () => () => console.log(`Server started on the port: ${PORT}`));
}

start()
    .catch(error => console.error(`Something went wrong: ${error}`));