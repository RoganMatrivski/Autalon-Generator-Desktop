import list from "./FunctionMetadata2.json";
import { get_fn_metadata } from "@robinmauritz/autalon-transpiler";

enum ArgType {
  String,
  Number,
  Boolean,
  ByOption,
}

class FunctionInfoArg {
  name: string;
  type: ArgType;
  defaultValue: string;
  description: string;

  constructor(
    _name = "",
    _type = ArgType.String,
    _defaultValue = "",
    _description = ""
  ) {
    this.name = _name;
    this.type = _type;
    this.description = _description;
    this.defaultValue = _defaultValue;
  }
}

class FunctionInfo {
  name: string;
  args: FunctionInfoArg[];

  constructor(_name = "", _args = []) {
    this.name = _name;
    this.args = _args;
  }
}

class FunctionValue {
  name: string;
  argValue: string[];

  constructor(_name = "", _argValue: string[] = []) {
    this.name = _name;
    this.argValue = _argValue;
  }
}

enum BuiltinFunctions {
  NavigateToUrl,
  GetElementByText,
  // GetElementByTextExact,
  // GetElementByString,
  // GetElementByStringExact,
  // ClickElementByText,
  // ClickElementByTextExact,
  // ClickElementByString,
  // ClickElementByStringExact,
  // SendTextToElementByText,
  // SendTextToElementByTextExact,
  // SendTextToElementByString,
  // SendTextToElementByStringExact,
  // GetInputFromLabel,
  // GetIFrameFromLabel,
  // GetWindowFromLabel,
  // GetGroupFromLabel,
  // InputDateByLabelExact,
  // InputHtmlByLabelExact,
  // InputNumberTextboxByLabelExact,
  // InputTextboxByLabelExact,
  // InputDropdownUsingTextByLabelExact,
  // InputDropdownUsingIndexByLabelExact,
  // InputRadioUsingTextByLabelExact,
  // InputRadioUsingIndexByLabelExact,
  // GetAndSwitchToAnyIFrame,
  // GetAndSwitchToParentIFrame,
  // GetAndSwitchToRootIFrame,
}

// This is a stopgap solution
// TODO: Match argtype from this and transpiler
const ArgTypeStrtoEnum = (str: String) => {
  if (str == "string") str = "String";
  if (str == "number") str = "Number";
  if (str == "bool") str = "Boolean";

  return ArgType[str as keyof typeof ArgType];
};

const mappedFnList = () =>
  JSON.parse(get_fn_metadata()).map((x) => ({
    ...x,
    args: x.args.map((arg) => ({
      ...arg,
      argType: ArgTypeStrtoEnum(arg.argType),
    })),
  }));
const getFunctionList = () =>
  mappedFnList().map((x) => [x.name, x.displayName]);
const getFunctionListByTargetUI = (target: String) =>
  mappedFnList()
    .filter((x) => x.targetUi == target || x.targetUi == "Any")
    .map((x) => [x.name, x.displayName]);

export {
  BuiltinFunctions,
  mappedFnList,
  getFunctionList,
  getFunctionListByTargetUI,
  FunctionValue,
  ArgType,
};
