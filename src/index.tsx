import m from "mithril";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "./JsxNamespace";
import { BattleChip, ChipData } from "./library/battlechip";
import {ChipLibrary} from "./library/library";

import "../static/styles.pcss";

async function main() {
    let response = await fetch("/manager/chips.json");
    let body: ChipData[] = await response.json();
    ChipLibrary.init(body);

    m.render(document.body, <MyComponent />);
}
class MyComponent extends MitrhilTsxComponent {
    view(): m.Vnode {
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
    }
}

main()