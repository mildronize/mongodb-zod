import { MongoModel } from './mongo-model';



export type InferModel<T> = T extends MongoModel<infer U> ? U : never;
