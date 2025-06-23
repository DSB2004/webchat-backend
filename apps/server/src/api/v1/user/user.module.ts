import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UtilModule } from 'src/util/util.module';
import { BlockModule } from './block/block.module';

@Module({
  imports: [UtilModule, BlockModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
 
}
