import {Attributes, Component, ComponentChild, ComponentChildren, Ref} from "preact";
import {callManagerHelloWorld} from "../services/restApiService";


export class TestApi extends Component {
    state = {
        label: 'no data'
    }

    callTestApi = () => {
        callManagerHelloWorld().then(res => {
            this.setState({label: res})
        }).catch(error => {
            this.setState({label: `error: ${error}`})
        })
    }

    render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
        return (
            <div class="col-12" style={{backgroundColor: 'green'}}>
                {this.state.label}
                <br/><button onClick={this.callTestApi}>test API</button>
            </div>
        )
    }
}