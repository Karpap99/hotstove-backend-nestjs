import { TokenDto } from "../auth/dto/token.dto";

declare module "express-serve-static-core" {
  interface Request {
    user: TokenDto;
  }
}

export {};
