const MongoContext = require("../services/MongoContext");
const uuid = require("uuid");
const Ajv = require("ajv");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

module.exports = (function () {
    const name = "people";

    var schema = new Ajv().compile({
        type: "object",
        properties: {
            firstName: {
                type: "string"
            },
            lastName: {
                type: "string"
            },
            age: {
                type: "integer",
                minimum: 0
            },
            email: {
                type: "string",
                format: "email"
            }
        },
        required: [
            "firstName",
            "lastName",
            "age",
            "email"
        ]
    });

    function validate(person) {
        if (!schema(person)) {
            const error = schema.errors[0];
            throw new BadRequestError(error.message);
        }
    }

    async function list() {
        const collection = await MongoContext.collection(name);
        const cursor = await collection.find({});
        const results = await cursor.toArray();
        return results.map(map);
    }

    async function create(person) {
        const id = uuid.v4();
        const effective = Date.now();
        const collection = await MongoContext.collection(name);

        validate(person);

        const result = await collection.insertOne({
            id,
            revisions: [
                {
                    firstName: person.firstName,
                    lastName: person.lastName,
                    email: person.email,
                    age: person.age,
                    effective
                }
            ],
            updateId: 1
        });

        return map(result.ops[0]);
    }

    async function read(id, version) {
        const collection = await MongoContext.collection(name);

        const cursor = await collection.find({
            id: id
        });

        if (!await cursor.hasNext()) {
            throw new NotFoundError(`Unable to read person ${id} because it was not found.`);
        }

        return map(await cursor.next(), version);
    }

    async function update(id, person) {
        const collection = await MongoContext.collection("people");
        const effective = Date.now();

        validate(person);

        const result = await collection.findOneAndUpdate({
            id
        }, {
            $push: {
                revisions: {
                    firstName: person.firstName,
                    lastName: person.lastName,
                    email: person.email,
                    age: person.age,
                    effective
                }
            },
            $inc: {
                updateId: 1
            }
        }, {
            returnOriginal: false
        });

        if (!result.value) {
            throw new NotFoundError(`Unable to update person ${id} because it was not found.`);
        }

        return map(result.value);
    }

    async function remove(id) {
        const collection = await MongoContext.collection(name);
        const result = await collection.findOneAndDelete({ id });

        if (!result.value) {
            throw new NotFoundError(`Unable to delete person ${id} because it was not found.`);
        }

        return map(result.value);
    }

    function map(document, version) {
        const index = version || document.revisions.length;
        const revision = document.revisions[index - 1];

        if (!revision) {
            throw new NotFoundError(`Unable to retrieve revision ${index} from person ${document.id} because the revision was not found.`, index);
        }

        return {
            id: document.id,
            firstName: revision.firstName,
            lastName: revision.lastName,
            email: revision.email,
            age: revision.age,
            effective: revision.effective,
            revision: index
        };
    }

    return {
      create,
      read,
      update,
      list,
      remove
    };
})();
