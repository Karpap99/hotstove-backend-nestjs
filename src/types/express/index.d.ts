import { TokenDto } from "../../auth/dto/token.dto";

declare global {
  namespace Express {
    interface Request {
      user?: TokenDto;
    }
  }
}
