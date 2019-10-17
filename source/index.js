const express = require("express");
const bodyParser = require("body-parser");
const ErrorHandler = require("./services/ErrorHandler");

(async function () {
    const app = express();
    const port = 8080;

    app.use(bodyParser.json());
    app.get("/people", require("./controllers/people/list"));
    app.post("/people", require("./controllers/people/create"));
    app.get("/people/:id", require("./controllers/people/read"));
    app.put("/people/:id", require("./controllers/people/update"));
    app.delete("/people/:id", require("./controllers/people/delete"));
    app.use(ErrorHandler);

    app.listen(port, () => console.log(`Service is listening on ${port}.`));
})();
