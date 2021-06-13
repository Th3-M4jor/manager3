import { makeTaggedUnion, none, MemberType } from "safety-match";

export const ChipEffect = makeTaggedUnion({
    Stagger: none,
    Blind: none,
    Confuse: none,
    Lock: none,
    Shield: none,
    Barrier: none,
    ACPierce: none,
    ACDown: none,
    Weakness: none,
    Invisible: none,
    Paralysis: none,
    Panic: none,
    Heal: none,
    DmgBoost: none,
});

const chipEffShortStrMatcher = {
    Stagger: () => "STGR",
    Blind: () => "BLIND",
    Confuse: () => "CONF",
    Lock: () => "LCK",
    Shield: () => "SHLD",
    Barrier: () => "BARR",
    ACPierce: () => "AC PRC",
    ACDown: () => "AC DN",
    Weakness: () => "WEAKN",
    Invisible: () => "INVIS",
    Paralysis: () => "PARA",
    Panic: () => "PANIC",
    Heal: () => "HEAL",
    DmgBoost: () => "DMG+"
};

export function chipEffectToShortStr(val: ChipEffect): string {
    return val.match(chipEffShortStrMatcher);
}

export type ChipEffect = MemberType<typeof ChipEffect>;

export function chipEffectFromStr(val: string): ChipEffect {
    switch(val) {
        case 'Stagger':
            return ChipEffect.Stagger;
        case 'Blind':
            return ChipEffect.Blind;
        case 'Confuse':
            return ChipEffect.Confuse;
        case 'Lock':
            return ChipEffect.Lock;
        case 'Shield':
            return ChipEffect.Shield;
        case 'Barrier':
            return ChipEffect.Barrier;
        case 'ACPierce':
            return ChipEffect.ACPierce;
        case 'ACDown':
            return ChipEffect.ACDown;
        case 'Weakness':
            return ChipEffect.Weakness; 
        case 'Invisible':
            return ChipEffect.Invisible;
        case 'Paralysis':
            return ChipEffect.Paralysis;
        case 'Panic':
            return ChipEffect.Panic;
        case 'Heal':
            return ChipEffect.Heal;
        case 'DmgBoost':
            return ChipEffect.DmgBoost;
        default:
            throw new TypeError(`No ChipEffect with the name ${val}`);
    }
}