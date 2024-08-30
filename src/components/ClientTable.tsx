import {Attributes, Component, ComponentChild, ComponentChildren, Ref} from "preact";
import {ReadyOrderItem} from "../model/model";
import {context} from "esbuild";


export class ClientTableComponent extends Component {
    render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
        return (
            <div class="tableWithFoodDiv">
                {props.items.map(item => <DishComponent item={item}/>)}
            </div>
        )
    }
}

function DishComponent(props) {
    return (
        <div className="row">
            <div className="row">
                <div className="col-6">{props.item.dishName}</div>
                <div className="col-6">{props.item.comment}</div>
            </div>
            <div className="row">
                <div className="col-12">{props.item.payload}</div>
            </div>
        </div>
    )
}
