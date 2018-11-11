
// ROUTE FUNCTION
function route(page) {
    // check whether the user is logged in
    if (!sessionStorage.current_user)
    {
        window.location.href = "index.html";
    }
    
    if(JSON.parse(sessionStorage.current_user).role=="attendant")
    {
        // whitelist pages for the attendant
        switch (page) {
            case "cart":
                window.location.href = "cart.html";
                break;
            case "products":
                window.location.href = "products.html";
                break;
            case "mysales":
                window.location.href = "mysales.html";
                break;
            default:
                window.location.href = "cart.html";
                break;
        }
    }
    else if(JSON.parse(sessionStorage.current_user).role=="admin")
    {
        console.log(page);
        // whitelist pages for the admin
        switch (page) {
            case "addproduct":
                window.location.href = "addproduct.html";
                break;
            case "adminsales":
                window.location.href = "adminsales.html";
                break;
            case "editproduct":
                window.location.href = "editproduct.html";
                break;
            case "products":
                window.location.href = "products.html";
                break;
            case "register":
                window.location.href = "register.html";
                break;
            default:
                window.location.href = "dashboard.html";
                break;
        }
    }
    else{
        alert("Role  Does not exist");
    }

}