const jwt = require("jsonwebtoken");
const config = require("config");

const { User } = require("../../../models/user");
const app = require("../../../index");
const { pick } = require("lodash");
const request = require("supertest")(app);

const route = "/api/users/";

const validUserData = {
  username: "newUser",
  email: "example@gmail.com",
  password: "1234",
};

async function createNewUser() {
  const newUser = new User(validUserData);

  await newUser.save();

  const userId = newUser._id.toHexString();

  return { userId, newUser };
}

describe(route, () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("singup/", () => {
    const singUpRoute = route + "singup";

    describe("POST /", () => {
      const exec = (userData) => request.post(singUpRoute).send(userData);

      test("if invalid data in request, it will return 400", async () => {
        const res = await exec({});

        expect(res.status).toBe(400);
      });

      test("if user already exist, it will return 400", async () => {
        await createNewUser();

        const res = await exec(validUserData);

        expect(res.status).toBe(400);
      });

      test("if valid request, it will return 200", async () => {
        const res = await exec(validUserData);

        expect(res.status).toBe(200);
      });

      test("if returned token is valid", async () => {
        const res = await exec(validUserData);

        const decodedJWT = jwt.verify(
          res.header["x-auth-token"],
          config.get("jwtPrivateKey")
        );

        const userInDb = await User.findOne(
          pick(validUserData, ["username", "email"])
        );

        expect(decodedJWT._id).toBe(userInDb._id.toHexString());
      });
    });
  });
});
