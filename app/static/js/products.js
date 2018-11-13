var products_url = 'https://shark-store-v2.herokuapp.com/api/v2/products';
var header = new Headers({
    "content-type": "application/json",
    "authorization":"Bearer "+JSON.parse(sessionStorage.current_user).auth_token

});

// a disctionary to store queried products locally
let  product_item = {} ;


function createProduct() {
    var init = {
        method : 'POST',
        body : JSON.stringify(getProductData()),
        headers : header
    
    };
    var status = "";
    req = new Request(products_url, init)
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


// GET ALL PRODUCTS

function createNode(node) {
    return document.createElement(node);
}

// append a node
function appendNode(parent,child) {
    return parent.appendChild(child);
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

// get the products in the store
function getProducts() {
    var init = {
        method : 'GET',
        headers : header
    
    };

    req = new Request(products_url,init)

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

        rowNum = 1; //the row id
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
            products_table = document.getElementById('tbl-products')
            let tr = createNode('tr'),
                td = createNode('td');

            // table data
            t_data=[
                rowNum,product['product_name'],
                product['quantity'],
                product['product_price']
            ];
            tr = addTableData(tr,td,t_data);
            console.log(tr);

            // add the view edit and delete buttons
            if (JSON.parse(sessionStorage.current_user).role == "attendant"){
                td = createNode('td')
                td.innerHTML=`  <i id="${product['product_id']}" onclick="showProductPane(this)" class="fas fa-eye"> </i>`;
                td.className="text-green";
                appendNode(tr,td);

            }
            if (JSON.parse(sessionStorage.current_user).role == "admin"){
                td = createNode('td')
                td.innerHTML=`  <i id="${product['product_id']}" onclick="showProductPane(this)" class="fas fa-eye"></i>`;
                td.className="text-green";
                appendNode(tr,td);

                // add an edit button
                td = createNode('td')
                td.innerHTML=`  <i class="fas fa-edit" onclick="editProduct(${product['product_id']})"></i>`;
                td.className="text-warn";
                appendNode(tr,td);

                // add delete button
                td = createNode('td')
                td.innerHTML=`  <i class="fas fa-trash"></i>`;
                td.className="text-red";
                appendNode(tr,td);


            }

            appendNode(products_table,tr);
            rowNum +=1
        });

    })
}

// function to open product description view
function showProductPane($this){
    id = $this.id
    image = product_item[id].product_image;
    desc = product_item[id].description;
    price = product_item[id].product_price;
    quantity = product_item[id].quantity;
    pname = product_item[id].product_name;
    
    side_product = `
        <span class="close"><a onclick="closeProductPane()" href="#">&times;</a></span>
        <div class="detail-image"><img src="${image}" alt="product"></div>
        <div class="padding-lr-40 detail-name"><h3>${pname}</h3></div>
        
        <div class="padding-lr-40 detail-quantities">
            <h3 class="detail-in-store">In stock: ${quantity}</h3>
            <h3 class="detail-price orange">Ksh ${price}</h3>
        </div>
        <div class="detail-desc padding-lr-40">
            <p>${desc}</p>
        </div>
        <div class="padding-lr-40 detail-buttons"><button class="btn btn-blue"><a href="cart.html">Sale Product</a></button>
        <button class="btn">
            <a href="#"  onclick="editProduct(${id})">
                <i class=" text-green fas fa-edit"></i> Edit product
            </a>
        </button>
        <button onclick="confirmDelete()" class=" btn "><i class=" text-red fas fa-trash-alt" onclick="confirmDelete()"></i> Delete</button></div>
    `;
    document.getElementById("product-pane").innerHTML = side_product;
    document.getElementById("product-pane").style.width="400px";


}
// function to close the pane
function closeProductPane(){
    document.getElementById("product-pane").style.width="0px";
}


// EDIT A PRODUCT
function editProduct(id){
    url = products_url+"/"+id;
    var init = {
        method : 'GET',
        headers : header
    };

    req = new Request(url,init);
    status = ""
    fetch(req)
    .then((res)=>{
        console.log(res);
        status = res.status;
        return res.json();
    })
    .then((data)=>{
        console.log(data);
        if (status==200){
            sessionStorage.queried_product = JSON.stringify(data.product);

            console.log(sessionStorage.queried_product);

            // route to the edit page
            window.location.href = "editproduct.html";
        }
        else if(status==401){
            window.location.href = "index.html";
        }
        else{
            alert("There was a problem getting the product to edit. Try again Later");
        }
        
    })
    .catch((Error)=>{
        console.log(Error);
    });
}

// a function to fill in product data to the fields in edi product page
function populateFields() {
    
        field_data = JSON.parse(sessionStorage.queried_product);
        console.log(field_data);
        
        getElement('product_id').value = field_data.product_id;
        getElement('pname').value = field_data.product_name;
        getElement('Number').value = field_data.quantity;
        getElement('price').value = field_data.product_price;
        getElement('image').value = field_data.product_image;
        getElement('description').innerText = field_data.description;

        //clear the data
        sessionStorage.queried_product="";
        console.log(sessionStorage.queried_product);
  

}

//Update the database details
function updateProduct() {

    id = getElement('product_id').value
    console.log("Successfully got the id "+id);
    console.log("Successfully got the data ");

    
    url = products_url+"/"+id;

    var init = {
        method : 'PUT',
        body : JSON.stringify(getEditData()),
        headers : header
    };

    req = new Request(url,init);
    status = ""
    fetch(req)
    .then((res)=>{
        console.log(res);
        status = res.status;
        return res.json();
    })
    .then((data)=>{
        console.log(data);
        if (status==201){

            console.log(data);
            getElement('message').innerHTML = data.message;

            window.location.href = "products.html";

        }
        else if(status == 401){
            alert("Not Authorized to edit a product");
            window.location.href = "index.html";

        }
        else{
            getElement('message').innerHTML = data.message;
        }
        
    })
    .catch((Error)=>{
        console.log(Error);
    });
}
function getEditData() {
    pid =  getElement('product_id').value;
    pname = getElement('pname').value ;
    quant = getElement('Number').value;
    price = getElement('price').value ; 
    image = getElement('image').value ;
    desc = getElement('description').value;
    data = {
        product_name:pname,
        product_price:price,
        product_image:image,
        quantity:quant,
        description:desc};
    console.log(data);
    return data;
}