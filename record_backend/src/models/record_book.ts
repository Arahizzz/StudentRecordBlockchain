export interface RecordBook {
   email: string;
   periods: Period[];
}


export interface Period {
    year: number;
    num: number;
    marks: Mark[];
}


export interface Mark {
   subject: string;
   teacher: string;
   mark: number;
}