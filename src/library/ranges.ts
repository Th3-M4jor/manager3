import { makeTaggedUnion, none, MemberType } from "safety-match";

export const Range = makeTaggedUnion({
    Varies: none,
    Far: none,
    Near: none,
    Close: none,
    Self: none,
});

export type Range = MemberType<typeof Range>;

export function rangeFromStr(val: string): Range {
    switch(val) {
        case "Varies":
            return Range.Varies;
        case "Far":
            return Range.Far;
        case "Near":
            return Range.Near;
        case "Close":
            return Range.Close;
        case "Self":
            return Range.Self;
        default:
            throw new TypeError("Invalid Range");
    }
}

export function rangeToShortStr(val: Range): string {
    
    if (val.variant == "Varies") {
        return "Var"; //only one that actually needs to be shortened
    } else {
        return val.variant;
    }

}

/*
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
*/