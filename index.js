//Node Express Server

//Express Packages 
const express = require('express')
const app = express() 
const port = 6007
const path = require('path')
const bodyParser = require('body-parser')

//Be able to receive html forms 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Give the home page (bidding) 
app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname + '/index.html'))	
})

//Get the IZ number of the citizen 
app.post('/', (req, res)=> {
	res.sendFile(path.join(__dirname + '/index.html'))
	console.log(req.body.iz)
})

//Have server listen for clients
app.listen(port, (err) => {
	if(err){
		return console.log('Error: ', err)
	}

	console.log(`Server is listening on ${port}`)
})

//Error handling 
app.use((err, request, response, next) => {
	console.log(err)
	response.status(500).send("Error")
})