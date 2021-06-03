import stream from "mithril/stream";

import {makeTaggedUnion, none, MemberType} from "safety-match";

export const Tabs = makeTaggedUnion({
    Library: none,
    Pack: none,
    Folder: none,
    GroupFolder: (name: string) => name,
});

export type TabName = MemberType<typeof Tabs>;


export const TopLvlMsg = makeTaggedUnion({
    ChangeTab: (name: TabName) => name,
    SetMsg: (msg: string) => msg,
    ChangeChipDesc: (id: number | undefined) => id,
    JoinGroup: none,
    LeaveGroup: none,
    GroupsUpdated: none,
    EraseData: none,
    ImportData: none,
    DoNothing: none,
});

export type TopLvlMsgVal = MemberType<typeof TopLvlMsg>;

var topStream = stream<TopLvlMsgVal>();

export function getTopStream() {
    return topStream;
}