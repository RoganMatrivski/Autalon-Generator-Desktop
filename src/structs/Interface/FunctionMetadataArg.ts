import { ArgType } from "./Argtype";

export interface FunctionMetadataArg {
  displayName: string;
  description: string;
  argType: ArgType;
  defaultValue: string;
}
