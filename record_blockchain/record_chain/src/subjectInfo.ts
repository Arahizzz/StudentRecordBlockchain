import { Object, Property } from 'fabric-contract-api';

@Object()
export class SubjectInfo {
    @Property()
    public year!: number;

    @Property()
    public period!: number;
    
    @Property()
    public subject!: string;

    @Property()
    public students!: string[];

    @Property()
    public teachers!: string[];
}