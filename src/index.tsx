import m from "mithril";

import "./fragment-polyfix";

import * as top from "./TopLvlMsg";

import { BattleChip } from "./library/battlechip";
import { ChipLibrary } from "./library/library";

import {MainPage} from "./components/mainpage";

import {Library} from "./pages/library";
import {Pack} from "./pages/pack";
import {Folder} from "./pages/folder";

import "../static/styles.pcss";

async function main() {

    const chips = await m.request<BattleChip[]>({
        method: "GET",
        url: "/bnb/backend/fetch/chips",
        type: BattleChip
    });

    ChipLibrary.initFromChips(chips);

    m.route(document.body, "/Library", {
        "/Library": {
            render: function() {
                return (
                    <MainPage activeTab={top.Tabs.Library}>
                        <Library/>
                    </MainPage>
                );
            }
        },
        "/Pack": {
            render: function() {
                return (
                    <MainPage activeTab={top.Tabs.Pack}>
                        <Pack/>
                    </MainPage>
                );
            }
        },
        "/Folder": {
            render: function() {
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