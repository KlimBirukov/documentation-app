import {HttpException, Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios"


@Injectable()
export class ImageService {

    constructor(private readonly httpService: HttpService) {
    }

    async uploadImageUrl({url}: { url: string }) {
        try {
            const {data} = await this.httpService.axiosRef({
                url,
                method: "GET",
                responseType: "arraybuffer",
            });
            return {
                success: 1, file: {
                    url: `data:image/png;base64,${data.toString('base64')}`
                }
            }
        } catch (error) {
            throw new HttpException({message: "Something went wrong"}, error);
        }
    }


    fileToBase64(file: Express.Multer.File) {
        return {
            success: 1, file: {
                url: `data:image/png;base64,${file.buffer.toString('base64')}`
            }
        }
    }
}
