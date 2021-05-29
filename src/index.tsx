import m from "mithril";
//import "./fragment-polyfix";
import { MitrhilTsxComponent } from "./JsxNamespace";

import "../static/styles.pcss";

class MyComponent extends MitrhilTsxComponent {
    view() {
        return (
            <>
            <h1>
                Hello world
            </h1>
            <h2>
                Test Msg
            </h2>
            </>
        )
    }
}

m.render(document.body, <MyComponent />)