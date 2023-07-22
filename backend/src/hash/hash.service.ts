import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async getHashedPassword(pass: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
  }

  async compare(pass: string, hash: string) {
    return await bcrypt.compare(pass, hash);
  }
}
