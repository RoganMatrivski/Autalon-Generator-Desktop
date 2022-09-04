import list from "./FunctionMetadata.json";

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

const getFunctionList = () => list.map((x) => x.name);

export { BuiltinFunctions, getFunctionList, FunctionValue, ArgType };
