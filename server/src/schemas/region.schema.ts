import { object, string, z } from "zod";

const params = {
  params: object({
    regionId: string({ required_error: "Region Id is required" }),
  }),
};

export const createRegionSchema = object({
  body: object({
    name: string({ required_error: "Region name is required" }),
    townships: string().array().default([]),
  }),
});

export const updateRegionSchema = object({
  ...params,
  body: object({
    name: string({ required_error: "Region name is required" }),
    townships: string().array().default([]),
  }),
});

export const createMultiRegionsSchema = object({
  body: object({
    name: string({ required_error: "Region name is required" }),
    // townships: string().optional() // Split by "\n"
  }).array(),
});

export const getRegionSchema = object({
  ...params,
});

export const deleteMultiRegionsSchema = object({
  body: object({
    regionIds: string().array(),
  }),
});

export type GetRegionInput = z.infer<typeof getRegionSchema>;
export type CreateRegionInput = z.infer<typeof createRegionSchema>["body"];
export type CreateMultiRegionsInput = z.infer<
  typeof createMultiRegionsSchema
>["body"];
export type DeleteMultiRegionsInput = z.infer<
  typeof deleteMultiRegionsSchema
>["body"];
export type UpdateRegionInput = z.infer<typeof updateRegionSchema>;
