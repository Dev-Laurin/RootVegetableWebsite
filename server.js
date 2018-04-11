//Node Express Server

//Express Packages 
const express = require('express')
const app = express() 
const port = 6007
const path = require('path')
const bodyParser = require('body-parser')



//Create user database 
var mongoClient = require('mongodb').MongoClient; 
var url = "mongodb://localhost:27017/rootVegetable"; 
var database = null //to keep in scope for use 

mongoClient.connect(url, function(err, db) {
	if(err){
		throw err; 
	}

	console.log("Database Created.")

	//else no errors 
	database = db.db("rootVegetable"); 
	database.createCollection("users", function(err, res){
		if(err){
			throw err; 
		}
		console.log("Collection Created.")
	})
})

//Be able to receive html forms 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Give the home page (bidding) 
app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname + '/index.html'))

	//dump database contents to see if updates work? 

})

//Get the IZ number of the citizen 
app.post('/', (req, res)=> {
	res.sendFile(path.join(__dirname + '/index.html'))

	const characterLimit = 6; 
	var iz = req.body.iz

	//sanitize 
	if(iz.length != characterLimit){
		console.log("Invalid IZ number.")
		//too many or not enough characters 
	}
	else{
			//Anything that is not a numeric digit
		var regex = /[^0-9]/g; 

		//get only numbers from the string
		iz = iz.replace(regex, ""); 

		console.log("IZ num: " + iz + " length: " + iz.length); 

		//put iz number in database
		if(iz.length == characterLimit){
			var user = {_id: iz}; 
			database.collection("users").update(user, user, {upsert: true});	
			console.log("IZ number added to database: " + iz)
		}
		else{ //not digits were found, invalid iz
			console.log("Invalid IZ number.")
		}
	}
})

//Have server listen for clients
app.listen(port, (err) => {
	if(err){
		return console.log('Error: ', err)
	}

	console.log(`Server is listening on ${port}`)
})