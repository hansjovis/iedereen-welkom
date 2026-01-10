import express from "express";
import React  from "react";
import { renderToReadableStream } from "react-dom/server";

import { InMemoryUserRepository } from "modules/user/in-memory.user-repository";
import { register } from "modules/user/routes";
import { UserService } from "modules/user/user.service";
import MainLayout from "views/MainLayout";

const app = express();

const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);

app.post("/users", register(userService));

app.get("/", async (req, res) => {
    const stream = await renderToReadableStream(
        React.createElement(
            MainLayout, 
            { 
                title: "Hello World!", 
                description: "This is my first web page.", 
                children: []
            }
        )
    );

    res.send(stream);
});

app.listen(3000, () => {
    console.log("App listening on port 3000");
});