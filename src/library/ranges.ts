import { $enum } from "ts-enum-util";

export enum Range {
    Varies,
    Far,
    Near,
    Close,
    Self
}

const wrappedRange = $enum(Range);

export function rangeFromStr(val: string): Range {
    return wrappedRange.getValueOrThrow(val);
}

export function rangeToShortStr(val: Range): string {
    switch (val) {
        case Range.Varies:
            return "Var";
        case Range.Far:
            return "Far";
        case Range.Near:
            return "Near";
        case Range.Close:
            return "Close";
        case Range.Self:
            return "Self";
        default:
            throw new Error("Unreachable");
    }
}