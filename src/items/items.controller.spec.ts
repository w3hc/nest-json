import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { JsonDbService } from '../json-db/json-db.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: JsonDbService;

  const mockData = [
    { id: 1, name: 'Item 1', description: 'This is item 1' },
    { id: 2, name: 'Item 2', description: 'This is item 2' },
  ];

  const mockJsonDbService = {
    findAll: jest.fn().mockReturnValue(mockData),
    findOne: jest
      .fn()
      .mockImplementation((id: number) =>
        mockData.find((item) => item.id === id),
      ),
    create: jest.fn().mockImplementation((item) => item),
    update: jest.fn().mockImplementation((id: number, item) => ({
      ...mockData.find((i) => i.id === id),
      ...item,
    })),
    delete: jest.fn().mockReturnValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: JsonDbService,
          useValue: mockJsonDbService,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<JsonDbService>(JsonDbService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all items', () => {
    const result = controller.findAll();
    expect(result).toEqual(mockData);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single item by id', () => {
    const result = controller.findOne(1);
    expect(result).toEqual(mockData[0]);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a new item', () => {
    const newItem = { id: 3, name: 'Item 3', description: 'This is item 3' };
    const result = controller.create(newItem);
    expect(result).toEqual(newItem);
    expect(service.create).toHaveBeenCalledWith(newItem);
  });

  it('should update an existing item', () => {
    const updatedItem = { name: 'Updated Item 1' };
    const result = controller.update(1, updatedItem);
    expect(result).toEqual({ ...mockData[0], ...updatedItem });
    expect(service.update).toHaveBeenCalledWith(1, updatedItem);
  });

  it('should delete an item by id', () => {
    const result = controller.delete(1);
    expect(result).toEqual({ deleted: true });
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
