/*
*Helper Functions to process the data abd feed fetch
*
*/

function processLogin() {

    document.getElementById('login').style.backgroundColor="#0aacad"; 
    displayLoading();
    

    
    // Define variables for use in the app
    let url = 'https://shark-store-v2.herokuapp.com/api/v2/auth/login';

    let login_data = getLoginInputs();

    let header = new Headers({
        "content-type": "application/json"
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

        let output = '<h2>Hello login</h2>';
        output += JSON.stringify(data);
        document.getElementById("message").innerHTML=data.message;

        if(data.auth_token){
            displayMessage(data,"success");
            // pass auth headers to the respective page
            console.log(data.auth_token);
            current_user = {'auth_token':data.auth_token,'email':login_data.email};
            sessionStorage.current_user =  JSON.stringify(current_user);
            console.log(sessionStorage.current_user);

            header2 = new Headers({
                'authorization' : 'Bearer ' + data.auth_token
            });
            redInit = {
                method : 'POST',
                headers : header2
            };

            url_sales = 'https://shark-store-v2.herokuapp.com/api/v2/sales';
            req = new Request(url_sales,redInit);
            let status_code = "";
            fetch(req)
            .then((res)=>{
                status_code = res.status;
                return res.json();
            })
            .then((data)=>{
                console.log(data.status);

                if(status_code===401){
                    // set a session role when the user logs in
                    current_user['role'] = "admin";
                    sessionStorage.current_user =  JSON.stringify(current_user);

                    window.location.replace('dashboard.html');
                }
                else{
                    // set a session role when the user logs in
                    current_user['role'] = "attendant";
                    sessionStorage.current_user =  JSON.stringify(current_user);

                    window.location.replace('cart.html');
                }
            })
            
        }
        else{
            displayMessage(data,"danger")
        }
    })
    .catch((error) =>{
        console.log(error);
    });
}
// function to display response messages
function displayMessage(data,type) {
    res_message = document.getElementById('message');
    res_message.className = type;
    res_message.innerHTML = data.message;
    res_message.style.visibility = 'visible';
    setTimeout(() => {
        res_message.style.visibility = 'hidden';
    }, 3000);
}

function displayLoading(){
    msf = document.getElementById('message');
    msf.style.visibility = "visible";
    msf.className = "loading";
    msf.innerHTML = "Loading...";
}

// function to get the input data fro,m the login form
function getLoginInputs() {
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;

    return {email: email,password:password};
}