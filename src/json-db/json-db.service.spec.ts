import { Test, TestingModule } from '@nestjs/testing';
import { JsonDbService } from './json-db.service';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

jest.mock('fs');

describe('JsonDbService', () => {
  let service: JsonDbService;
  const dbFilePath = join(__dirname, '..', 'database.json');
  const mockData = [
    { id: 1, name: 'Item 1', description: 'This is item 1' },
    { id: 2, name: 'Item 2', description: 'This is item 2' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonDbService],
    }).compile();

    service = module.get<JsonDbService>(JsonDbService);
    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all items', () => {
    const result = service.findAll();
    expect(result).toEqual(mockData);
    expect(readFileSync).toHaveBeenCalledWith(dbFilePath, 'utf-8');
  });

  it('should return a single item by id', () => {
    const result = service.findOne(1);
    expect(result).toEqual(mockData[0]);
    expect(readFileSync).toHaveBeenCalledWith(dbFilePath, 'utf-8');
  });

  it('should create a new item', () => {
    const newItem = { id: 3, name: 'Item 3', description: 'This is item 3' };
    const result = service.create(newItem);
    expect(result).toEqual(newItem);
    expect(writeFileSync).toHaveBeenCalledWith(
      dbFilePath,
      JSON.stringify([...mockData, newItem], null, 2),
    );
  });

  it('should update an existing item', () => {
    const updatedItem = { name: 'Updated Item 1' };
    const result = service.update(1, updatedItem);
    expect(result).toEqual({ ...mockData[0], ...updatedItem });
    expect(writeFileSync).toHaveBeenCalledWith(
      dbFilePath,
      JSON.stringify(
        [{ ...mockData[0], ...updatedItem }, mockData[1]],
        null,
        2,
      ),
    );
  });

  it('should delete an item by id', () => {
    const result = service.delete(1);
    expect(result).toEqual({ deleted: true });
    expect(writeFileSync).toHaveBeenCalledWith(
      dbFilePath,
      JSON.stringify([mockData[1]], null, 2),
    );
  });
});
