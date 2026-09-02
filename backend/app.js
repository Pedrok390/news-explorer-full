require("dotenv").config();

const express = require("express");
const userRouter = require("./routers/users");
const cardRouter = require("./routers/cards");
const { login, createUser } = require("./controllers/users");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const cors = require("cors");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://localhost:27017/newsexplorer")
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.log("Erro ao conectar:", err));

const allowedOrigins = [
  "http://localhost:5173",
  "https://newsdomain.chickenkiller.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("ORIGIN RECEBIDO:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origem não permitida pelo CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(requestLogger);

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use(errorLogger);
app.use(errors());

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});