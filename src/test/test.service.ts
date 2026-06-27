import { Injectable } from "@nestjs/common";
import { AiService } from "src/ai/ai.service";

@Injectable()
export class TestService {
  constructor(private readonly aiService: AiService) {}

  mockAi() {
    return this.aiService.test();
  }

  mockGenerateTitle(prompt: string) {
    return this.aiService.generateTitle(prompt);
  }
}
