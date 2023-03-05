import {Body, Controller, Post} from '@nestjs/common';
import {FeedbackService} from "./feedback.service";
import {CreateFeedbackDto} from "./dto/dtos";
import {CommonResponse} from "./responses/responses";

@Controller('feedback')
export class FeedbackController {
    constructor(private feedbackService: FeedbackService) {
    }

    @Post()
    getFeedback(@Body() dto: CreateFeedbackDto): Promise<CommonResponse> {
        return this.feedbackService.createFeedback();
    }
}
