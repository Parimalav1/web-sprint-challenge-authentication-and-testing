const db = require("../database/dbConfig.js");
const Users = require("./user-model.js");

describe('UserModel', () => {
    // beforeEach(async() => {
    //     await db("users").truncate();
    // });
    
    describe('insert users', () => {
        it('should add users', () => {
            await Users.insert({
                name: 'Sid'
            });
            const users = await db('users')
            expect(users).toHaveLength(1);
        });
    });
});
