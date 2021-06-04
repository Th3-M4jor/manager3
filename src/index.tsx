import m from "mithril";
import stream from "mithril/stream";
import {makeTaggedUnion, none, MemberType} from "safety-match";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "./JsxNamespace";

import * as top from "./TopLvlMsg";

import { BattleChip, ChipData } from "./library/battlechip";
import { ChipLibrary } from "./library/library";

import {TopBar} from "./components/topbar";
import {NavTabs} from "./components/navtabs";
import {Library} from "./components/library";
import {Pack} from "./components/pack";
import {Folder} from "./components/folder";

import "../static/styles.pcss";
import { ChipDesc } from "./components/chipdesc";


async function main() {
    let response = await fetch("/manager/chips.json");
    let body: ChipData[] = await response.json();
    ChipLibrary.init(body);

    m.mount(document.body, Manager);
}

class Manager extends MitrhilTsxComponent {
    private _msgHandler: stream<void>;
    private topMsg: string;
    private msgClearHandle: number | undefined;
    private activeTab: top.TabName;
    private chipDescId: number | undefined; 
    
    constructor(attrs: m.CVnode) {
        super(attrs);
        this.msgClearHandle = undefined;
        this.activeTab = top.Tabs.Library;
        this.topMsg = "";
        this._msgHandler = top.getTopStream().map(msg => this.onMsg(msg));
    }

    onMsg(msg: top.TopLvlMsgVal) {
        msg.match({
            ChangeTab: (tabname) => {this.activeTab = tabname},
            DoNothing: () => {},
            EraseData: () => {},
            GroupsUpdated: () => {},
            ImportData: () => {},
            JoinGroup: () => {},
            LeaveGroup: () => {},
            SetMsg: (msg) => {this.setTopMsg(msg)},
            ChangeChipDesc: (id) => {this.chipDescId = id},
        });
    }

    setTopMsg(msg: string) {
        if(msg.length == 0) {
            this.msgClearHandle = undefined;
        } else {
            window.clearTimeout(this.msgClearHandle);
            this.msgClearHandle = window.setTimeout(() => {this.topMsg = ""}, 15_000); //15 seconds
        }
        this.topMsg = msg;
    }

    tabToString(): string {
        let val = this.activeTab.match({
            Folder: () => {return "Folder"},
            Library: () => {return "Library"},
            Pack: () => {return "Pack"},
            GroupFolder: (name) => {
                return (name.length > 15 ? name.substr(0, 12) : name) + "'s Folder";
            }
        });
        return val;
    }
    
    view(): m.Vnode {
        return (
            <>
                <div class="outermostDiv">
                    <TopBar tabName={this.tabToString()} msg={this.topMsg}/>
                    <div style="background-color: #4abdb5;" class="p-2.5">
                        <NavTabs activeTab={this.activeTab}/>
                        <div class="grid grid-cols-4 gap-0 sm:grid-cols-6">
                            <Folder active={this.activeTab.variant == "Folder"} inFolderGroup={false}/>
                            <Pack active={this.activeTab.variant == "Pack"}/>
                            <Library active={this.activeTab.variant == "Library"}/>
                            <ChipDesc displayChip={this.chipDescId}/>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    onremove() {
        this._msgHandler(); // fake usage so that optimizer doesn't remove it
    }
}

main()