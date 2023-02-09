import { ArgType } from "../structs/Interface/Argtype";
import { FunctionMetadata } from "../structs/Interface/FunctionMetadata";

export default function GetArgsDisplayText(
  args: string[],
  fnMetadata: FunctionMetadata
) {
  if (args.length <= 0) {
    console.error("Invalid args length");
    return [];
  }

  const argsType = fnMetadata.args.map(x => x.argType);

  const displayArgs = args.map((x, i) => {
    switch (argsType[i]) {
      case ArgType.String:
        return `"${x}"`;
      case ArgType.Number:
      case ArgType.Boolean:
      case ArgType.ByOption:
        return x;
    }
  });

  return displayArgs;
}
