import { Module } from '@nestjs/common';
import { ItemsController } from './items/items.controller';
import { JsonDbService } from './json-db/json-db.service';

@Module({
  imports: [],
  controllers: [ItemsController],
  providers: [JsonDbService],
})
export class AppModule {}
