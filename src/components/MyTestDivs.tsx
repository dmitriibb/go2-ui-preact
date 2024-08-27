import 'bootstrap/dist/css/bootstrap.min.css';

export function MyTestDiv1(props) {

    return (
        <div class="col-3">
            <div class={props.color}>{props.content}</div>
        </div>
    )
}