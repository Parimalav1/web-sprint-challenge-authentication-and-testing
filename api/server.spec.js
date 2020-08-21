const request = require("supertest");

const server = require("./server.js");
const db = require("../database/dbConfig.js");

describe("server", () => {
    // beforeEach(async () => {
    //     // empty table and reset primary key back to 1
    //     await db("users").truncate();
    // });

    // check that the / endpoint returns an `api` property in the body
    // and that the value of that property is `up`
    // using jest's expect()
    describe("GET /", () => {
        it("Should return an api property with the value of up", () => {
            return request(server)
                .get("/")
                .then(res => {
                    expect(res.body.api).toBe("up");
                });
        });

        it("should respond with JSON", async () => {
            const res = await request(server).get("/");

            expect(res.type).toMatch(/json/i);
        });
    });

    describe("Post /register", () => {

        it("should register users", async () => {
            await db("users").truncate();
            await request(server).post('/api/auth/register').send({
                username: "Sidhari",
                password: "password"
            });
            const users = await db('users');
            expect(users).toHaveLength(1);
        });

        it("should respond with json", async () => {
                const res = await request(server).post("/api/auth/register").send({
                    username: "Sidhari"
                })

                expect(res.type).toMatch(/json/i);
        });
    });

    let token = '';
    describe("Post /login", () => {
        it("should login users", async () => {
            let res = await request(server).post('/api/auth/login').send({
                username: 'Sidhari',
                password: 'password'
            });
            token = res.body.token;
            const users = await db('users');
            expect(users).toHaveLength(1);
        });

        it('responds with json', done => {
            request(server)
                .post('/api/auth/login')
                .send({ username: 'Sidhari', password: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Get /jokes', () => {
        it('get jokes', () => {
            return request(server).get('/api/jokes').set('Authorization', token)
                .then(res => {
                    expect(res.status).toEqual(200);
                })
        });

        it('jokes should be in json format', () => {
            return request(server).get('/api/jokes')
            expect(res.type).toMatch(/json/i);
        })
    });
});