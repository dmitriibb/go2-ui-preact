import { render } from 'preact';

import preactLogo from './assets/preact.svg';
import './style.css';
import {MyTestDiv1} from "./components/MyTestDivs";
import 'bootstrap/dist/css/bootstrap.min.css';
import {TestApi} from "./components/TestApi";
import {ClientComponent} from "./components/Client";
import {Client} from "./model/model";

export function App() {
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
			<div className="row">
				<ClientComponent client={new Client("Dima")}/>
			</div>
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
