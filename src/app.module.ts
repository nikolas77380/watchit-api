import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShowsModule } from './shows/shows.module';

@Module({
  imports: [ShowsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
