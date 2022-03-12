//-------------------------- Start Add animal ---------------------------------------
let animalArray = [];
let pSelectType = "";
let pSelectGender = "";

// define a constructor to create animal objects with 3 parameters
let AnimalObject = function (pType, pAge, pBreed, pGender, pFee, pUrl) {
    this.ID = Math.random().toString(16).slice(5); // tiny chance could get duplicates!
    this.pSelectType = pType;
    this.age = pAge;
    this.breed = pBreed;
    this.pSelectGender = pGender;
    this.fee = pFee;
    this.url = pUrl;
}

$(document).bind("change", "#selectType", function (event, ui) {
    selectType = document.getElementById("selectType").value;
});
$(document).bind("change", "#selectGender", function (event, ui) {
    selectGender = document.getElementById("selectGender").value;
});

document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("buttonAdd").addEventListener("click", function () {

        pSelectType = document.getElementById("selectType").value;
        pSelectGender = document.getElementById("selectGender").value;

        let newAnimal = new AnimalObject(pSelectType, document.getElementById("age").value, 
        document.getElementById("breed").value, pSelectGender, document.getElementById("fee").value,
        document.getElementById("url").value)
              
        $.ajax({
            url:"/AddAnimal",
            type:"POST",
            data: JSON.stringify(newAnimal),
            contentType: "application/json; charset=utf-8",
            success: function (result){
                console.log("Added Res:", result);
            }
        }) 


        document.location.href = "index.html#list"; //Moving to the list animal page automatically after added animal 
       // console.log(animalArray);

        document.getElementById("age").value = ""; //Clear current input screen
        document.getElementById("breed").value = "";
        document.getElementById("fee").value = "";
        document.getElementById("url").value = "";
    });
    // ------------------ End Add animal --------------------------------------------

    //------------------------- Delete Animal --------------------
    document.getElementById("delete").addEventListener("click", function () {
        let localID = localStorage.getItem('parm'); //read back the value stored when we created the list
        deleteAnimal(localID);
        createList(); // recreate tr list after removing one
        document.location.href = "index.html#ListAll"; // go back to animal table
    });

    // button on detail information page to view the linked URL address
    document.getElementById("locationInformation").addEventListener("click", function () {
        window.open(document.getElementById("detailUrl").innerHTML);
    })

    function deleteAnimal(ID) {
        console.log(ID);
        $.ajax({
            type: "DELETE",
            url: "/DeleteAnimal/" + ID,
            success: function(result){
                alert(result);
            },
            error: function (xhr, textStaus, errorThrown) {
                alert("Server could not delete Animal with ID " + ID)
            }
        });
    }


    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#list", function (event) {   
        createList();
    });  

});
//-------Pointing hovering list
function GetArrayPointer(localID) {
    for (let i = 0; i < animalArray.length; i++) {
        if (localID === animalArray[i].ID) {
            return i;
        }
    }
}
//---------------------- Detail page
// need one for detail page to fill in the infor based on the passed in ID
$(document).on("pagebeforeshow", "#detail", function (event) {
    // next step to avoid bug in jQuery Mobile, force the movie array to be current
    animalArray = JSON.parse(localStorage.getItem('animalArray'));
    let localParm = localStorage.getItem('parm'); // get the unique key back from the dictionairy
    
    let localID = GetArrayPointer(localParm); // map to which array element it is
    
    document.getElementById("detailType").innerHTML = "The animal is => " + animalArray[localID].pSelectType;
    document.getElementById("detailAge").innerHTML = "The age is => " + animalArray[localID].age;
    document.getElementById("detailBreed").innerHTML = "The breed is => " + animalArray[localID].breed;
    document.getElementById("detailGender").innerHTML = "The gender is => " + animalArray[localID].pSelectGender;
    document.getElementById("detailFee").innerHTML = "Adoption fee is => $" + animalArray[localID].fee;
    document.getElementById("detailUrl").innerHTML = animalArray[localID].url;
});
 
// end of page before show code *************************************************************************


//---------- Table List
function createList() {
    
    $.get('/getAllAnimals', function(data, status) { // AJAX get
        animalArray = data; // put the returned server json data into our local array
        console.log("getallAnimals = ", animalArray);

    // clear prior data
    let mytbody = $("tbody");
    mytbody.empty();
    
    // Adding a row inside the tbody
    animalArray.forEach(function (element,) {
        let tr = document.createElement("tr");
        tr.innerHTML = "<td width='150'>" + element.pSelectType + "</td><td width='150'>" + element.age + 
            "</td><td width='100'>" + element.breed + "</td><td width='100'>" + element.pSelectGender + 
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

});
};

//---------------------Search by any characters
$(document).ready(function(){
    $("#mySearch").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });

