import { FunctionMetadataArg } from "./FunctionMetadataArg";

export interface FunctionMetadata {
  name: string;
  displayName: string;
  description: string;
  targetUi: string;
  args: FunctionMetadataArg[];
  returnType: string;
}
