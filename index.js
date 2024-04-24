const express = require("express");
const bodyParser = require('body-parser');
const eventRepo = require('./repositories/repository.event');

const port = 8463;
const app = express();

app.use(bodyParser.json());

app.post('/events', eventRepo.addEvent);
app.get('/events', eventRepo.getAllEvents);
app.put('/events/:id', eventRepo.updateEvent);
app.delete('/events/:id', eventRepo.deleteEvent);
app.get('/events/country', eventRepo.getCountryEvent);
app.get('/events/paginate', eventRepo.getPaginateEvent);


app.listen(port, () => {
    console.log("Server is running and listening on port", port);
});