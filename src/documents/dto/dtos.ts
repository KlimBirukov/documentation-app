export class CreateDocDto {
    readonly id: string;
    readonly title: string;
    readonly icon: string;
    readonly content?: JSON;
    readonly child_id?: string[];
    readonly parent_id?: string;
    readonly creatorId: string;
}

export class DeleteDocDto {
    readonly id: string;
    readonly flag: boolean;
}

export class GetChildrenDocDto{
    readonly idx: string[];
}

export class UpdateDocDto {
    readonly id: string;
    readonly title?: string;
    readonly icon?: string;
    readonly content?: string;
}

export class GetDocDto {
    readonly id: string;
}

export class SearchDto {
    readonly query: string;
}