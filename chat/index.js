/**
 * Config
 */
require("dotenv-safe").config();

/**
 * Dependencies
 */
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const exphbs = require("express-handlebars");

/**
 * Template Engine
 */
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
    },
  })
);
app.set("view engine", ".hbs");

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.render("home", { layout: "main" });
});

app.get("/javascript", (req, res) => {
  res.render("chat", {
    layout: "main",
    class: "javascript",
    title: "Javascript Tech Class",
  });
});

app.get("/swift", (req, res) => {
  res.render("chat", {
    layout: "main",
    class: "swift",
    title: "Swift Tech Class",
  });
});

app.get("/css", (req, res) => {
  res.render("chat", {
    layout: "main",
    class: "css",
    title: "CSS Tech Class",
  });
});

/**
 * Socket.IO
 */
const tech = io.of("/tech");

tech.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);
    tech.in(data.room).emit("message", `Nem user joined ${data.room} room!`);
  });

  socket.on("message", (data) => {
    console.log(`message: ${data.msg}`);
    tech.in(data.room).emit("message", data.msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    tech.emit("message", "user disconnected");
  });
});

/**
 * Start Server
 */
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
