import { Module } from "@nestjs/common";
import { TestService } from "./test.service";
import { TestController } from "./test.controller";
import { AiService } from "src/ai/ai.service";

@Module({
  controllers: [TestController],
  providers: [TestService, AiService],
})
export class TestModule {}
