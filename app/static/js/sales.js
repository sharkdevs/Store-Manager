// Initialize variables
if (!sessionStorage.current_user) {
    window.location.href = "index.html";
}
else{
    var products_url = 'https://shark-store-v2.herokuapp.com/api/v2/products';
    var sales_url = 'https://shark-store-v2.herokuapp.com/api/v2/sales';
    var header = new Headers({
        "content-type": "application/json",
        "authorization":"Bearer "+JSON.parse(sessionStorage.current_user).auth_token

    });
    var div_container = document.getElementById('cart-inventory-items');
    var product_item = {};
    var added_to_cart = "";
    var sales_record = {};

    sales_table = document.getElementById('tbl-products');

}


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

            // check product quantity
            if(product['quantity']>0){
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
            }
            
        });

    })
    .catch((Error)=>{
        console.log(Error);
    });
}

function validateQuantity($this) {
    
    if (parseInt($this.value) > $this.max) {
        $this.value = $this.max;
    }
    if($this.value<=0){
        $this.value = 1;
    }
}
// this function gets the specific item clicked and inserts it in the cart
function getClickedItem(){

    var id = this.querySelector("#inventory-product-id").innerText;

    parentContainer = document.querySelector('#cart-list-of-items');
    
    
    // add an item if not in the cart
    if(!parentContainer.querySelector(".in-the-cart")){

        document.getElementById("cart-added-items").insertAdjacentHTML(
            "afterend",
            `<div id="${id}" class="in-the-cart">
                <span class="name">${product_item[id].product_name}</span>
                <span class="price">${product_item[id].product_price}</span>
                <input type="number" value="1" min=1 max=${product_item[id].quantity} id="purchase-quantity" onkeyup="validateQuantity(this)"/>
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
                <input type="number" value="1" min=1 max=${product_item[id].quantity} id="purchase-quantity" onkeyup="validateQuantity(this)"/>
                <i id="remove-item" class=" text-red fas fa-trash" onclick="removeProduct(this)"></i>
            </div>`
        );
    }
     
    
    total = calculateTotal()['total'];
    added_to_cart = calculateTotal()['totals'];
    added_to_cart.forEach(element => {
        console.log("Hello"+element.product_id);
    });
   
    document.getElementById("total-display").innerHTML="Ksh "+total;
    document.getElementById("cart-items-num").innerHTML=getItemsInCart().length;
}

function calculateTotal() {
    total = 0;
    totals = []

    added_items.forEach(item => {
        var num_items = parseInt(item.querySelector('#purchase-quantity').value);
        var price =  parseInt(item.querySelector('.price').innerText);
        subtotal = num_items * price;
        total = total + subtotal;
        totals.push({"product_id":item.id,"quantity":num_items});

    });
    console.log(totals)
    return {"total":total,"totals":totals};
}
function removeProduct($this) {
    $this.parentElement.parentElement.removeChild($this.parentElement);
    total = calculateTotal();
    document.getElementById("total-display").innerHTML="Ksh " + total; 

}
function getItemsInCart(){
    return document.getElementsByClassName("in-the-cart");
}

// invoked when sale button is clicked
function saleOrder() {
        
        added_to_cart.forEach(element => {
            id = element.product_id;
            quantity = element.quantity;

            data = {"product_id":id,"quantity":quantity};
            makeSale(data);
        });
}

// Perform actual sales
function makeSale(data) {
    var init = {
        method : 'POST',
        body : JSON.stringify(data),
        headers : header
    
    };

    var status = "";
    req = new Request(sales_url, init);
    console.log(data);


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
        if (status==201){
                message_box = document.getElementById('message');
                message_box.innerHTML=data.message;
                message_box.className = "success";
                message_box.style.visibility = 'visible';
            setTimeout(() => {
                message_box.style.visibility = 'hidden';
            }, 3000);
            
            sold_items = parentContainer.querySelectorAll('.in-the-cart');

            sold_items.forEach(item => {
                item.parentElement.removeChild(item);
            });

        }
        else{
            message_box = document.getElementById('message');
                message_box.innerHTML=data.message;
                message_box.className = "danger";
                message_box.style.visibility = 'visible';
            setTimeout(() => {
                message_box.style.visibility = 'hidden';
            }, 3000);
        }

    })
    .catch((Error)=>{
        console.log(Error);
    });
}


// Get all sales records
function getAllSales() {
    if (!sessionStorage.current_user) {
        window.location.href = "index.html";
    }
    var init = {
        method : 'GET',
        headers : header
    
    };

    req = new Request(sales_url,init)

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

        rowNum = 1; //the row id
        data['Sales Record'].forEach(sale => {

            // save the queried data in a list for ease of retrieving

            sales_record[sale['sales_id']] = {
                "user_id": sale['user_id'],
                "product_id": sale['product_id'],
                "quantity": sale['quantity'],
                "sales_amount": sale['sales_amount'],
                "sales_date": sale['sales_date']
            };
            console.log(sales_record)
            sales_table = document.getElementById('tbl-products')
            let tr = createNode('tr'),
                td = createNode('td');
                

            // table data
            t_data=[
                rowNum,sale['product_name'],
                sale['username'],
                sale['sales_date'],
                sale['sales_amount']
            ];
            console.log(t_data)

            tr = addTableData(tr,td,t_data);
            console.log(tr);


            // add the view edit and delete buttons
            td = createNode('td')
            td.innerHTML=`  <i id="${sale['sales_id']}" onclick="showProductPane(this)" class="fas fa-eye"> </i>`;
            td.className="text-green";
            appendNode(tr,td);
            console.log("here")

          
          

            appendNode(sales_table,tr);
            rowNum +=1
        });

    });
}
function addTableData(tr,td,data){
    console.log(data)
    data.forEach(dt => {
       td=createNode('td');
        td.innerHTML = `${dt}`;
        console.log(dt);
        appendNode(tr,td);
    });

    return tr
}