import { FunctionMetadata } from "src/structs/Interface/FunctionMetadata";
import mappedFnList from "./mappedFnList";

// TODO: Change these to use object instead of array
export default (fnMetadata: Array<FunctionMetadata>) =>
  fnMetadata.map((x: FunctionMetadata) => [x.name, x.displayName]);
