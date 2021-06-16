import m from "mithril";
import stream from "mithril/stream";
import {makeTaggedUnion, none, MemberType} from "safety-match";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "./JsxNamespace";

import * as top from "./TopLvlMsg";

import { BattleChip, ChipData } from "./library/battlechip";
import { ChipLibrary } from "./library/library";

import {MainPage} from "./components/mainpage";

import {TopBar} from "./components/topbar";
import {NavTabs} from "./components/navtabs";
import {Library} from "./pages/library";
import {Pack} from "./pages/pack";
import {Folder} from "./pages/folder";

import "../static/styles.pcss";
import { ChipDesc } from "./components/chipdesc";


async function main() {
    let response = await fetch("/bnb/backend/fetch/chips");
    let body: ChipData[] = await response.json();
    ChipLibrary.init(body);

    //m.mount(document.body, Manager);
    m.route(document.body, "/Library", {
        "/Library": {
            render: () => {
                return (
                    <MainPage activeTab={top.Tabs.Library}>
                        <Library/>
                    </MainPage>
                );
            }
        },
        "/Pack": {
            render: () => {
                return (
                    <MainPage activeTab={top.Tabs.Pack}>
                        <Pack/>
                    </MainPage>
                );
            }
        },
        "/Folder": {
            render: () => {
                return (
                    <MainPage activeTab={top.Tabs.Folder}>
                        <Folder inFolderGroup={false}/>
                    </MainPage>
                );
            }
        }
    })
}

main()