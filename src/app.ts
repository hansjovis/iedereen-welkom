import express from "express";

import { InMemoryUserRepository } from "modules/user/in-memory.user-repository";
import { register } from "modules/user/routes";
import { UserService } from "modules/user/user.service";
import MainLayout from "views/MainLayout";
import { render } from "render";

const app = express();

const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);

app.post("/users", register(userService));

app.get("/", async (_, res) => {
    await render(
        res, 
        MainLayout, 
        { 
            title: "Hello World!", 
            description: "This is a webpage.",
            children: [],
        }
    );
});

app.listen(3000, () => {
    console.log("App listening on port 3000");
});