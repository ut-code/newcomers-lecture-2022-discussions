const prisma = require("@prisma/client");
const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const bodyParser = require("body-parser");

const client = new prisma.PrismaClient();
const app = express();

// リクエストボディを解析して resposne.body に入れるために必要
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (request, response) => {
  const todos = await client.todo.findMany();
  const template = fs.readFileSync("./template.ejs").toString();
  const html = ejs.render(template, { todos: todos });
  response.send(html);
});

app.get("/form", (request, response) => {
  response.send(fs.readFileSync("./form.html").toString());
});

app.post("/send", async (request, response) => {
  await client.todo.create({
    data: { name: request.body.todoName }
  });
  response.send("送信しました！");
});

app.listen(3000);
