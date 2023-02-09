import { get_fn_metadata } from "@RoganMatrivski/autalon-transpiler";
import { ArgType } from "../structs/Interface/Argtype";
import { SourceFunctionMetadata } from "../structs/Interface/SourceFunctionMetadata";

import produce from "immer";
import { FunctionMetadata } from "../structs/Interface/FunctionMetadata";

// This is a stopgap solution
// TODO: Match argtype from this and transpiler
const ArgTypeStrtoEnum = (str: String) => {
  if (str == "string") str = "String";
  if (str == "number") str = "Number";
  if (str == "bool") str = "Boolean";

  return ArgType[str as keyof typeof ArgType];
};

export default (): FunctionMetadata[] =>
  JSON.parse(get_fn_metadata()).map((x: SourceFunctionMetadata) => ({
    ...x,
    args: x.args.map(arg => ({
      ...arg,
      argType: ArgTypeStrtoEnum(arg.argType),
    })),
  }));
