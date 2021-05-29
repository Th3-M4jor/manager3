import { $enum } from "ts-enum-util";

export enum ChipType {
    Burst,
    Construct,
    Melee,
    Projectile,
    Wave,
    Recovery,
    Summon,
    Support,
    Trap,
}

const wrappedChipType = $enum(ChipType);

export function chipTypeFromStr(val: string): ChipType {
    return wrappedChipType.getValueOrThrow(val);
}

export function chipTypeToShortStr(val: ChipType): string {
    return wrappedChipType.getKeyOrThrow(val)
}

export enum ChipClass {
    Standard,
    Mega,
    Giga,
    Dark,
    Support,
}

const wrappedChipClass = $enum(ChipClass);

export function chipClassFromStr(val: string): ChipClass {
    return wrappedChipClass.getValueOrThrow(val)
}