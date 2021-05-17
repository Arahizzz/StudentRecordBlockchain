import { Object, Property } from "fabric-contract-api";

@Object()
export class RecordBook {
  @Property()
  public email!: string;

  @Property()
  public periods!: Period[];
}

@Object()
export class Period {
    @Property()
    year!: number;

    @Property()
    num!: number;

    @Property()
    marks!: Mark[];
}

@Object()
export class Mark {
  @Property()
  public subject!: string;

  @Property()
  public teacher!: string;

  @Property()
  public mark!: number;
}
