const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const prisma = require("@prisma/client");
const ejs = require("ejs");
const crypto = require("crypto");

const app = express();
const client = new prisma.PrismaClient();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (request, response) => {
  // ログインフォームを表示
  response.sendFile(__dirname + "/static/index.html");
});

app.post("/login", async (request, response) => {
  // ログインセッションを発行
  const user = await client.user.findUnique({
    where: { username: request.body.username },
  });

  if (!user || user.password !== request.body.password) {
    response.sendFile(__dirname + "/static/failure.html");
    return;
  }

  const sessionId = crypto.randomUUID();
  await client.session.create({
    data: { id: sessionId, userId: user.id },
  });
  response.cookie("sessionId", sessionId);

  response.send(
    await ejs.renderFile(__dirname + "/templates/success.ejs", {
      name: user.username,
    })
  );
});

app.get("/profile", async (request, response) => {
  // ユーザーのプロフィールを表示
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    response.redirect("/");
    return;
  }
  const session = await client.session.findUnique({ where: { id: sessionId } });
  const user = await client.user.findUnique({ where: { id: session.userId } });

  response.send(
    await ejs.renderFile(__dirname + "/templates/profile.ejs", {
      name: user.username,
      password: user.password,
    })
  );
});

app.listen(process.env.PORT || 3000);
