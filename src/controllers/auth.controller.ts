import { IReqUser } from './../utils/interfaces';
import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import response from '../utils/response';

type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type TLogin = {
    identifier: string;
    password: string;
};

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string()
        .required()
        .min(6, "Password must be at least 6 characters")
        .test(
            "at-least-one-uppercase-letter",
            "Contains at least one uppercase letter",
            (value) => {
                if (!value) return false;

                const regex = /^(?=.*[A-Z])/;

                return regex.test(value);
            }
        )
        .test(
            "at-least-one-number-letter",
            "Contains at least one number letter",
            (value) => {
                if (!value) return false;

                const regex = /^(?=.*\d)/;

                return regex.test(value);
            }
        ),
    confirmPassword: Yup.string()
        .required()
        .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

export default {
    async register(req: Request, res: Response) {
        /**
         * #swagger.tags = ['Auth']
         */
        const { fullName, username, email, password, confirmPassword } =
            req.body as unknown as TRegister;

        try {
            await registerValidateSchema.validate({
                fullName,
                username,
                email,
                password,
                confirmPassword,
            });

            const result = await UserModel.create({
                fullName,
                username,
                email,
                password,
            });

            response.success(res, result, "Successfully registration!")
        } catch (error) {
            response.error(res, error, "Failed registration")
        }
    },

    async login(req: Request, res: Response) {
        /** 
                                #swagger.tags = ['Auth']
                                #swagger.requestBody = {
                                    required: true,
                                    schema: { $ref: "#/components/schemas/loginRequest" },
                                };
                                */

        const { identifier, password } = req.body as unknown as TLogin;

        try {
            // Get data user by "identifier" (email or username)
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        username: identifier,
                    },
                ],
                isActive: true,
            });

            if (!userByIdentifier) {
                return response.unauthorized(res, "User not found")
            }

            // Validate password
            const validatePassword: boolean =
                encrypt(password) === userByIdentifier.password;

            if (!validatePassword) {
                return response.unauthorized(res, "User not found")
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            response.success(res, token, "Login successfully")
        } catch (error) {
            response.error(res, error, "Failed login")
        }
    },

    async me(req: IReqUser, res: Response) {
        /** 
                            #swagger.tags = ['Auth']
                            #swagger.security = [
                                {
                                    bearerAuth: [],
                                },
                            ];
                            */

        try {
            const user = req.user;

            const result = await UserModel.findById(user?.id);

            response.success(res, result, "Successfully get user profile")
        } catch (error) {
            response.error(res, error, "Failed get user profile")
        }
    },

    async activation(req: Request, res: Response) {
        /**
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/components/schemas/activationRequest"},
        }
        */

        try {
            const { code } = req.body as { code: string };

            const user = await UserModel.findOneAndUpdate(
                {
                    activationCode: code,
                },
                {
                    isActive: true,
                },
                {
                    new: true,
                }
            );

            response.success(res, user, "Account activated successfully")
        } catch (error) {
            response.error(res, error, "Failed to activate account")
        }
    },
};
