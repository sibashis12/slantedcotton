const request = require("supertest");
const app = require("../server"); // Import your Express app
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
        expect(Array.isArray(res.body)).toBe(true);
    });

    test(" Add a new question", async () => {
        const newQuestion = {
            prompt: "What is 2 + 2?",
            options: ["1", "2", "3", "4"],
            correct: 3
        };

        const res = await request(app)
            .post("/admin/question")
            .send({ ...newQuestion, accessToken,
                refreshToken });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("_id");
    });

    test("Unauthorized request should fail", async () => {
        const res = await request(app).get("/admin/questions");
        expect(res.statusCode).toBe(401);
    });
});
