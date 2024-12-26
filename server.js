import dotenv from 'dotenv'
import express, { json, urlencoded, static as static_ } from "express";
import connectToDatabase from "./database/connectToDatabase.js";
import autheticationRouter from "./routes/authentication.routes.js";
import productRouter from "./routes/product.routes.js";

const databaseInstance = connectToDatabase();
const app = express();

//  Middlewares 
dotenv.config();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(static_("public"));
app.use("/api/auth", autheticationRouter);
app.use("/api/products", productRouter);


app.get("/api", async (request, response) => {
  response.send("hello");
  const Query = `select * from USER`;
  const [results, feild] = await databaseInstance.query(Query);
  console.log(results, feild);

});


app.listen(process.env.PORT, () => {
  console.log("server is running on port ", process.env.PORT);
})