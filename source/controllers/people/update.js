const Person = require("../../models/Person");

module.exports = async (request, response, next) => {
    try {
        const results = await Person.update(request.params.id, request.body);
        response.json(results);
    }
    catch (error) {
        next(error);
    }
}
