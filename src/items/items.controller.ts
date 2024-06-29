import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { JsonDbService } from '../json-db/json-db.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly jsonDbService: JsonDbService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [CreateItemDto],
  })
  findAll() {
    return this.jsonDbService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the item', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CreateItemDto,
  })
  findOne(@Param('id') id: number) {
    return this.jsonDbService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiBody({ type: CreateItemDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CreateItemDto,
  })
  create(@Body() createItemDto: CreateItemDto) {
    return this.jsonDbService.create(createItemDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({ name: 'id', description: 'The ID of the item', type: Number })
  @ApiBody({ type: UpdateItemDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UpdateItemDto,
  })
  update(@Param('id') id: number, @Body() updateItemDto: UpdateItemDto) {
    return this.jsonDbService.update(id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the item', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
    type: CreateItemDto,
  })
  delete(@Param('id') id: number) {
    return this.jsonDbService.delete(id);
  }
}
