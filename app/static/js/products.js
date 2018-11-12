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
            console.log(product_item)
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
                td.innerHTML=`  <i id="${product['product_id']}" onclick="showProductPane(this)" class="fas fa-eye"></i>`;
                td.className="text-green";
                appendNode(tr,td);

            }
            if (JSON.parse(sessionStorage.current_user).role == "admin"){
                td = createNode('td')
                td.innerHTML=`  <i onclick="showProductPane()" class="fas fa-eye"></i>`;
                td.className="text-green";
                appendNode(tr,td);

                // add an edit button
                td = createNode('td')
                td.innerHTML=`  <i class="fas fa-edit"></i>`;
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