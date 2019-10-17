const Person = require("../../models/Person");

module.exports = async (request, response, next) => {
    try {
        const results = await Person.read(request.params.id, request.query.revision);
        return response.json(results);
    }
    catch (error) {
        return next(error);
    }
}
