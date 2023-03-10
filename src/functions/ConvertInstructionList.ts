import mappedFnList from "src/functions/mappedFnList";
import { ArgType } from "src/structs/Interface/Argtype";
import FunctionValue from "src/structs/Class/FunctionValue";
import { invoke } from "@tauri-apps/api";

export default async function ConvertInstructionList(
  instructionList: FunctionValue[]
): Promise<[string, null] | [null, string]> {
  const functionStringsJob: Array<Promise<string>> = instructionList.map(
    async (x: FunctionValue) => {
      const { name, argValue } = x;
      const argsMetadata = (await mappedFnList()).find(y => y.name == name)
        ?.args!;

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

  const functionStrings = await Promise.all(functionStringsJob);

  const joinedFunctionStrings = functionStrings.join("\n");
  const processedInstructionList = `#[version=1]\n\n${joinedFunctionStrings}`;

  try {
    const convertedCode: string = await invoke("transpile_groovy", {
      src: processedInstructionList,
    });
    return [convertedCode, null];
  } catch (err: any) {
    return [null, err.toString()];
  }
}
