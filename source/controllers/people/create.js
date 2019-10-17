const Person = require("../../models/Person");

module.exports = async (request, response, next) => {
    try {
        const result = await Person.create(request.body);
        response.json(result);
    }
    catch (error) {
        next(error);
    }
}
