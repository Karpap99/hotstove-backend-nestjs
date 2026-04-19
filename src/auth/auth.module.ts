import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { UploaderService } from "src/uploader/uploader.service";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule, UserModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("SECRET_ACCESS"),
        secretOrPrivateKey: config.get<string>("SECRET_ACCESS"),
        signOptions: {
          expiresIn: "50s",
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    UploaderService,
    AuthService,
    JwtService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
