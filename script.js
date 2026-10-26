// ===============================
// LOCAL STORAGE
// ===============================

let users = JSON.parse(localStorage.getItem("users")) || [];
let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
let foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;


// ===============================
// UPDATE DASHBOARD COUNTERS
// ===============================

function updateCounters() {

    
    lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
    foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
    users = JSON.parse(localStorage.getItem("users")) || [];

    document.getElementById("lostCount").innerText = lostItems.length;
    document.getElementById("foundCount").innerText = foundItems.length;
    document.getElementById("userCount").innerText = users.length;
}


// ===============================
// REGISTER
// ===============================

document.getElementById("registerForm").addEventListener("submit",function(e){

e.preventDefault();

let name=document.getElementById("regName").value;

let email=document.getElementById("regEmail").value;

let password=document.getElementById("regPassword").value;

let exist=users.find(function(user){

return user.email===email;

});

if(exist){

alert("Email Already Registered");

return;

}

let user={

id:Date.now(),

name:name,

email:email,

password:password

};

users.push(user);

localStorage.setItem("users",JSON.stringify(users));

alert("Registration Successful");

document.getElementById("registerForm").reset();

closeRegister();

updateCounters();

});


// ===============================
// LOGIN
// ===============================

document.getElementById("loginForm").addEventListener("submit",function(e){

e.preventDefault();

let email=document.getElementById("loginEmail").value;

let password=document.getElementById("loginPassword").value;

let user=users.find(function(u){

return u.email===email && u.password===password;

});

if(user){

currentUser=user;

localStorage.setItem("currentUser",JSON.stringify(user));

alert("Welcome "+user.name);

document.getElementById("loginForm").reset();

closeLogin();
updateNavbar();
renderItems();

}

else{

alert("Invalid Email or Password");

}

});


// ===============================
// LOGIN MODAL
// ===============================

function openLogin(){

document.getElementById("loginModal").style.display="flex";

}

function closeLogin(){

document.getElementById("loginModal").style.display="none";

}


// ===============================
// REGISTER MODAL
// ===============================

function openRegister(){

document.getElementById("registerModal").style.display="flex";

}

function closeRegister(){

document.getElementById("registerModal").style.display="none";

}


// ===============================
// SHOW LOST FORM
// ===============================

function showLostForm(){

document.getElementById("reportLost").scrollIntoView({

behavior:"smooth"

});

}


// ===============================
// SHOW FOUND FORM
// ===============================

function showFoundForm(){

document.getElementById("reportFound").scrollIntoView({

behavior:"smooth"

});

}


// ===============================
// LOGOUT
// ===============================

function logout(){

    localStorage.removeItem("currentUser");

    currentUser = null;

    alert("Logout Successful");

    updateNavbar();

    renderItems();

}

// ===============================
// CLOSE MODAL ON OUTSIDE CLICK
// ===============================

window.onclick=function(event){

let login=document.getElementById("loginModal");

let register=document.getElementById("registerModal");

if(event.target==login){

closeLogin();

}

if(event.target==register){

closeRegister();

}

};

// ===============================
// PART-1 END
// ===============================
// ===============================
// REPORT LOST ITEM
// ===============================
document.getElementById("lostForm").addEventListener("submit", function(e){

    e.preventDefault();

    if(!currentUser){
        alert("Please Login First");
        return;
    }

    let file = document.getElementById("lostImage").files[0];

    let item = {

        id: Date.now(),
        type: "Lost",
        name: document.getElementById("lostName").value,
        category: document.getElementById("lostCategory").value,
        location: document.getElementById("lostLocation").value,
        date: document.getElementById("lostDate").value,
        description: document.getElementById("lostDescription").value,
        owner: currentUser.email,
        claimed: false,
        claimedBy: null,
        claimedByName: null,
        image: ""

    };

    if(file){

        let reader = new FileReader();

        reader.onload = function(e){

            item.image = e.target.result;

            lostItems.push(item);

            localStorage.setItem("lostItems", JSON.stringify(lostItems));

            document.getElementById("lostForm").reset();

            updateCounters();

            renderItems();

            alert("Lost Item Reported Successfully");

        };

        reader.readAsDataURL(file);

    }else{

        lostItems.push(item);

        localStorage.setItem("lostItems", JSON.stringify(lostItems));

        document.getElementById("lostForm").reset();

        updateCounters();

        renderItems();

        alert("Lost Item Reported Successfully");

    }

});




// ===============================
// REPORT FOUND ITEM
// ===============================
document.getElementById("foundForm").addEventListener("submit", function (e) {

    e.preventDefault();

    if (!currentUser) {
        alert("Please Login First");
        return;
    }

    let file = document.getElementById("foundImage").files[0];

    let item = {
        id: Date.now(),
        type: "Found",
        name: document.getElementById("foundName").value,
        category: document.getElementById("foundCategory").value,
        location: document.getElementById("foundLocation").value,
        date: document.getElementById("foundDate").value,
        description: document.getElementById("foundDescription").value,
        owner: currentUser.email,
        claimed: false,
        claimedBy: null,
        claimedByName: null,
        image: ""
    };

    if (file) {

        let reader = new FileReader();

        reader.onload = function (e) {

            item.image = e.target.result;

            foundItems.push(item);
            localStorage.setItem("foundItems", JSON.stringify(foundItems));

            document.getElementById("foundForm").reset();
            updateCounters();
            renderItems();

            alert("Found Item Reported Successfully");
        };

        reader.readAsDataURL(file);

    } else {

        foundItems.push(item);
        localStorage.setItem("foundItems", JSON.stringify(foundItems));

        document.getElementById("foundForm").reset();
        updateCounters();
        renderItems();

        alert("Found Item Reported Successfully");
    }

});



// ===============================
// SHOW ITEMS
// ===============================
function renderItems() {

    let container = document.getElementById("itemsContainer");

    container.innerHTML = "";

    let allItems = [...lostItems, ...foundItems];

    allItems.forEach(function(item){

        container.innerHTML += `
        <div class="item-card" data-name="${item.name.toLowerCase()}">

            <h3>${item.name}</h3>

            <p><b>Type :</b> ${item.type}</p>

            <p><b>Category :</b> ${item.category}</p>

            <p><b>Location :</b> ${item.location}</p>

            <p><b>Date :</b> ${item.date}</p>

            <p>${item.description}</p>

            ${item.image ?
            `
            <img src="${item.image}"
            style="
                width:100%;
                height:220px;
                object-fit:cover;
                border-radius:10px;
                margin-top:10px;
            ">
            `
            : ""}

            <p><b>Status :</b> ${item.claimed ? "✅ Claimed" : "🟢 Available"}</p>

            ${item.claimed ?
            `
            <p><b>Claimed By :</b> ${item.claimedByName || "-"}</p>
            <p><b>Email :</b> ${item.claimedBy || "-"}</p>
            `
            : ""}

            ${
                item.type === "Found"

                ?

                (
                    item.claimed

                    ?

                    `<button disabled style="background:green;cursor:not-allowed;">
                        ✅ Item Claimed
                    </button>`

                    :

                    `<button onclick="claimItem(${item.id})">
                        Claim Item
                    </button>`
                )

                :

                (
                    currentUser && currentUser.email === item.owner

                    ?

                    `<button onclick="deleteItem(${item.id},'${item.type}')">
                        Delete
                    </button>`

                    :

                    ""
                )
            }

        </div>
        `;

    });

    renderMyReports();

}


// ===============================
// MY REPORTS
// ===============================

function renderMyReports() {

    let container = document.getElementById("myReports");

    container.innerHTML = "";

    if (!currentUser) return;

    let myItems = [...lostItems, ...foundItems].filter(function (item) {

        return item.owner == currentUser.email;

    });

    myItems.forEach(function (item) {

        container.innerHTML += `

        <div class="item-card">

            <h3>${item.name}</h3>

            <p>${item.type}</p>

            <p>${item.location}</p>

            <button onclick="deleteItem(${item.id},'${item.type}')">

                Delete

            </button>

        </div>

        `;

    });

}


// ===============================
// DELETE ITEM
// ===============================
function deleteItem(id, type) {

    if(type == "Lost"){

        let item = lostItems.find(i => i.id == id);

        if(!item) return;

        if(!currentUser || currentUser.email !== item.owner){
            alert("You can delete only your own report.");
            return;
        }

        lostItems = lostItems.filter(i => i.id != id);

        localStorage.setItem("lostItems", JSON.stringify(lostItems));

    }
    else{

        let item = foundItems.find(i => i.id == id);

        if(!item) return;

        if(!currentUser || currentUser.email !== item.owner){
            alert("You can delete only your own report.");
            return;
        }

        foundItems = foundItems.filter(i => i.id != id);

        localStorage.setItem("foundItems", JSON.stringify(foundItems));

    }

    updateCounters();

    renderItems();

}
// ===============================
// CLAIM ITEM
// ===============================

function claimItem(id){

    if(!currentUser){
        alert("Please Login First");
        return;
    }

    let foundItem = foundItems.find(item => item.id == id);

    if(!foundItem){
        return;
    }

    if(foundItem.claimed){
        alert("This item is already claimed.");
        return;
    }

    if(!confirm("Are you sure you want to claim this item?")){
        return;
    }

    // Found Item Update
    foundItem.claimed = true;
    foundItem.claimedBy = currentUser.email;
    foundItem.claimedByName = currentUser.name;

    // Matching Lost Item Update
    let lostItem = lostItems.find(function(item){

        return item.name.toLowerCase() === foundItem.name.toLowerCase();

    });

    if(lostItem){

        lostItem.claimed = true;
        lostItem.claimedBy = currentUser.email;
        lostItem.claimedByName = currentUser.name;

    }

    localStorage.setItem("foundItems", JSON.stringify(foundItems));
    localStorage.setItem("lostItems", JSON.stringify(lostItems));

    alert("Item Claimed Successfully");

    renderItems();
}

// close register 
function updateNavbar(){

    let loginNav = document.getElementById("loginNav");
    let registerNav = document.getElementById("registerNav");
    let logoutNav = document.getElementById("logoutNav");

    if(currentUser){

        loginNav.style.display = "none";
        registerNav.style.display = "none";
        logoutNav.style.display = "block";

    }else{

        loginNav.style.display = "block";
        registerNav.style.display = "block";
        logoutNav.style.display = "none";

    }

}

// ===============================
// SEARCH ITEM
// ===============================

function searchItem() {

    let text = document.getElementById("searchInput").value.toLowerCase().trim();

    let cards = document.querySelectorAll("#itemsContainer .item-card");

    let found = false;

    cards.forEach(function(card){

        let name = card.getAttribute("data-name");

        if(name.includes(text)){

            card.style.display = "block";
            found = true;

        }else{

            card.style.display = "none";

        }

    });

    let msg = document.getElementById("notFoundMessage");

    if(found || text === ""){

        msg.style.display = "none";

    }else{

        msg.style.display = "block";

    }

}

// ===============================
// LOAD DATA
// ===============================

renderItems();
updateCounters();
updateNavbar();
