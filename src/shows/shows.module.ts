import { Module } from '@nestjs/common';
import { ShowsController } from './shows.controller';
@Module({
  imports: [],
  controllers: [ShowsController],
  providers: [],
})
export class ShowsModule {}
