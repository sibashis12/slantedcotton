const request = require("supertest");
const app = require("../index"); 
const mongoose = require("mongoose");

describe("Question API Tests", () => {
    let accessToken, refreshToken;

    beforeAll(async () => {
        const res = await request(app)
            .post("/adminLogin")
            .send({ username: "sibashis_12", pwd: "1234" });

        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test(" Fetch all questions (Authorized)", async () => {
        const res = await request(app)
            .post("/admin/getQuestions")
            .send({ accessToken, refreshToken }); // Include Tokens

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.questions)).toBe(true);
    });

    test(" Add a new question", async () => {
        const newQuestion = {
            prompt: "What is 2 + 2?",
            options: ["1", "2", "3", "4"],
            correct: 3
        };

        const res = await request(app)
            .post("/admin/questions")
            .send({ ...newQuestion, accessToken,
                refreshToken });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("_id");
    });
    test(" Add a new question", async () => {
        const newQuestion = {
            prompt: "What is 3 + 1?",
            options: ["1", "2", "3", "4"],
            correct: 3
        };

        const res = await request(app)
            .post("/admin/questions")
            .send({ ...newQuestion, accessToken,
                refreshToken });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("_id");
    });
    test(" Delete a question", async () => {
        const newQuestion = {
            prompt: "What is 3 + 2?",
            options: ["1", "2", "3", "5"],
            correct: 3
        };

        const req = await request(app)
            .post("/admin/questions")
            .send({ ...newQuestion, accessToken,
                refreshToken });
        const res=await request(app)
            .delete("/admin/questions/"+req.body._id)
            .send({ accessToken, refreshToken});
        expect(res.statusCode).toBe(200);
    });

    test("Unauthorized admin request should fail", async () => {
        const res = await request(app).get("/admin/questions");
        expect(res.statusCode).toBe(401);
    });

    test("Unauthorized user request should fail", async () => {
        const res=await await request(app).get("/user");
        expect(res.statusCode).toBe(401);
    });

    test("Forbidden due to wrong password", async () => {
        const res=await request(app).post("/user").send({
            "username":"Tata",
            "pwd":"Steele"
        });
        expect(res.statusCode).toBe(401);
    })
});
