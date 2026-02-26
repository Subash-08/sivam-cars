/**
 * src/models/index.ts — Barrel export for all Mongoose models.
 *
 * Architecture rule: import models from here, never from individual files.
 * Usage: import { Car, Brand, User } from '@/models';
 */

export { Brand } from './Brand.model';
export { Car } from './Car.model';
export { Lead } from './Lead.model';
export { default as User } from './User.model';

export type { IBrand } from './Brand.model';
export type { ICar, ICarImage, ICarVideo, ICarLocation, IKeyValue } from './Car.model';
export type { ILead } from './Lead.model';
export type { IUser } from './User.model';
