export default class FunctionValue {
  name: string | null; // TODO: Rename this to fnName for clarity?
  argValue: string[];

  constructor(_name: string | null = "", _argValue: string[] = []) {
    this.name = _name;
    this.argValue = _argValue;
  }
}
