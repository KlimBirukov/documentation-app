import {Body, Controller, Post} from "@nestjs/common";

import {MailSenderService} from "./mail-sender.service";


@Controller('send-mail')
export class MailSenderController {
    constructor(private mailSenderService: MailSenderService) {
    }

    @Post()
    send(@Body() letter) {
        return this.mailSenderService.send(letter);
    }
}
