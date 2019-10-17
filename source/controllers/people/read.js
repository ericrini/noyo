const Person = require("../../models/Person");

module.exports = async (request, response) => {
    const results = await Person.read(request.params.id, request.query.revision);
    response.json(results);
}
