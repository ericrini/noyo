const MongoContext = require("../services/MongoContext");
const uuid = require("uuid");

module.exports = (function () {
    const name = "people";

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
            return null;
        }

        const document = await cursor.next();

        return map(document, version);
    }

    async function update(id, person) {
        const collection = await MongoContext.collection("people");
        const effective = Date.now();

        const document = await collection.findOneAndUpdate({
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

        return map(document);
    }

    async function remove(id) {
        const collection = await MongoContext.collection(name);
        const result = await collection.findOneAndDelete({ id });
        return map(result.value);
    }

    function map(document, version) {
        if (!document.revisions) {
            return null;
        }

        const index = version || document.revisions.length;
        const revision = document.revisions[index - 1];

        if (!revision) {
            return null;
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
