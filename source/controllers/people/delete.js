const Person = require("../../models/Person");

module.exports = async (request, response) => {
    const result = await Person.remove(request.params.id);
    response.json(result);
}
