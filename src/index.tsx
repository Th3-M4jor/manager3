import m, { CVnode, Vnode } from "mithril";
import stream from "mithril/stream";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "./JsxNamespace";
import { BattleChip, ChipData } from "./library/battlechip";
import { ChipLibrary } from "./library/library";

import "../static/styles.pcss";

async function main() {
    let response = await fetch("/manager/chips.json");
    let body: ChipData[] = await response.json();
    ChipLibrary.init(body);

    m.render(document.body, <Manager />);
}
class Manager extends MitrhilTsxComponent {
    constructor(attrs: CVnode) {
        super(attrs);

        

    }
    
    view(): m.Vnode {
        /*
        return (
            <>
            <h1>
                Hello world
            </h1>
            <h2 class="debug">
                {ChipLibrary.size}
                <span class="chipImgBox">
                    <span class="fireChip"/>
                    <span class="aquaChip"/>
                </span>
            </h2>
            </>
        )
        */
        return (
            <>
                <div class="outermostDiv">
                    <div class="topStatusBar">
                        <span style="padding-left: 5px">
                            {"Library"}
                        </span>
                        <span style="float: right; color: red">
                            {""}
                        </span>
                    </div>
                </div>
            </>
        );
    }
}

main()