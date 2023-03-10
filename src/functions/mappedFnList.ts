import { ArgType } from "src/structs/Interface/Argtype";
import { SourceFunctionMetadata } from "src/structs/Interface/SourceFunctionMetadata";

import produce from "immer";
import { FunctionMetadata } from "src/structs/Interface/FunctionMetadata";

import { invoke } from "@tauri-apps/api/tauri";

// This is a stopgap solution
// TODO: Match argtype from this and transpiler
const ArgTypeStrtoEnum = (str: String) => {
  if (str == "string") str = "String";
  if (str == "number") str = "Number";
  if (str == "bool") str = "Boolean";

  return ArgType[str as keyof typeof ArgType];
};

export default async function mappedFnList(): Promise<FunctionMetadata[]> {
  let fnMetadata: string = (await invoke("get_fn_metadata")) as string;
  return JSON.parse(fnMetadata).map((x: SourceFunctionMetadata) => ({
    ...x,
    args: x.args.map(arg => ({
      ...arg,
      argType: ArgTypeStrtoEnum(arg.argType),
    })),
  }));
}
