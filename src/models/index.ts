/**
 * src/models/index.ts — Barrel export for all Mongoose models.
 *
 * Architecture rule: import models from here, never from individual files.
 * Usage: import { Car, Brand, User } from '@/models';
 */

export { Brand } from './Brand.model';
export { CustomerStory } from './CustomerStory.model';
export { Car } from './Car.model';
export { HomeSection } from './HomeSection.model';
export { HeroSetting } from './HeroSetting.model';
export { Lead } from './Lead.model';
export { default as User } from './User.model';
export { Video } from './Video.model';
export { VideoSection } from './VideoSection.model';

export type { IBrand } from './Brand.model';
export type { ICustomerStory } from './CustomerStory.model';
export type { ICar, ICarImage, ICarVideo, ICarLocation, IKeyValue } from './Car.model';
export type { IHomeSection, LayoutType } from './HomeSection.model';
export type { IHeroSetting } from './HeroSetting.model';
export type { ILead } from './Lead.model';
export type { IUser } from './User.model';
export type { IVideo, VideoOrientation } from './Video.model';
export type { IVideoSection, IVideoEntry, VideoLayoutType } from './VideoSection.model';
