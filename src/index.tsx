import m from "mithril";

import * as top from "./TopLvlMsg";

import { ChipData } from "./library/battlechip";
import { ChipLibrary } from "./library/library";

import {MainPage} from "./components/mainpage";

import {Library} from "./pages/library";
import {Pack} from "./pages/pack";
import {Folder} from "./pages/folder";

import "../static/styles.pcss";

async function main() {
    let response = await fetch("/bnb/backend/fetch/chips");
    let body: ChipData[] = await response.json();
    ChipLibrary.init(body);

    //m.mount(document.body, Manager);
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