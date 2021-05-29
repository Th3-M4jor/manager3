import { $enum } from "ts-enum-util";

export enum Element {
    Fire,
    Aqua,
    Elec,
    Wood,
    Wind,
    Sword,
    Break,
    Cursor,
    Recovery,
    Invis,
    Object,
    Null,
}

const wrappedElement = $enum(Element);

export function elementFromStr(val: string): Element {
    return wrappedElement.getValueOrThrow(val);
}