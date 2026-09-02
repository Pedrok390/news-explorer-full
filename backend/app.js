require("dotenv").config()

const express = require('express');
const userRouter = require('./routers/users');
const cardRouter = require('./routers/cards');
const { login, createUser } = require('./controllers/users');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");;
const cors = require('cors');

mongoose
    .connect('mongodb://localhost:27017/newsexplorer')
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.log("Erro ao conectar:", err));

app.use(express.json())
const allowedOrigins = [
  "http://localhost:5173",
  'http://api.newsdomain.crabdance.com'
];
app.use(cors({ origin: allowedOrigins }));

app.use(requestLogger)
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth)
app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use(errorLogger);
app.use(errors());

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
