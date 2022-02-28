//-------------------------- Start Add animal ---------------------------------------
let animalArray = [];
let selectType = "";
let selectGender = "";

// define a constructor to create animal objects with 3 parameters
let AnimalObject = function (pType, pAge, pBreed, pGender, pFee, pUrl) {
    this.ID = Math.random().toString(16).slice(5); // tiny chance could get duplicates!
    this.selectType = pType;
    this.age = pAge;
    this.breed = pBreed;
    this.selectGender = pGender;
    this.fee = pFee;
    this.url = pUrl;
}

$(document).bind("change", "#select-type", function (event, ui) {
    selectType = document.getElementById("select-type").value;
});
$(document).bind("change", "#select-gender", function (event, ui) {
    selectGender = document.getElementById("select-gender").value;
});

document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("buttonAdd").addEventListener("click", function () {

        animalArray.push(new AnimalObject(selectType, document.getElementById("age").value, 
         document.getElementById("breed").value, selectGender, document.getElementById("fee").value,
         document.getElementById("url").value));
         
        document.location.href = "index.html#list"; //Moving to the list animal page automatically after added animal 
        console.log(animalArray);

        document.getElementById("age").value = ""; //Clear current input screen
        document.getElementById("breed").value = "";
        document.getElementById("fee").value = "";
        document.getElementById("url").value = "";
    });
    // ------------------ End Add animal --------------------------------------------

    // button on detail information page to view the linked URL address
    document.getElementById("locationInformation").addEventListener("click", function () {
        window.open(document.getElementById("detailUrl").innerHTML);
    })



    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#list", function (event) {   
        createList();
    });  

});

function GetArrayPointer(localID) {
    for (let i = 0; i < animalArray.length; i++) {
        if (localID === animalArray[i].ID) {
            return i;
        }
    }
}

// need one for detail page to fill in the infor based on the passed in ID
$(document).on("pagebeforeshow", "#detail", function (event) {
    // let localParm = localStorage.getItem('parm'); // get the unique key back from the dictionairy
    let localParm = document.getElementById("IDparmHere").innerHTML;
    let localID = GetArrayPointer(localParm); // map to which array element it is

    // next step to avoid bug in jQuery Mobile, force the movie array to be current
    animalArray = JSON.parse(localStorage.getItem('animalArray'));

    document.getElementById("detailType").innerHTML = "The animal is => " + animalArray[localID].selectType;
    document.getElementById("detailAge").innerHTML = " The age is => " + animalArray[localID].age;
    document.getElementById("detailBreed").innerHTML = "The breed is => " + animalArray[localID].breed;
    document.getElementById("detailGender").innerHTML = "The gender is => " + animalArray[localID].selectGender;
    document.getElementById("detailFee").innerHTML = "Adoption fee is => $" + animalArray[localID].fee;
    document.getElementById("detailUrl").innerHTML = animalArray[localID].url;
});
 
// end of page before show code *************************************************************************



function createList() {
    
    // clear prior data
    let mytbody = $("tbody");
    mytbody.empty();
    
    // Adding a row inside the tbody
    animalArray.forEach(function (element,) {
        let tr = document.createElement("tr");
        tr.innerHTML = "<td width='150'>" + element.selectType + "</td><td width='150'>" + element.age + 
            "</td><td width='100'>" + element.breed + "</td><td width='100'>" + element.selectGender + 
            "</td><td width='100'>" + element.fee + "</td><td width='100'>" + element.url + "</td>";
                // // adding a class name to each one as a way of creating a collection
                tr.classList.add('oneAnimal'); 
                // // use the html5 "data-parm" to encode the ID of this particular data object
                // // that we are building an li from
                 tr.setAttribute("data-parm", element.ID);
            mytbody.append(tr);
    });


    let trArray = document.getElementsByClassName("oneAnimal");
    Array.from(trArray).forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        let parm = this.getAttribute("data-parm");  // passing in the record.Id
        // get our hidden <p> and save THIS ID value in the localStorage "dictionairy"
        document.getElementById("IDparmHere").innerHTML = parm;
        localStorage.setItem('parm', parm);
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current movie array and save it to localStorage as well.
        let stringAnimalArray = JSON.stringify(animalArray); // convert array to "string"
        localStorage.setItem('animalArray', stringAnimalArray);
        // now jump to our page that will use that one item
        document.location.href = "index.html#detail";
        });
    });
};