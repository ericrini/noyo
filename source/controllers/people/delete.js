const Person = require("../../models/Person");

module.exports = async (request, response, next) => {
    try {
        const result = await Person.remove(request.params.id);
        response.json(result);
    }
    catch (error) {
        next(error);
    }
}
