// import {route} from 'routes.js';


function registerUser() {
    // Define variables for use in the app
    let url = 'https://shark-store-v2.herokuapp.com/api/v2/auth/signup';

    let login_data = getSignupInputs();

    let header = new Headers({
        "content-type": "application/json",
        "authorization":"Bearer "+JSON.parse(sessionStorage.current_user).auth_token

    });

    let init = {
        method : 'POST',
        body : JSON.stringify(login_data),
        headers : header

    };

    loginRequest = new Request(url, init);

    // fetch the details required
    fetch(loginRequest)
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data);
        if(data.msg)
        {
            window.location.href = "index.html"
        }
        let output = '<h2>Message</h2>';
        output += JSON.stringify(data);
        document.getElementById("message").innerHTML=data.message;

        
    })
    .catch((error) =>{
        console.log(error);
    });
}

function getSignupInputs() {
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    role = "attendant";
    firstname = document.getElementById('firstname').value;
    lastname = document.getElementById('lastname').value;
    username = firstname +" "+lastname;


    return {username:username, role:role, email: email, password:password};
}

