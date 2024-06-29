import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty({
    example: 'Updated Item 1',
    description: 'The updated name of the item',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'This is the updated item 1',
    description: 'The updated description of the item',
    required: false,
  })
  description?: string;
}
