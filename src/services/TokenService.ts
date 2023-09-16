import jwt, { Secret } from "jsonwebtoken";
import { IRole, IUser } from "../models/UserModel.js";
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

export interface ITokenPayLoad {
  id: string;
  email: string;
  roles: [string];
}

class TokenService {
  private readonly secretKey: Secret | undefined =
    process.env.SECRET_ACCESS_TOKEN_KEY;

  generateAccessToken(user: any): { accessToken: string } {
    try {
      console.log(user);
      if (!this.secretKey) {
        throw new Error("Internal Error");
      }
      const payLoad = {
        id: user.id,
        email: user.email,
        roles: user.roles,
      };
      const accessToken = jwt.sign(payLoad, this.secretKey, {
        expiresIn: "15days",
      });
      return { accessToken: accessToken };
    } catch (err) {
      console.log(err);
      return { accessToken: "" };
    }
  }
  validateAccessToken(token: string): ITokenPayLoad | null {
    try {
      if (!this.secretKey) {
        throw new Error("Internal Error");
      }
      const userPayLoad = jwt.verify(token, this.secretKey) as ITokenPayLoad;
      return userPayLoad;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

export default new TokenService();
