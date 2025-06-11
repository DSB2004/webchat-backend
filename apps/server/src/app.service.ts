import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(no_of_user: number): string {
    return 'Hello World! Server ' + String(no_of_user);
  }
}
