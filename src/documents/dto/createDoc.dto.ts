export class CreateDocDto {
    readonly id: string;
    readonly title: string;
    readonly icon: string;
    readonly isRoot: boolean;
    readonly content?: string;
    readonly creatorId: string;
}