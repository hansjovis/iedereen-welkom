import express from "express";

import { InMemoryUserRepository } from "modules/user/in-memory.user-repository";
import { register } from "modules/user/routes";
import { UserService } from "modules/user/user.service";

const app = express();

const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);

app.post("/users", register(userService));

app.listen(3000, () => {
    console.log("App listening on port 3000");
});