const express = require("express");
const bodyParser = require("body-parser");

(async function () {
    const app = express();

    app.use(bodyParser.json());
    app.get('/', (request, response) => response.send("It's alive!"));
    app.get("/people", require("./controllers/people/list"));
    app.post("/people", require("./controllers/people/create"));
    app.get("/people/:id", require("./controllers/people/read"));
    app.put("/people/:id", require("./controllers/people/update"));
    app.delete("/people/:id", require("./controllers/people/delete"));

    app.listen(8080, () => console.log("Service is listening"));
})();
