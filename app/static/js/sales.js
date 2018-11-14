// Initialize variables

var products_url = 'https://shark-store-v2.herokuapp.com/api/v2/products';
var header = new Headers({
    "content-type": "application/json",
    "authorization":"Bearer "+JSON.parse(sessionStorage.current_user).auth_token

});
var div_container = document.getElementById('cart-inventory-items');
var product_item = {};
function createNode(node) {
    return document.createElement(node);
}

// append a node
function appendNode(parent,child) {
    return parent.appendChild(child);
}


function loadProducts() {
    var init = {
        method : 'GET',
        headers : header
    };

    req = new Request(products_url,init);

    var status = "";
    

    fetch(req)
    .then((res)=>{
        console.log(res);
        status = res.status
        return res.json();
    })
    .then((data)=>{
        if (status==401){
            window.location.href = "index.html";
        }
        console.log(data['products in stock']);

        data['products in stock'].forEach(product => {
            console.log(product['product_name']);

            // save the queried data in a list for ease of retrieving

            product_item[product['product_id']] = {
                "product_image":product['product_image'],
                "product_name":product['product_name'],
                "description":product['description'],
                "product_price":product['product_price'],
                "quantity":product['quantity']
            };

            div = createNode('div');
            div.setAttribute("class", "crt-inv-item");
            div.setAttribute("id", ""+product['product_id']);
            div.onclick= getClickedItem;     
            console.log(div);

            
            div.innerHTML = `
                <span id="inventory-product-id" hidden="true">${product['product_id']}</span>
                <div class="crt-inv-item-img"><img src="${product['product_image']}" alt="Product"></div>
                <div class="crt-inv-item-desc" id="item-desc" ><p class="item-title">${product['product_name']}<br> </p>
                    <div class="pricing">
                        <span class="item-price">Ksh ${product['product_price']}</span>
                        <span class="quantity">${product['quantity']}</span>
                    </div>
                </div>
            `;  
            
            appendNode(div_container,div);
        });

    })
    .catch((Error)=>{
        console.log(Error);
    });
}


// this function gets the specific item clicked and inserts it in the cart
function getClickedItem(){

    var id = this.querySelector("#inventory-product-id").innerText;

    console.log(id);
    parentContainer = document.querySelector('#cart-list-of-items');
    
    
    // add an item if not in the store
    if(!parentContainer.querySelector(".in-the-cart")){

        document.getElementById("cart-added-items").insertAdjacentHTML(
            "afterend",
            `<div id="${id}" class="in-the-cart">
                <span class="name">${product_item[id].product_name}</span>
                <span class="price">${product_item[id].product_price}</span>
                <input type="number" value="1" min=1 max=${product_item[id].quantity} id="purchase-quantity" />
                <i id="remove-item" class=" text-red fas fa-trash" onclick="removeProduct(this)"></i>
            </div>`
        );
    }
    added_items = parentContainer.querySelectorAll('.in-the-cart');
    in_cart = false; 

    added_items.forEach(cart_item => {
       
        if(cart_item.querySelector('.name').innerText==product_item[id].product_name)
        { 
            in_cart = true;
        }
    });


    if(in_cart == true)
    {   
        quantity_box = parentContainer.querySelector("[id='"+id+"']").querySelector('#purchase-quantity');
        console.log(quantity_box.value);
        if(parseInt(quantity_box.value)< product_item[id].quantity) {
            quantity_box.value = parseInt(quantity_box.value) +1;
        }
        
    }
    else{
        document.getElementById("cart-added-items").insertAdjacentHTML(
            "afterend",
            `<div id="${id}" class="in-the-cart">
                <span class="name">${product_item[id].product_name}</span>
                <span class="price">${product_item[id].product_price}</span>
                <input type="number" value="1" min=1 max=${product_item[id].quantity} id="purchase-quantity" />
                <i id="remove-item" class=" text-red fas fa-trash" onclick="removeProduct(this)"></i>
            </div>`
        );
    }
     
    
    total = calculateTotal();
   
    document.getElementById("total-display").innerHTML="Ksh "+total;
    document.getElementById("cart-items-num").innerHTML=getItemsInCart().length;
}
function calculateTotal() {
    total = 0;
    added_items.forEach(item => {
        var num_items = parseInt(item.querySelector('#purchase-quantity').value);
        var price =  parseInt(item.querySelector('.price').innerText);
        subtotal = num_items * price;
        total = total + subtotal;
    });
    return total;
}
function removeProduct($this) {
    $this.parentElement.parentElement.removeChild($this.parentElement);
    total = calculateTotal();
    document.getElementById("total-display").innerHTML="Ksh " + total; 

}
function getItemsInCart(){
    return document.getElementsByClassName("in-the-cart");
}


// Perform actual sales
