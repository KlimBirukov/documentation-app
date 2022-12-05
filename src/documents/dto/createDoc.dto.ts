export class CreateDocDto {
    readonly id: string;
    readonly title: string;
    readonly icon: string;
    readonly isRoot: boolean;
    readonly content?: JSON;
    readonly child_id?: string[];
    readonly creatorId: string;
}