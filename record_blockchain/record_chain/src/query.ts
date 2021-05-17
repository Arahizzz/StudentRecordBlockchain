export interface Query {
    selector?: Selector;
    sort?: Sort;
    fields?: string[];
    useIndex?: string;
}

type Primitives = string | number | boolean;

type Selector = Record<string, Primitives | Equality | Regex | Array | ElemMatch> | LogicArray;

type LogicArray = Partial<Record<"$and" | "$or" | "$nor", Selector[]>>;

type EqualityOps = "$eq" | "$gt" | "$gte" | "$lt" | "$lte"

type Equality = Partial<Record<EqualityOps, Primitives>>

type Regex = Record<"$regex", string>

type ArrayOps = "$in" | "$nin";

type Array = Partial<Record<ArrayOps, any[]>>

type ElemMatch = Record<"$elemMatch", Record<string, Primitives | Equality | Regex> | LogicArray>

type Sort = Record<string, "asc" | "desc">[]