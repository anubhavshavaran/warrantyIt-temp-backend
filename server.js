import dotenv from 'dotenv';
import express, {json, urlencoded, static as static_} from "express";
import autheticationRouter from "./routes/authentication.routes.js";
import productRouter from "./routes/product.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import warrantyRouter from "./routes/warranty.routes.js";

dotenv.config();

const app = express();

app.use(json());
app.use(urlencoded({extended: true}));
app.use(static_("public"));
app.use("/api/auth", autheticationRouter);
app.use("/api/products", productRouter);
app.use("/api/vendors", vendorRouter);
app.use("/api/warranty", warrantyRouter);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});