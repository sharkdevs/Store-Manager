import {route} from 'routes.js';

document.getElementById('user-name').innerHTML = JSON.parse(sessionStorage.current_user).email;

function addAttendant() {
    console.log(JSON.parse(sessionStorage.current_user))
    
}

