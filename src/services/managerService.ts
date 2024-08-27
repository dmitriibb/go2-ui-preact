import { EnterRestaurantResponse } from "../model/model"

const go2ManagerUrl = "localhost:9010"

class ManagerService {
    enterRestaurant(clientName: string, clientId: string = null): Promise<EnterRestaurantResponse> {
        const body = {
            clientName: clientName,
            clientId: clientId
        }
        return fetch(`http://${go2ManagerUrl}/hostes/enter`, {
            method: 'POST',
            // mode: 'no-cors',
            headers: {
                // someone (go server) don't like content-type application/json and Chrome fails with CORS error
                // 'Content-Type': 'application/json; charset=UTF-8',
                'Content-Type': 'text/plain; charset=UTF-8',
                // 'Origin': 'http://localhost:5173',
                // 'Accept': '*/*',
                // 'Host': go2ManagerUrl
                // 'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
            .then(res => Object.assign(new EnterRestaurantResponse, res))
        // .then(response => response.json())
        // .then(data => console.log(data))
        // .catch(error => console.error('Error:', error));
    }
}

export const managerService = new ManagerService()
