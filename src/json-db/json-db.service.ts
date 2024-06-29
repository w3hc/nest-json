import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class JsonDbService implements OnModuleInit {
  private readonly dbFilePath = join(process.cwd(), 'database.json');
  private readonly distDbFilePath = join(__dirname, '..', 'database.json');

  onModuleInit() {
    if (!existsSync(this.distDbFilePath)) {
      copyFileSync(this.dbFilePath, this.distDbFilePath);
    }
  }

  private readDbFile() {
    const data = readFileSync(this.distDbFilePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeDbFile(data: any) {
    writeFileSync(this.distDbFilePath, JSON.stringify(data, null, 2));
  }

  findAll() {
    return this.readDbFile();
  }

  findOne(id: number) {
    const data = this.readDbFile();
    return data.find((item: any) => item.id === id);
  }

  create(newItem: any) {
    const data = this.readDbFile();
    data.push(newItem);
    this.writeDbFile(data);
    return newItem;
  }

  update(id: number, updatedItem: any) {
    const data = this.readDbFile();
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) {
      return null;
    }
    data[index] = { ...data[index], ...updatedItem };
    this.writeDbFile(data);
    return data[index];
  }

  delete(id: number) {
    let data = this.readDbFile();
    data = data.filter((item: any) => item.id !== id);
    this.writeDbFile(data);
    return { deleted: true };
  }
}
