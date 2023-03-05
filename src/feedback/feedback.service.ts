import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";

import {Feedback} from "./feedback.model";

@Injectable()
export class FeedbackService {
    constructor(@InjectModel(Feedback) private feedbackRepository: typeof Feedback) {
    }

    async createFeedback(): Promise<any> {
        try {

        } catch (error) {

        }
    }

}
