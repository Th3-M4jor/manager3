import m from "mithril";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "./JsxNamespace";
import { BattleChip, ChipData } from "./library/battlechip";

import "../static/styles.pcss";

var chips: BattleChip[] = [];

async function main() {
    let response = await fetch("/manager/chips.json");
    let body: ChipData[] = await response.json();
    chips = body.map(chip => new BattleChip(chip));

    m.render(document.body, <MyComponent />);
}
class MyComponent extends MitrhilTsxComponent {
    view(): m.Vnode {
        return (
            <>
            <h1>
                Hello world
            </h1>
            <h2>
                {chips.length}
            </h2>
            </>
        )
    }
}

main()