import express from "express";
import React from "react";

import { render } from "render";

import { InMemoryUserRepository } from "modules/user/in-memory.user-repository";
import { register } from "modules/user/routes";
import { UserService } from "modules/user/user.service";
import MainLayout from "views/layouts/MainLayout";

const app = express();

const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);

app.post("/api/v1/users", register(userService));

app.get("/", async (_, res) => {
    const element = React.createElement(MainLayout, { 
        title: "Hello World!", 
        description: "This is a webpage.",
        children: [],
    });
    await render(res, element);
});

app.listen(3000, () => {
    console.log("App listening on port 3000");
});