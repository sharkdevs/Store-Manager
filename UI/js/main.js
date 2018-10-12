// js function to open the side navbar

function openSideBar(){
    document.getElementById("left-nav").style.width="80px";
    document.getElementById("main").style.marginLeft="80px";

}
function closeSideNav(){
    document.getElementById("left-nav").style.width="0";
    document.getElementById("main").style.marginLeft="0";
}

// add a function to enable search of a product

function searchInventory(){
    // get the values being inserted in the searchbox and store them in a variable
    var keywords=document.getElementById("search-box").value.toLowerCase();

    // identify the element containers t be displayed if search text is found
    var items=document.getElementsByClassName("crt-inv-item");

    // iterate through the array of items searching for the keywords

    for(i=0;i<items.length;i++){
        if(items[i].innerText.toLowerCase().includes(keywords)){
            // sho the ones that contain keywords.
            items[i].style.display="block";
        }
        else{
            // hide those that dont contain the keywords
            items[i].style.display="none";
        }
    }
}

// successful payment alert.
function alertPayment(){
    alert("Thanks for allowing us to serve you. Bye");
}

// this function gets the specific item clicked and inserts it in the cart
function getClickedItem($this){
    var itemName=$this.querySelector(".item-title").innerText;
    var price=$this.querySelector(".item-price").innerText;
    var available=$this.querySelector(".quantity").innerText;

    
    document.getElementById("cart-added-items").insertAdjacentHTML(
        "afterend",
        '<div class="in-the-cart"> <span class="name">'+itemName+'</span><span class="price">'+price+'</span></div>'
        

    );
    document.getElementById("cart-items-num").innerHTML=getItemsInCart().length;
}

function getItemsInCart(){
    return document.getElementsByClassName("in-the-cart");
}

// function to open product description view
function showProductPane(){
    document.getElementById("product-pane").style.width="400px";
}
// function to close the pane
function closeProductPane(){
    document.getElementById("product-pane").style.width="0px";
}

// function to to filter by attendant
function filterByAttendant(){
    // get the value of the filter box
    var filter=document.getElementById("filter-attendant").value.toLowerCase();

    // identify the element containers t be displayed if search text is found
    var products=document.getElementsByClassName("tbl-product-row");

    // iterate through the array of products searching for the keywords

    for(i=0;i<products.length;i++){
        if(products[i].innerText.toLowerCase().includes(filter)){
            // show the ones that contain keywords.
            products[i].style.display="block";
        }
        else{
            // hide those that dont contain the keywords
            products[i].style.display="none";
        }
    }
}