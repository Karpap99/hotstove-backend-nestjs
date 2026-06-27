import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class AiService {
  public AiService() {}

  async test(): Promise<string> {
    const prompt = {
      model: "gemma4:e2b",
      messages: [
        {
          role: "user",
          content: "Привет из backend hotstove",
        },
      ],
      stream: false,
    };

    const response = await axios.post(
      `http://${process.env.AI_ENDPOINT}/api/chat`,
      prompt,
    );
    return `response from AI: ${response.data.message?.content}`;
  }

  async generateTitle(prompt: string): Promise<string> {
    const requestBody = {
      model: "gemma4:e2b",
      messages: [
        {
          role: "system",
          content:
            "Ты помогаешь пользователю сгенерировать заголовок для поста в социальной сети. Ты должен улучшить и сделать заголовок более привлекательным, можеш дополнить его некоторыми словами и/или смайликами, но так что бы смысл оставался прежним. Ты должен сгенерировать только заголовок, без объяснений и без других слов.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    };

    const response = await axios.post(
      `http://${process.env.AI_ENDPOINT}/api/chat`,
      requestBody,
    );

    return response.data.message?.content;
  }
}
