import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { join } from 'path';

export interface Item {
  id: number;
  name: string;
  description: string;
}

@Injectable()
export class JsonDbService implements OnModuleInit {
  private readonly dbFilePath = join(process.cwd(), 'database.json');
  private readonly distDbFilePath = join(__dirname, '..', 'database.json');

  onModuleInit() {
    if (!existsSync(this.distDbFilePath)) {
      copyFileSync(this.dbFilePath, this.distDbFilePath);
    }
  }

  private readDbFile(): Item[] {
    const data = readFileSync(this.distDbFilePath, 'utf-8');
    return JSON.parse(data) as Item[];
  }

  private writeDbFile(data: Item[]): void {
    writeFileSync(this.distDbFilePath, JSON.stringify(data, null, 2));
  }

  findAll(): Item[] {
    return this.readDbFile();
  }

  findOne(id: number): Item {
    console.log('Searching for item with ID:', id);
    const data = this.readDbFile();
    console.log('Available items:', data);
    const item = data.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return item;
  }

  create(newItem: Item): Item {
    const data = this.readDbFile();
    const id = data.length ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const item = { ...newItem, id };
    data.push(item);
    this.writeDbFile(data);
    return item;
  }

  update(id: number, updatedItem: Partial<Item>): Item {
    const data = this.readDbFile();
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    data[index] = { ...data[index], ...updatedItem };
    this.writeDbFile(data);
    return data[index];
  }

  delete(id: number): { deleted: boolean } {
    const data = this.readDbFile();
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    data.splice(index, 1);
    this.writeDbFile(data);
    return { deleted: true };
  }
}
