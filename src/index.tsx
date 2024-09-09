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
		<div className="container-fluid">
			<div className="row">
				<TestApi/>
			</div>
			<div class="row">
				<div class="col-md-4">client name:</div>
				<input class="col-md-4" type="text" value={clientName} onInput={evt => setClientName(evt.currentTarget.value)}/>
				<button class="col-md-4" disabled={!clientName.length} onClick={addClient} placeholder="client name">add client</button>
			</div>
			<div class="row">
				{clients.map(client => {
					return (<div class="col-md-6">
						<ClientComponent client={client}/>
					</div>)
				})}
			</div>

		</div>
	);
}

render(<App />, document.getElementById('app'));
