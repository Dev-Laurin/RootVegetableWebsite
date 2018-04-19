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
	database.createCollection("vegetable", function(err, res){
		if(err){
			throw err; 
		}
		console.log("Collection Created.")

		//add vegetables to database 
		var veggie = {_id: "Potato", bids: []}
		database.collection("vegetable").update(veggie, veggie, {upsert: true});
		veggie = {_id: "Onion", bids: []}
		database.collection("vegetable").update(veggie, veggie, {upsert: true});
		veggie = {_id: "Turnip", bids: []}
		database.collection("vegetable").update(veggie, veggie, {upsert: true});
		veggie = {_id: "Imported_Turnip", bids: []}
		database.collection("vegetable").update(veggie, veggie, {upsert: true});
	}); 
})

//Be able to receive html forms 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Give the home page (bidding) 
app.get('/', (request, response) => {

	response.sendFile(path.join(__dirname + '/index.html')); 

	//dump database contents to see if updates work? 
	console.log(database.collection("users").find({}, function(err, res){
		if(err){
			console.log("Error: " + err)
		}
	}))
})

//Get the IZ number of the citizen 
app.post('/', (req, res)=> {

	var iz = req.body.iz; 


	const characterLimit = 6;  
	var izErrorHTML = `<!DOCTYPE html> 
<html lang="en"> 
<html>
	<head>
		<title>Izhkstan Root Vegetable</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	</head>
	<style>
		th, td {
		    padding: 15px;
		    text-align: left;
		    font-size: 20px; 
		}
		table#t01 tr:nth-child(even){
			background-color: #eee;
		}

		table#t01 tr:nth-child(odd){
			background-color: #fff;
		}

		table#t01 th{
			background-color: black; 
			color: white;
		}
	</style>
	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#">Izhkstan Root Vegetable</a>
				</div>
			</div>
		</nav>

		<div class="container"> 
			<div class="row"> 
				<div class="col-sm-8"> 
					<h1>Welcome Citizen</h1>
				</div>

				<div class="col-sm-4"> 
					<form action="/" method="post">
						Enter 6-digit IZ Number: <input type="text"  maxlength="6" name="iz"><br> 
					<br>
					<p style="color: #FF0000;"> Error invalid IZ </p>
				</div>

			</div>

			<!--List of Root Vegetables to Bid on --> 

				<div class="row">
					<div class="col-sm-8">
						<h2>Bidding on Root Vegetable</h2>
					</div>
					<div class="col-sm-4">
						<h3 id="Izhk">Izhk Left: 100</h3>
					</div>
				</div><br>

				<table id="t01" style="width:100%">
				  <tr>
				    <th>Vegetable</th>
				    <th>Izhk to Bid</th> 
				  </tr>
				  <tr>
				    <td>Potato</td>
				    <td><input type="number" id="potato_bid" name="potato_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"> </td> 
				  </tr>
				  <tr>
				    <td>Onion</td>
				    <td><input type="number" id="onion_bid" name="onion_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				    <tr>
				    <td>Turnip</td>
				    <td><input type="number" id="turnip_bid" name="turnip_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				    <tr>
				    <td>Imported Turnip</td>
				    <td><input type="number" id="imported_bid" name="imported_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				</table>

				<div class="row">
					<div class="col-sm-8">
						<h3> Submit Bid:  </h3>
					</div> <br>
					<div class="col-sm-4">
						<input type="submit" value="Submit">
					</div> 
				</div> 
			</form>   

			<div class="row">
				<div class="col-sm-12"> 
					<h4 id="bid_error" style="color: #FF0000;"> </h4> 
				</div> 
			</div> 

		</div>
		
		<script type="text/javascript">
			//subtract what was bidded on from Izhk total 
			function updateIzhk(){

				//Get our new values 
				var potatoBid = document.getElementById("potato_bid").value 
				var onionBid = document.getElementById("onion_bid").value 
				var turnipBid = document.getElementById("turnip_bid").value 
				var importedTurnipBid = document.getElementById("imported_bid").value 
				//What the updated value would be 
				var newValue = 100 - ( Number(potatoBid) + Number(onionBid) + Number(turnipBid) + Number(importedTurnipBid))

				//Check if it is out of bounds 
				if(newValue > 100 || newValue < 0){
					//Display error message 
					document.getElementById("bid_error").innerHTML = "Error Invalid Izhk Amount."
					document.getElementById("Izhk").innerHTML = "Izhk: Invalid" 
				}
				else{
					document.getElementById("Izhk").innerHTML = "Izhk: " + newValue.toString(); 
					document.getElementById("bid_error").innerHTML = "" 
				}
			}
		
		</script> 
	</body> 


</html> `; 

var bidErrorHTML = `<!DOCTYPE html> 
<html lang="en"> 
<html>
	<head>
		<title>Izhkstan Root Vegetable</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	</head>
	<style>
		th, td {
		    padding: 15px;
		    text-align: left;
		    font-size: 20px; 
		}
		table#t01 tr:nth-child(even){
			background-color: #eee;
		}

		table#t01 tr:nth-child(odd){
			background-color: #fff;
		}

		table#t01 th{
			background-color: black; 
			color: white;
		}
	</style>
	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#">Izhkstan Root Vegetable</a>
				</div>
			</div>
		</nav>

		<div class="container"> 
			<div class="row"> 
				<div class="col-sm-8"> 
					<h1>Welcome Citizen</h1>
				</div>

				<div class="col-sm-4"> 
					<form action="/" method="post">
						Enter 6-digit IZ Number: <input type="text"  maxlength="6" name="iz"><br> 
					<br>
					<p style="color: #FF0000;">  </p>
				</div>

			</div>

			<!--List of Root Vegetables to Bid on --> 

				<div class="row">
					<div class="col-sm-8">
						<h2>Bidding on Root Vegetable</h2>
					</div>
					<div class="col-sm-4">
						<h3 id="Izhk">Izhk Left: 100</h3>
					</div>
				</div><br>

				<table id="t01" style="width:100%">
				  <tr>
				    <th>Vegetable</th>
				    <th>Izhk to Bid</th> 
				  </tr>
				  <tr>
				    <td>Potato</td>
				    <td><input type="number" id="potato_bid" name="potato_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"> </td> 
				  </tr>
				  <tr>
				    <td>Onion</td>
				    <td><input type="number" id="onion_bid" name="onion_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				    <tr>
				    <td>Turnip</td>
				    <td><input type="number" id="turnip_bid" name="turnip_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				    <tr>
				    <td>Imported Turnip</td>
				    <td><input type="number" id="imported_bid" name="imported_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				</table>

				<div class="row">
					<div class="col-sm-8">
						<h3> Submit Bid:  </h3>
					</div> <br>
					<div class="col-sm-4">
						<input type="submit" value="Submit">
					</div> 
				</div> 
			</form>   

			<div class="row">
				<div class="col-sm-12"> 
					<h4 id="bid_error" style="color: #FF0000;"> Error invalid Izhk spent. </h4> 
				</div> 
			</div> 

		</div>
		
		<script type="text/javascript">
			//subtract what was bidded on from Izhk total 
			function updateIzhk(){

				//Get our new values 
				var potatoBid = document.getElementById("potato_bid").value 
				var onionBid = document.getElementById("onion_bid").value 
				var turnipBid = document.getElementById("turnip_bid").value 
				var importedTurnipBid = document.getElementById("imported_bid").value 
				//What the updated value would be 
				var newValue = 100 - ( Number(potatoBid) + Number(onionBid) + Number(turnipBid) + Number(importedTurnipBid))

				//Check if it is out of bounds 
				if(newValue > 100 || newValue < 0){
					//Display error message 
					document.getElementById("bid_error").innerHTML = "Error Invalid Izhk Amount."
					document.getElementById("Izhk").innerHTML = "Izhk: Invalid" 
				}
				else{
					document.getElementById("Izhk").innerHTML = "Izhk: " + newValue.toString(); 
					document.getElementById("bid_error").innerHTML = "" 
				}
			}
		
		</script> 
	</body> 


</html> `; 


	var html = `<!DOCTYPE html> 
<html lang="en"> 
<html>
	<head>
		<title>Izhkstan Root Vegetable</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	</head>
	<style>
		th, td {
		    padding: 15px;
		    text-align: left;
		    font-size: 20px; 
		}
		table#t01 tr:nth-child(even){
			background-color: #eee;
		}

		table#t01 tr:nth-child(odd){
			background-color: #fff;
		}

		table#t01 th{
			background-color: black; 
			color: white;
		}
	</style>
	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#">Izhkstan Root Vegetable</a>
				</div>
			</div>
		</nav>

		<div class="container"> 
			<div class="row"> 
				<div class="col-sm-8"> 
					<h1>Welcome Citizen</h1>
				</div>

				<div class="col-sm-4"> 
					<form action="/" method="post">
						Enter 6-digit IZ Number: <input type="text"  maxlength="6" name="iz"><br> 
					<br>
					<p style="color: #FF0000;"> </p>
				</div>

			</div>

			<!--List of Root Vegetables to Bid on --> 

				<div class="row">
					<div class="col-sm-8">
						<h2>Bidding on Root Vegetable</h2>
					</div>
					<div class="col-sm-4">
						<h3 id="Izhk">Izhk Left: 100</h3>
					</div>
				</div><br>

				<table id="t01" style="width:100%">
				  <tr>
				    <th>Vegetable</th>
				    <th>Izhk to Bid</th> 
				  </tr>
				  <tr>
				    <td>Potato</td>
				    <td><input type="number" id="potato_bid" name="potato_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"> </td> 
				  </tr>
				  <tr>
				    <td>Onion</td>
				    <td><input type="number" id="onion_bid" name="onion_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				    <tr>
				    <td>Turnip</td>
				    <td><input type="number" id="turnip_bid" name="turnip_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				    <tr>
				    <td>Imported Turnip</td>
				    <td><input type="number" id="imported_bid" name="imported_bid" min="0" max="100" step="1" value="0" onclick="updateIzhk()"></td> 
				  </tr>
				</table>

				<div class="row">
					<div class="col-sm-8">
						<h3> Submit Bid:  </h3>
					</div> <br>
					<div class="col-sm-4">
						<input type="submit" value="Submit">
					</div> 
				</div> 
			</form>   

			<div class="row">
				<div class="col-sm-12"> 
					<h4 id="bid_error" style="color: #8FBC8F;"> Submission Successful!</h4> 
				</div> 
			</div> 

		</div>
		
		<script type="text/javascript">
			//subtract what was bidded on from Izhk total 
			function updateIzhk(){

				//Get our new values 
				var potatoBid = document.getElementById("potato_bid").value 
				var onionBid = document.getElementById("onion_bid").value 
				var turnipBid = document.getElementById("turnip_bid").value 
				var importedTurnipBid = document.getElementById("imported_bid").value 
				//What the updated value would be 
				var newValue = 100 - ( Number(potatoBid) + Number(onionBid) + Number(turnipBid) + Number(importedTurnipBid))

				//Check if it is out of bounds 
				if(newValue > 100 || newValue < 0){
					//Display error message 
					document.getElementById("bid_error").innerHTML = "Error Invalid Izhk Amount."
					document.getElementById("Izhk").innerHTML = "Izhk: Invalid" 
				}
				else{
					document.getElementById("Izhk").innerHTML = "Izhk: " + newValue.toString(); 
					document.getElementById("bid_error").innerHTML = "" 
				}
			}
		
		</script> 
	</body> 


</html> `; 
	


	//sanitize 
	if(iz.length != characterLimit){
		console.log("Invalid IZ number.")
		//too many or not enough characters 
		res.set('Content-Type', 'text/html');
		res.send(izErrorHTML);
	}
	else{
		//Anything that is not a numeric digit
		var regex = /[^0-9]/g; 

		//get only numbers from the string
		iz = iz.replace(regex, ""); 

		console.log("IZ num: " + iz + " length: " + iz.length); 

		//put bid in database 
		if(iz.length == characterLimit){

			//IZ number is good

			//Sanitize the Bids (numbers only)
			//check to see if bid amount is valid 
			var potatoBid = req.body.potato_bid 
			var onionBid = req.body.onion_bid 
			var turnipBid = req.body.turnip_bid
			var importedBid = req.body.imported_bid 

			//get only numbers from the string
			var regex = /[^0-9]/g;
			potatoBid = potatoBid.replace(regex, "");
			onionBid = onionBid.replace(regex, "");
			turnipBid = turnipBid.replace(regex, "");
			importedBid = importedBid.replace(regex, "");

			//check to see if the numbers are > 100 or < 0 
			var newValue = Number(potatoBid) + Number(onionBid) + 
			Number(turnipBid) + Number(importedBid)
			if(newValue > 100 || newValue < 0){
				console.log("Error, Bid value is invalid: " + newValue.toString())
				res.sendFile(bidErrorHTML)
			}
			else{
				//No errors, accept bid into database 
							
//TODO 
				res.set('Content-Type', 'text/html');
				res.send(html);
			}

		}
		else{ //not digits were found, invalid iz
			console.log("Invalid IZ number.")
			res.set('Content-Type', 'text/html');
			res.send(izErrorHTML);
		}
	}
})



//User has placed their bid 
// app.post('/bid', (req, res)=> {



//Have server listen for clients
app.listen(port, (err) => {
	if(err){
		return console.log('Error: ', err)
	}

	console.log(`Server is listening on ${port}`)
})