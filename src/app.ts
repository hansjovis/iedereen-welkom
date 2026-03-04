import express from "express";
import React from "react";

import { render } from "render";

// Routes
import { register } from "modules/user/routes";
// Layouts
import MainLayout from "views/layouts/MainLayout";
import { Container } from "container";
import { UserService } from "modules/user/user.service";

const app = express();

const container = new Container();

app.post("/api/v1/users", register(container.get(UserService.name)));

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