import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import volleyball from "volleyball";
import helmet from "helmet";
import routes from "./src/routes";
import Fawn from "fawn";
import path from "path";

async function startServer() {
  const app = express();

  await mongoose.connect("SECRET_KEY", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  //Iniciar o Fawn para Transações no Mongoose
  Fawn.init(mongoose);

  //Console Log for Requests
  app.use(volleyball);

  //Helmet Adiciona Segurança
  app.use(helmet());

  //Cors Enable Hosts to access Requests
  app.use(cors());

  // Force HTTPS
  app.enable("trust proxy");
  app.use(function (req, res, next) {
    if (req.protocol === "http" && process.env.NODE_ENV === "production") {
      // Request protocol is HTTP. We will force HTTPS, then.
      return res.redirect("https://" + req.headers.host + req.url);
    }
    // Request protocol is HTTPS already. No action needed.
    next();
  });

  //Body Parser to Json Format
  app.use(express.json());

  //Rotas Customizadas
  routes(app);

  //Client React Router
  app.use(express.static(path.join(__dirname, "../desktop/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../desktop/build", "index.html"));
  });

  //Rotas de Erro Genérico
  app.use((err, req, res, next) => {
    res
      .status(500)
      .send("Algum erro aconteceu no servidor. Entre em contato com o Rafael");
  });

  app.listen({ port: 3333 }, () => {
    console.log(`Servidor Ligado... http://localhost:3333`);
  });
}

startServer();
