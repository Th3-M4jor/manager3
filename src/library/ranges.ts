import { makeTaggedUnion, none, MemberType } from "safety-match";

export const Range = makeTaggedUnion({
  Var: none,
  Far: none,
  Near: none,
  Close: none,
  Self: none,
});

export type Range = MemberType<typeof Range>;

export function rangeFromStr(val: string): Range {
  val = val.toLowerCase();
  switch (val) {
    case "varies":
    case "var":
      return Range.Var;
    case "far":
      return Range.Far;
    case "near":
      return Range.Near;
    case "close":
      return Range.Close;
    case "self":
      return Range.Self;
    default:
      throw new TypeError("Invalid Range");
  }
}

export function rangeToShortStr(val: Range): string {
  return val.variant;
}

const rangeToSortNumMatcher = {
  Var: () => 0,
  Far: () => 1,
  Near: () => 2,
  Close: () => 3,
  Self: () => 4,
};

export function rangeToSortNum(val: Range): number {
  return val.match(rangeToSortNumMatcher);
}
