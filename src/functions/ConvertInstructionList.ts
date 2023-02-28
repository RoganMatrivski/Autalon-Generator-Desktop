import { transpile_groovy } from "@robinmauritz/autalon-transpiler";

import mappedFnList from "src/functions/mappedFnList";
import { ArgType } from "src/structs/Interface/Argtype";
import FunctionValue from "src/structs/Class/FunctionValue";

export default function ConvertInstructionList(
  instructionList: FunctionValue[]
): [string, null] | [null, string] {
  const functionStrings: Array<string> = instructionList.map(
    (x: FunctionValue) => {
      const { name, argValue } = x;
      const argsMetadata = mappedFnList().find(y => y.name == name)?.args!;

      function PreprocessArgValue(value: string, index: number) {
        const argsType = argsMetadata[index].argType;

        if (argsType == ArgType.String) return `"${value}"`;

        return value;
      }

      const preProcessedValue = argValue.map(PreprocessArgValue);
      const joinedPreProcessedValue = preProcessedValue.join(", ");
      return `#:${name}(${joinedPreProcessedValue});`;
    }
  );

  const joinedFunctionStrings = functionStrings.join("\n");
  const processedInstructionList = `#[version=1]\n\n${joinedFunctionStrings}`;

  try {
    const convertedCode = transpile_groovy(processedInstructionList);
    return [convertedCode, null];
  } catch (err: any) {
    return [null, err.toString()];
  }
}
