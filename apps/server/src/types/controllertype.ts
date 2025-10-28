
export interface SubmitBody {
    userid: string;
    code: string;
    language_id: number;
    stdin: string;
}

export interface RequestWithBody {
    userid: string,
    code: string,
    language_id: number,
    stdin?: string
}