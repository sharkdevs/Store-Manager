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