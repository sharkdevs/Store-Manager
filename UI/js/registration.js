window.onload=function(){
    if(JSON.parse(sessionStorage.current_user).role!="admin"){
        window.location.href='cart.html';        
    }
    else{
        document.getElementById('user-name').innerHTML = JSON.parse(sessionStorage.current_user).email;
    }
}
function addAttendant() {
    console.log(JSON.parse(sessionStorage.current_user))
    
}

