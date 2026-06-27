import { Body, Controller, Get, Post } from "@nestjs/common";
import { TestService } from "./test.service";

@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get("mock-ai")
  mockAi() {
    return this.testService.mockAi();
  }

  @Post("mock-generate-title")
  mockGenerateTitle(@Body() body: { prompt: string }) {
    return this.testService.mockGenerateTitle(body.prompt);
  }
}
