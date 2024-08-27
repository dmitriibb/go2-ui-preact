
const go2ManagerUrl = "localhost:9010"

export function callManagerHelloWorld() {
    return fetch(`http://${go2ManagerUrl}/`)
        .then(res => res.text())
}