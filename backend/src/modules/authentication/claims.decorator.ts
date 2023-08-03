import { SetMetadata } from "@nestjs/common";

export const Claims = (...args: string[]) => SetMetadata('claims', args);