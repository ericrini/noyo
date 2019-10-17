const MongoClient = require('mongodb').MongoClient;

module.exports = (function Context(context) {
    const url = "mongodb://localhost:27017";
    let client = null;

    async function collection(collection) {
        if (client === null) {
            client = new MongoClient(url, {
                useUnifiedTopology: true
            });

            await client.connect();

            console.log(`A connection to ${url} was established.`);
        }

        return client.db("noyo").collection(collection);
    }

    function shutdown() {
        if (client !== null) {
            client.close();
            console.log(`The connection to ${url} was closed.`);
        }
    }

    return {
      collection,
      shutdown
    }
})();
