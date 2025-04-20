import dotenv from 'dotenv';
import express, {json, urlencoded, static as static_} from "express";
import authenticationRouter from "./routes/authentication.routes.js";
import productRouter from "./routes/product.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import warrantyRouter from "./routes/warranty.routes.js";
import userRouter from "./routes/user.routes.js";
import ocrRouter from "./routes/ocr.routes.js";
import categoryRouter from "./routes/category.routes.js";
import brandRouter from "./routes/brand.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT',"DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(json());
app.use(urlencoded({extended: true}));
app.use(static_("public"));
app.use("/api/auth", authenticationRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/vendors", vendorRouter);
app.use("/api/warranty", warrantyRouter);
app.use("/api/ocr", ocrRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/brands", brandRouter);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});