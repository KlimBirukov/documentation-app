import { Injectable } from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";


@Injectable()
export class MailSenderService {
    constructor(private mailService: MailerService) {
    }

    async send(letter): Promise<boolean>{
        return await this.mailService.sendMail({
            to: letter.to,
            from: letter.from,
            subject: letter.subject,
            text: letter.text,
        })
            .then(() => true)
            .catch(() => false)
    }
}
