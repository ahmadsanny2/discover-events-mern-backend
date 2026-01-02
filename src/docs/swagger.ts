import { register } from "module";
import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "1.0.0",
        title: "Discover Events API",
        description: "Discover Events API Documentation"
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local server"
        },
        {
            url: "https://discover-events-mern-backend.vercel.app/api",
            description: "Deployed server"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            }
        },
        schemas: {
            loginRequest: {
                identifier: "johndoe",
                password: "Johndoe123"
            },
            registerRequest: {
                fullName: "John Doe",
                username: "johndoe",
                email: "johndoe123@gmail.com",
                password: "Johndoe123",
                confirmPassword: "Johndoe123"
            },
            activationRequest: {
                code: "abcde"
            }
        }
    }
}

const outputFile = "./swagger_ouput.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
