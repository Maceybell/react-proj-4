require("dotenv").config();
const { sequelize } = require("./util/database");
const { User } = require("./models/user");
const { Post } = require("./models/post");
const express = require("express");
const cors = require("cors");

const { PORT } = process.env;
const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");
const { login, register } = require("./controllers/auth");
const { isAuthenticated } = require("./middleware/isAuthenticated");

const app = express();

app.use(express.json());
app.use(cors());

User.hasMany(Post);
Post.belongsTo(User);

//AUTH
app.post("/register", register);
app.post("/login", login);

//GET POSTS no auth
app.get("/posts", getAllPosts);

//CRUS POSTS auth req
app.get("/userposts/:userId", getCurrentUserPosts);
app.post("/posts", isAuthenticated, addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`db sync was successful & server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
