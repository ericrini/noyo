const MongoContext = require("./services/MongoContext");
const Person = require("./models/Person");

(async function() {
    const result1 = await Person.create({
        firstName: "Laura",
        lastName: "Johnson",
        email: "laura.johnson@gmail.com",
        age: "32"
    });

    console.log(JSON.stringify(result1, null, 2));

    const result2 = await Person.read(result1.id);
    console.log(JSON.stringify(result2, null, 2));

    const result3 = await Person.update(result1.id, {
        firstName: "Laura",
        lastName: "Rini",
        email: "laura.johnson@gmail.com",
        age: "33"
    });

    console.log(JSON.stringify(result3, null, 2));

    const result4 = await Person.read(result1.id);
    console.log(JSON.stringify(result4, null, 2));

    const result5 = await Person.create({
        firstName: "Eric",
        lastName: "Rini",
        email: "eric.rini@gmail.com",
        age: "33"
    });

    console.log(JSON.stringify(result5, null, 2));

    const result6 = await Person.list();
    console.log(JSON.stringify(result6, null, 2));

    const result7 = await Person.remove(result1.id);
    console.log(JSON.stringify(result7, null, 2));

    const result8 = await Person.remove(result5.id);
    console.log(JSON.stringify(result8, null, 2));

    MongoContext.shutdown();
})();
