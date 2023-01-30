import { Component } from "preact";

import * as top from "../TopLvlMsg";
import { TopBar } from "../components/topbar";
import { NavTabs } from "../components/navtabs";

import { Library } from "../pages/library";
import { Pack } from "../pages/pack";
import { Folder } from "../pages/folder";
import { Glossary } from "../pages/glossary";
import { GroupFolder } from "../pages/groupFolder";

export class MainPage extends Component {

    constructor() {
        super();
    }

    private renderSubPage() {
        return top.getActiveTab().match({
            Folder: () => { return <Folder /> },
            Library: () => { return <Library /> },
            Pack: () => { return <Pack /> },
            Glossary: () => { return <Glossary /> },
            GroupFolder: (_) => { return <GroupFolder /> }
        });
    }

    render() {
        return (
            <div class="outermostDiv">
                <TopBar />
                <div style="background-color: #4abdb5" class="p-2.5">
                    <div class="grid gap-0 grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
                        <NavTabs />
                        {this.renderSubPage()}
                    </div>
                </div>
            </div>
        );
    }
}