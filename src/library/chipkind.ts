import { makeTaggedUnion, none, MemberType } from "safety-match";

export const ChipType = makeTaggedUnion({
    Burst: none,
    Construct: none,
    Melee: none,
    Projectile: none,
    Wave: none,
    Recovery: none,
    Summon: none,
    Support: none,
    Trap: none,
});

export type ChipType = MemberType<typeof ChipType>;

export function chipTypeFromStr(val: string): ChipType {
    switch (val) {
        case "Burst":
            return ChipType.Burst;
        case "Construct":
            return ChipType.Construct;
        case "Melee":
            return ChipType.Melee;
        case "Projectile":
            return ChipType.Projectile;
        case "Recovery":
            return ChipType.Recovery;
        case "Summon":
            return ChipType.Summon;
        case "Support":
            return ChipType.Support;
        case "Trap":
            return ChipType.Trap;
        case "Wave":
            return ChipType.Wave;
        default:
            throw new TypeError("Bad chiptype name");
    }
}

const chipTypeShortStrMatcher = {
    Burst: () => "BST",
    Construct: () => "CNS",
    Melee: () => "MLE",
    Projectile: () => "PRJ",
    Wave: () => "WVE",
    Recovery: () => "RCV",
    Summon: () => "SUM",
    Support: () => "SPT",
    Trap: () => "TRP",
};

export function chipTypeToShortStr(val: ChipType): string {
    return val.match(chipTypeShortStrMatcher);
}

const chipTypeToSortNumMatcher = {
    Burst: () => 0,
    Construct: () => 1,
    Melee: () => 2,
    Projectile: () => 3,
    Wave: () => 4,
    Recovery: () => 5,
    Summon: () => 6,
    Support: () => 7,
    Trap: () => 8,
};

export function chipTypeToSortNum(val: ChipType): number {
    return val.match(chipTypeToSortNumMatcher);
}

const stdChipTypeToBgCssMatcher = {
    Trap: () => "chipDescBackgroundSupprt",
    Summon: () => "chipDescBackgroundSupprt",
    Support: () => "chipDescBackgroundSupprt",
    _: () => "chipDescBackgroundStd"
};

export function stdChipTypeToBgCss(val: ChipType): string {
    return val.match(stdChipTypeToBgCssMatcher);
}

export const ChipClass = makeTaggedUnion({
    Standard: none,
    Mega: none,
    Giga: none,
    Dark: none,
    Support: none,
});

export type ChipClass = MemberType<typeof ChipClass>;

export function chipClassFromStr(val: string): ChipClass {
    switch (val) {
        case "Standard":
            return ChipClass.Standard;
        case "Support":
            return ChipClass.Support;
        case "Mega":
            return ChipClass.Mega;
        case "Giga":
            return ChipClass.Giga;
        case "Dark":
            return ChipClass.Dark;
        default:
            throw new TypeError("Bad chipclass name");
    }
}

const chipClassSortNumMatcher = {
    Standard: () => 0,
    Support: () => 0,
    Mega: () => 1,
    Giga: () => 2,
    Dark: () => 3,
};

export function chipClassToSortNum(val: ChipClass): number {
    return val.match(chipClassSortNumMatcher);
}

const chipClassMaxInFolderMatcher = {
    Standard: () => 3,
    Support: () => 3,
    Mega: () => 1,
    Giga: () => 1,
    Dark: () => 1,
};

export function chipClassMaxInFolder(val: ChipClass): number {
    return val.match(chipClassMaxInFolderMatcher);
}

const chipClassToCssMatcher = {
    Standard: () => "Chip",
    Mega: () => "Mega",
    Giga: () => "Giga",
    Support: () => "SupportChip",
    Dark: () => "DarkChip"
};

export function chipClassToCss(val: ChipClass): string {
    return val.match(chipClassToCssMatcher);
}

const chipClassBackgroundCssMatcher = {
    Standard: () => "chipDescBackgroundStd",
    Mega: () => "chipDescBackgroundMega",
    Giga: () => "chipDescBackgroundGiga",
    Support: () => "chipDescBackgroundSupprt",
    Dark: () => "chipDescBackgroundDark"
};

export function chipClassToBackgroundCss(val: ChipClass): string {
    return val.match(chipClassBackgroundCssMatcher);
}