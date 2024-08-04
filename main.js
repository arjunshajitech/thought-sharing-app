const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
var hbs = require("express-handlebars");
const app = express();
const port = 3000;

const con = require("./db/connection")
const table = require("./db/tables")
const { findUserByEmail, saveUser } = require("./db/repository/userRepository");
const {
  saveThought,
  getAllThoughts,
  getThoughtsByEmail,
  deleteThoughtById,
  deleteThoughtByEmail
} = require("./db/repository/thoughtRepository");
const { log } = require("console");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layout/",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
  res.render("register/login");
});

app.get("/signup", (req, res) => {
  res.render("register/signup");
});

app.get("/logout", (req, res) => {
  res.redirect("/")
})

app.get("/home", async (req, res) => {
  let q = req.query.q
  let email = req.query.email;
  let data = {}

  const user = await findUserByEmail(email);
  if (user === null) {
    res.redirect("/")
    return
  }

  const myposts = await getThoughtsByEmail(email);
  const allposts = await getAllThoughts();

  if (!q || q === "all-post") {
    data = {
      allPost: true, myPost: false,
      createPost: false, owner: user,
      allData: allposts, myData: myposts
    }
  } else if (q === "my-post") {
    data = {
      allPost: false, myPost: true,
      createPost: false, owner: user,
      allData: allposts, myData: myposts
    }
  } else {
    data = {
      allPost: false, myPost: false,
      createPost: true, owner: user,
      allData: allposts, myData: myposts
    }
  }

  res.render("home/homepage", data);
  return
});

app.get("/user/delete/thought", async (req, res) => {
  let id = req.query.id
  let email = req.query.email

  const user = await findUserByEmail(email);
  if (user === null) {
    res.redirect("/")
    return
  }
  await deleteThoughtById(id)

  const myposts = await getThoughtsByEmail(email);
  res.render("home/homepage", {
    allPost: false, myPost: true,
    createPost: false, owner: user,
    allData: {}, myData: myposts
  })
  return
})

app.post("/user/create/thought", async (req, res) => {
  var isNotValidBody = false
  const user = await findUserByEmail(req.body.email);
  if (user === null) {
    res.redirect("/")
    return
  }

  const myposts = await getThoughtsByEmail(req.body.email);
  const allposts = await getAllThoughts();

  if (req.body.text === null || req.body.text === "") isNotValidBody = true
  if (isNotValidBody) {
    res.render("home/homepage", {
      allPost: false, myPost: false,
      createPost: true, owner: user,
      allData: allposts, myData: myposts
    })
    return
  }

  await saveThought(req.body.text, req.body.email, "######")

  const mypostsNew = await getThoughtsByEmail(req.body.email);

  res.render("home/homepage", {
    allPost: false, myPost: true,
    createPost: false, owner: user,
    allData: {}, myData: mypostsNew
  })
  return
})

app.post("/user/signup", async (req, res) => {
  var isNotValidBody = false
  if (req.body.email === null || req.body.email === "") isNotValidBody = true
  if (req.body.name === null || req.body.name === "") isNotValidBody = true
  if (req.body.password === null || req.body.password === "") isNotValidBody = true
  if (isNotValidBody) {
    res.redirect("/signup")
    return
  }

  const user = await findUserByEmail(req.body.email);
  if (user != null) {
    return res.redirect("/signup");
  }

  saveUser(req.body.name, req.body.email, req.body.password).then((u) => {
    res.redirect("/")
    return
  })
});

app.post("/user/login", async (req, res) => {
  var isNotValidBody = false
  if (req.body.email === null || req.body.email === "") isNotValidBody = true
  if (req.body.password === null || req.body.password === "") isNotValidBody = true
  if (isNotValidBody) {
    res.redirect("/")
    return
  }

  const user = await findUserByEmail(req.body.email);
  if (user == null) {
    console.log("no user present")
    return res.redirect("/");
  }

  if (user.password != req.body.password) {
    console.log("password missmatch")
    return res.redirect("/");
  }

  return res.redirect(`/home?email=${user.email}`)
});

app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
