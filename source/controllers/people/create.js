const Person = require("../../models/Person");

module.exports = async (request, response) => {
    const result = await Person.create(request.body);
    response.json(result);
}
