import Dexie, { Table } from 'dexie';
import { environment } from '../../../environments/environment';

export interface PhotoItem {
  id?: number;
  machineId: string;
  identifier: string;
  record: string;
  hash: string;
  imageData: string;
  attempts: number;
  availableAt: string;
  sentAt?: string;
  fail?: boolean;
}

export class AppDB extends Dexie {
  photoList!: Table<PhotoItem, number>;

  constructor() {
    super('pontoremotodb_' + environment.envName);
    this.version(3).stores({
      photoList: '++id, availableAt',
    });
  }
}

export const db = new AppDB();
