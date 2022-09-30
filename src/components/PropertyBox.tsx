import { DevTool } from "@hookform/devtools";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  ArgType,
  FunctionMetadata,
  FunctionMetadataArg,
  FunctionValue,
  getFunctionList,
  mappedFnList,
} from "../BuiltinFunctionList";
import { useStore } from "../stores";

// const ControllerString = ({ control, transform, name, defaultValue }) => (
//   <Controller
//     defaultValue={defaultValue}
//     control={control}
//     name={name}
//     render={({ field }) => (
//       <input
//         onChange={(e) => field.onChange(transform.output(e))}
//         value={transform.input(field.value)}
//       />
//     )}
//   />
// );

export default function PropertyBox() {
  const commandList = useStore((state) => state.instructionList);
  const updateCommand = useStore((state) => state.updateInstruction);
  const currentRow = useStore((state) => state.currentRowInstruction);
  const currentRowIndex = useStore((state) => state.currentRowIndex);

  const [argsMetadata, setArgsMetadata] = useState<FunctionMetadataArg[]>([
    {
      argType: ArgType.String,
      displayName: "",
      description: "",
      defaultValue: "",
    },
  ]);

  const [funcMetadata, setFuncMetadata] = useState({
    name: "",
    displayName: "",
    description: "",
    targetUi: "",
    returnType: "",
  });

  const onSubmit = ({ args }: any) => {
    let mappedArgs = args.map((x: any, index: any) => x.value);

    const newFnValue = new FunctionValue(currentRow?.name, mappedArgs);

    updateCommand(currentRowIndex, newFnValue);
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
    trigger,
    setError,
    getValues,
    watch,
  } = useForm();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "args",
  });

  useEffect(() => {
    // reset();
    remove();

    // console.log(currentRow?.argValue);

    // console.log("New row change", currentRow);
    if (currentRow === null) return;

    const funcData = mappedFnList().find((x) => x.name == currentRow?.name);
    const funcArgs = funcData?.args;
    setArgsMetadata(funcArgs!);
    setFuncMetadata(funcData!);

    const argValues =
      currentRow?.argValue.length == 0
        ? funcArgs?.map((x) => x.defaultValue)
        : currentRow?.argValue;

    reset({ args: argValues?.map((x) => ({ value: x }))! });

    console.log(isValid);
  }, [currentRow]);

  return (
    <Box
      sx={{
        position: "relative",
        mx: "10px",
        mt: "10px",
        pb: "50px",
      }}
    >
      {currentRow != null && (
        <>
          <Typography align="left" variant="h4">
            {funcMetadata.displayName}
          </Typography>
          <Typography align="left" variant="subtitle1">
            {funcMetadata.description}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {fields.map((item, index) => {
                const argMetadata = argsMetadata[index];
                switch (argMetadata.argType) {
                  case ArgType.ByOption:
                    return (
                      <Controller
                        key={Math.floor(Math.random() * 100000)}
                        control={control}
                        name={`args.${index}.value`}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>{argMetadata.displayName}</InputLabel>
                            <Select {...field} label={argMetadata.displayName}>
                              <MenuItem value={"ByOption.ID"}>ID</MenuItem>
                              <MenuItem value={"ByOption.Class"}>
                                Class
                              </MenuItem>
                              <MenuItem value={"ByOption.Text"}>Text</MenuItem>
                              <MenuItem value={"ByOption.Name"}>Name</MenuItem>
                            </Select>
                            <FormHelperText>
                              {argMetadata.description}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    );
                  case ArgType.Boolean:
                    return (
                      <Controller
                        control={control}
                        name={`args.${index}.value`}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Checkbox checked={field.value} />}
                            {...field}
                            label={argMetadata.displayName}
                          />
                        )}
                      />
                    );

                  default:
                    return (
                      <Controller
                        control={control}
                        name={`args.${index}.value`}
                        rules={{
                          required: `${argMetadata.displayName} is required`,
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            error={!!error}
                            label={argMetadata.displayName}
                            helperText={
                              error ? error?.message : argMetadata.description
                            }
                          />
                        )}
                      />
                    );
                }
              })}
            </Stack>
            {fields.length > 0 && (
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty}
                sx={{ position: "absolute", bottom: 15, left: 15 }}
              >
                Save
              </Button>
            )}
            <DevTool control={control} />
          </form>
        </>
      )}
    </Box>
  );
}
