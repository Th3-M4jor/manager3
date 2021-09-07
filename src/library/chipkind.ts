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
    val = val.toLowerCase();
    switch (val) {
        case "burst":
            return ChipType.Burst;
        case "construct":
            return ChipType.Construct;
        case "melee":
            return ChipType.Melee;
        case "projectile":
            return ChipType.Projectile;
        case "recovery":
        case "recov":
        case "heal":
            return ChipType.Recovery;
        case "summon":
            return ChipType.Summon;
        case "support":
            return ChipType.Support;
        case "trap":
            return ChipType.Trap;
        case "wave":
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
    Construct: () => "chipDescBackgroundSupprt",
    Summon: () => "chipDescBackgroundSupprt",
    Support: () => "chipDescBackgroundSupprt",
    _: () => "chipDescBackgroundStd"
};

export function stdChipTypeToBgCss(val: ChipType): string {
    return val.match(stdChipTypeToBgCssMatcher);
}

const chipTypeToCssMatcher = {
    Construct: () => "SupportChip",
    Summon: () => "SupportChip",
    Support: () => "SupportChip",
    _: () => "Chip"
}

export function chipTypeToCss(val: ChipType): string {
    return val.match(chipTypeToCssMatcher);
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
    val = val.toLowerCase();
    switch (val) {
        case "standard":
            return ChipClass.Standard;
        case "support":
            return ChipClass.Support;
        case "mega":
            return ChipClass.Mega;
        case "giga":
            return ChipClass.Giga;
        case "dark":
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