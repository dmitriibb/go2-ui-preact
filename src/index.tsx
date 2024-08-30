import { render } from 'preact';

import preactLogo from './assets/preact.svg';
import './style.css';
import {MyTestDiv1} from "./components/MyTestDivs";
import 'bootstrap/dist/css/bootstrap.min.css';
import {TestApi} from "./components/TestApi";
import {ClientComponent} from "./components/Client";
import {Client} from "./model/model";
import {useState} from "preact/hooks";

export function App() {
	const [clients, setClients] = useState([new Client("Dima")])
	const [clientName, setClientName] = useState('')

	const addClient = () => {
		clients.push(new Client(clientName))
		setClients(clients)
		setClientName("")
	}

	return (
		<div className="container">
			<div className="row">
				<MyTestDiv1 color="myDivGreen" content="123"/>
				<MyTestDiv1 color="myDivYellow" content="wwwww"/>
				<MyTestDiv1 color="myDivBlue" content="--66--"/>
			</div>
			<div className="row">
				<TestApi/>
			</div>
			<div class="row">
				client name:
				<input class="col-5" style={{marginLeft: '5px'}} type="text" value={clientName} onInput={evt => setClientName(evt.currentTarget.value)}/>
				<button class="col-3" style={{marginLeft: '5em'}} disabled={!clientName.length} onClick={addClient} placeholder="client name">add client</button>
			</div>
			{clients.map(client => {
				return (<div class="row">
					<ClientComponent client={client}/>
				</div>)
			})}
		</div>
	);
}

function Resource(props) {
	return (
		<a href={props.href} target="_blank" class="resource">
			<h2>{props.title}</h2>
			<p>{props.description}</p>
		</a>
	);
}

render(<App />, document.getElementById('app'));
