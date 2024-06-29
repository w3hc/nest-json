import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 1, description: 'The ID of the item' })
  id: number;

  @ApiProperty({ example: 'Item 1', description: 'The name of the item' })
  name: string;

  @ApiProperty({
    example: 'This is item 1',
    description: 'The description of the item',
  })
  description: string;
}
