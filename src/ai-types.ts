// @cloudflare/ai https://www.npmjs.com/package/@cloudflare/ai

import type { modelMappings } from '@cloudflare/ai'
export type ModelMappings = typeof modelMappings
// biome-ignore format: ternary operator
type GetModelName<T> = {
    [K in keyof T]: T[K] extends {
        models: readonly (infer U)[];
    } ? U : never;
}[keyof T];
export type ModelName = GetModelName<ModelMappings>
// biome-ignore format: ternary operator
type GetModelClass<M extends ModelName, T> = {
    [K in keyof T]: T[K] extends {
        models: readonly string[];
        class: infer C;
    } ? M extends T[K]["models"][number] ? C : never : never;
}[keyof T];
// biome-ignore format: not break line
export type ConstructorParametersForModel<M extends ModelName> = ConstructorParameters<GetModelClass<M, ModelMappings>>[0];
type GetModelClassType<M extends ModelName> = {
  [K in keyof ModelMappings]: M extends ModelMappings[K]['models'][number] ? ModelMappings[K]['class'] : never
}[keyof ModelMappings]
type GetModelInstanceType<M extends ModelName> = InstanceType<GetModelClassType<M>>
export type GetPostProcessedOutputsType<M extends ModelName> = GetModelInstanceType<M>['postProcessedOutputs']
