import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt"

export class BcryptEncryption {
  static async encrypt(password: string) {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      throw new BadRequestException(`Error on encrypt: ${error}`);
    }
  }

  static async compare(password: string, hash: string) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new BadRequestException(`Error on decrypt: ${error}`);
    }
  }
}
