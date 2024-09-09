import {Attributes, Component, ComponentChild, ComponentChildren, Ref} from "preact";
import {useState} from "preact/hooks";


export class ClientTableComponent extends Component {
    render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
        return (
            <div class="tableWithFoodDiv">
                {props.items.map(item => <DishComponent item={item}/>)}
            </div>
        )
    }
}

const EATEN_PROGRESS = "#"

function DishComponent(props) {

    const [payload, setPayload] = useState(props.item.payload)
    const startEating = () => {
        if (payload.endsWith(EATEN_PROGRESS)) {
            console.log(`finished eating ${props.item.dishName}`)
            return
        }
        setTimeout(() => {
            const nextIdx = nextPayloadIndex(payload)
            if (nextIdx < 0) {
                console.warn(`invalid payload ${payload}`)
                return
            }
            const newPayload = payload.substring(0, nextIdx)
                + EATEN_PROGRESS
                + (nextIdx + 1 == payload.lenght ? '' : payload.substring(nextIdx+1))
            setPayload(newPayload)
        }, 100)
    }

    if (payload.startsWith(EATEN_PROGRESS)) startEating()

    return (
        <div className="row">
            <div className="row">
                <div className="col-6">{props.item.dishName}</div>
                <div className="col-6">{props.item.comment}</div>
            </div>
            <div className="row">
                <div className="col-10">{payload}</div>
                <button class="col-2" disabled={payload.startsWith(EATEN_PROGRESS)} onClick={startEating}>eat</button>
            </div>
        </div>
    )
}

function nextPayloadIndex(payload: string): number {
    let idx = 0
    while (payload[idx] == EATEN_PROGRESS && idx < payload.length) {
        idx++
    }
    return idx >= payload.length ? -1 : idx
}
