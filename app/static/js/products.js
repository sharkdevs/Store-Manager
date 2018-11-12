var add_ul = 'https://shark-store-v2.herokuapp.com/api/v2/products';
var header = new Headers({
    "content-type": "application/json",
    "authorization":"Bearer "+JSON.parse(sessionStorage.current_user).auth_token

});


function createProduct() {
    console.log("helo")
    var init = {
        method : 'POST',
        body : JSON.stringify(getProductData()),
        headers : header
    
    };
    var status = "";
    req = new Request(add_ul, init)
    console.log("Here is data"+JSON.stringify(getProductData()));
    fetch(req)
    .then((res)=>{
        console.log(res);
        status = res.status;
        return res.json();
    })
    .then((data)=>{
        console.log(data);
        if (status==401){
            window.location.href = "index.html";
        }

        getElement('message').innerHTML=data.message;
    })
    .catch((Error)=>{
        console.log(Error);
    });
}


// function to get product data
function getProductData(){
    pname = getElement('product_name').value;
    price = getElement('product_price').value;
    quant = getElement('quantity').value;
    image = getElement('product_image').value;
    desc = getElement('description').value; 
    data = {product_name:pname,product_price:price,product_image:image,quantity:quant,description:desc}
    console.log(data);
    return data;

}
function getElement(id) {
    return(document.getElementById(id));
}