import {Attributes, Component, ComponentChild, ComponentChildren, Ref} from "preact";
import {Client} from "../model/model";
import {managerService} from "../services/managerService";

class ClientComponentState {
    client: Client
}

export class ClientComponent extends Component<ClientComponentState, any> {
    constructor(props) {
        super(props);
        this.state = {
            client: props.client ? this.props.client : new Client("Dima")
        }
    }

    enterRestaurant = () => {
        managerService.enterRestaurant(this.state.client.name)
            .then(result => {
                console.log(result)
                this.state.client.id = result.clientId
                this.state.client.tableNumber = result.tableNumber
                this.setState(this.state.client)
            }).catch(error => {
                console.error(`can't enterRestaurant because ${error}`)
            })
    }

    render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
        return (
            <div class="clientDiv">
                <ul>
                    <li>id: {props.client.id}</li>
                    <li>name: {props.client.name}</li>
                    <li>table: {props.client.tableNumber}</li>
                    <li>items: {props.client.orderedItems}</li>
                </ul>
                <button onClick={this.enterRestaurant}>enter restaurant</button>
            </div>
        )
    }
}