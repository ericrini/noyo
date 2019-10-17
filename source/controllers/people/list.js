const Person = require("../../models/Person");

module.exports = async (request, response) => {
    const results = await Person.list();
    response.json(results);
}
