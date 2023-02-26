export interface SourceFunctionMetadata {
  name: string;
  displayName: string;
  description: string;
  targetUi: string;
  args: {
    displayName: string;
    description: string;
    argType: string;
    defaultValue: string;
  }[];
  returnType: string;
}
