var express = require('express');
var router = express.Router();

// start by creating data so we don't have to type it in each time
let ServerAnimalArray = [];

// define a constructor to create animal objects
let AnimalObject = function (pType, pAge, pBreed, pGender, pFee, pUrl) {
  this.ID = Math.random().toString(16).slice(5); // tiny chance could get duplicates!
  this.selectType = pType;
  this.age = pAge;
  this.breed = pBreed;
  this.selectGender = pGender;
  this.fee = pFee;
  this.url = pUrl;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all Animal data */
router.get('/getAllAnimals', function(req, res) {
  res.status(200).json(ServerAnimalArray);
});


/* Add one new Animal */
router.post('/AddAnimal', function(req, res) {
  const newAnimal = req.body;  // get the object from the req object sent from browser
  console.log(newAnimal);
  ServerAnimalArray.push(newAnimal);  // add it to our "DB"  (array)
  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Added Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

// delete animal

// router.delete('/DeleteAnimal/:ID', (req, res) => {
//   const ID = req.params.ID;
//   let found = false;
//   console.log(ID);    

//   for(var i = 0; i < ServerAnimalArray.length; i++) // find the match
//   {
//       if(ServerAnimalArray[i].ID === ID){
//         ServerAnimalArray.splice(i,1);  // remove object from array
//           found = true;
//           break;
//       }
//   }

//   if (!found) {
//     console.log("not found");
//     return res.status(500).json({
//       status: "error"
//     });
//   } else {
//   res.send('Animal ' + ID + ' deleted!');
//   }
// });


module.exports = router;
