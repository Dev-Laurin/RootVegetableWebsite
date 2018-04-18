da//Node Express Server

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

	response.sendFile(path.join(__dirname + '/index.html')); 
	response.sendFile(path.join(__dirname + '/index.css')); 

	//dump database contents to see if updates work? 
	console.log(database.collection("users").find({}, function(err, res){
		if(err){
			console.log("Error: " + err)
		}
	}))
})

//Get the IZ number of the citizen 
app.post('/', (req, res)=> {
	//res.sendFile(path.join(__dirname + '/index.html'))
 
	var iz = req.body.iz; 

	const characterLimit = 6; 
	var error = "Invalid IZ. Must be 6 numeric digits."  
	var errorHTML = `<!DOCTYPE html> 
<html lang="en"> 
<html>
	<head>
		<title>Izhkstan Root Vegetables</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="index.css">
	</head>
	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#">Izhkstan Root Vegetables</a>
				</div>
			</div>
		</nav>

		<div class="container"> 
		<form action="/" method="post">
			Enter 6-digit IZ Number: <input type="text"  maxlength="6" name="iz"><br> 
			<input type="submit" value="Submit">
		</form><br>
		<p style="color: #FF0000;">` + error + `</p>
		</div>
	</body> 

</html> `;  


	var html = `<!DOCTYPE html> 
<html lang="en"> 
<html>
	<head>
		<title>Izhkstan Root Vegetables</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="index.css">
	</head>
	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#">Izhkstan Root Vegetables</a>
				</div>
			</div>
		</nav>

		<div class="container"> 
		<form action="/" method="post">
			Enter 6-digit IZ Number: <input type="text"  maxlength="6" name="iz"><br> 
			<input type="submit" value="Submit">
		</form><br>
		<h1>Welcome Citizen with IZ: ` + iz + `</h1>
		</div>
	</body> 
</html> `; 
	


	//sanitize 
	if(iz.length != characterLimit){
		console.log("Invalid IZ number.")
		//too many or not enough characters 
		res.set('Content-Type', 'text/html');
		res.send(errorHTML);
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

			res.set('Content-Type', 'text/html');
			res.send(html);
		}
		else{ //not digits were found, invalid iz
			console.log("Invalid IZ number.")
			res.set('Content-Type', 'text/html');
			res.send(errorHTML);
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