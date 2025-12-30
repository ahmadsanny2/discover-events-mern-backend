import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOuput from "./swagger_ouput.json";
import fs from "fs";
import path from "path";

const css = fs.readFileSync(
    path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"),
    "utf-8"
);

export default function docs(app: Express) {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerOuput, {
            customCss: css,
        })
    );
}
