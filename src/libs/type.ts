import { MongoEntity } from './mongo-entity';



export type InferEntity<T> = T extends MongoEntity<infer U> ? U : never;
