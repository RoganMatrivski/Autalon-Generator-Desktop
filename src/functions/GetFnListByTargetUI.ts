import { FunctionMetadata } from "src/structs/Interface/FunctionMetadata";
import mappedFnList from "./mappedFnList";

// TODO: Change these to use object instead of array
export default (
  fnMetadataArr: Array<FunctionMetadata>,
  target: String = "Any"
) =>
  fnMetadataArr
    .filter(
      (x: FunctionMetadata) => x.targetUi == target || x.targetUi == "Any"
    )
    .map((x: FunctionMetadata) => [x.name, x.displayName]);
