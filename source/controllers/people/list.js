const Person = require("../../models/Person");

module.exports = async (request, response, next) => {
    try {
        const results = await Person.list();
        response.json(results);
    }
    catch(error) {
        next(error);
    }
}
