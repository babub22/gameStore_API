const jwt = require("jsonwebtoken");
const config = require("config");

const { User } = require("../../../models/user");
const app = require("../../../index");
const { omit } = require("lodash");
const getHashedString = require("../../../utils/bcrypt/getHashedString");
const request = require("supertest")(app);

const route = "/api/users/";

describe(route, () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("singup/", () => {
    const singUpRoute = route + "singup";
    const exec = (userData) => request.post(singUpRoute).send(userData);

    describe("POST /", () => {
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

        const userInDb = await User.findOne(omit(validUserData, ["password"]));

        expect(decodedJWT._id).toBe(userInDb._id.toHexString());
      });
    });
  });

  describe("singin/", () => {
    const validLoginData = { email: "example@gmail.com", password: "1234" };

    const singInRoute = route + "singin";
    const exec = (userData) => request.post(singInRoute).send(userData);

    test("if user with entered email does not exist, it will return 404", async () => {
      const res = await exec({
        ...validLoginData,
        email: "wrongMail@gmail.com",
      });

      expect(res.status).toBe(404);
    });
    test("if user entered an incorrect password, it will return 404", async () => {
      await createNewUser();

      const res = await exec({ ...validLoginData, password: "54321" });

      expect(res.status).toBe(404);
    });

    test("if email and password valid, it will return 200", async () => {
      await createNewUser();

      const res = await exec(validLoginData);

      expect(res.status).toBe(200);
    });
    test("if returnrned jwt is valid", async () => {
      const { userId } = await createNewUser();

      const res = await exec(validLoginData);

      const decodedJWT = jwt.verify(
        res.header["x-auth-token"],
        config.get("jwtPrivateKey")
      );

      expect(decodedJWT._id).toBe(userId);
    });
  });
});

const validUserData = {
  name: "newUser",
  email: "example@gmail.com",
  password: "1234",
};

async function createNewUser() {
  const hashedPassword = await getHashedString(validUserData.password);
  const newUser = new User({ ...validUserData, password: hashedPassword });

  await newUser.save();

  const userId = newUser._id.toHexString();

  return { userId, newUser };
}
