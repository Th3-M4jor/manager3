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
    JoinGroup: none,
    LeaveGroup: none,
    GroupsUpdated: none,
    EraseData: none,
    ImportData: none,
    DoNonting: none,
});

export type TopLvlMsgVal = MemberType<typeof TopLvlMsg>;

/*
export enum TopLvlMsgTag {
    ChangeTab,
    SetMsg,
    JoinGroup,
    LeaveGroup,
    GroupsUpdated,
    EraseData,
    ImportData,
    DoNothing,
}

interface SetTopMsg {
    tag: TopLvlMsgTag.SetMsg,
    msg: string
}

interface ChangeTab {
    tag: TopLvlMsgTag.ChangeTab,
    tabname: string,
}

interface JoinGroup {
    tag: TopLvlMsgTag.JoinGroup,
}

interface LeaveGroup {
    tag: TopLvlMsgTag.LeaveGroup,
}

interface GroupsUpdated {
    tag: TopLvlMsgTag.GroupsUpdated,
}

interface ImportData {
    tag: TopLvlMsgTag.ImportData,
}

interface EraseData {
    tag: TopLvlMsgTag.EraseData,
}

interface DoNothing {
    tag: TopLvlMsgTag.DoNothing,
}

export type TopLvlMsg = SetTopMsg | ChangeTab | JoinGroup | LeaveGroup | GroupsUpdated | ImportData | EraseData | DoNothing;
*/

//let x = TopLvlMsg.ChangeTab("thing");

var topStream = stream<TopLvlMsgVal>();

export function getTopStream() {
    return topStream;
}