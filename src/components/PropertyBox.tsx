import { DevTool } from "@hookform/devtools";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  ArgType,
  FunctionValue,
  getFunctionList,
} from "../BuiltinFunctionList";
import funcMetadata from "../FunctionMetadata.json";
import { useStore } from "../stores";

type PropertyProps = {
  rowId: number;
};

const ControllerString = ({ control, transform, name, defaultValue }) => (
  <Controller
    defaultValue={defaultValue}
    control={control}
    name={name}
    render={({ field }) => (
      <input
        onChange={(e) => field.onChange(transform.output(e))}
        value={transform.input(field.value)}
      />
    )}
  />
);

export default function PropertyBox(prop: PropertyProps) {
  const commandList = useStore((state) => state.instructionList);
  const updateCommand = useStore((state) => state.updateInstruction);
  const currentRow = useStore((state) => state.currentRowInstruction);
  const currentRowIndex = useStore((state) => state.currentRowIndex);

  const [argsMetadata, setArgsMetadata] = useState([
    {
      name: "",
      type: 0,
      description: "",
      defaultValue: "",
    },
  ]);

  const onSubmit = ({ args }) => {
    let mappedArgs = args.map((x, index) => x.value);

    const newFnValue = new FunctionValue(currentRow?.name, mappedArgs);

    updateCommand(currentRowIndex, newFnValue);
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
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
    reset();
    remove();

    // console.log(currentRow?.argValue);

    // console.log("New row change", currentRow);
    if (currentRow === null) return;

    const funcData = funcMetadata.find((x) => x.name == currentRow?.name);
    const funcArgs = funcData?.args;
    setArgsMetadata(funcArgs);

    const argValues =
      currentRow?.argValue.length == 0
        ? funcArgs?.map((x) => x.defaultValue)
        : currentRow?.argValue;

    // console.log(currentRow?.argValue, argValues);

    replace(argValues?.map((x) => ({ value: x }))!);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {fields.map((item, index) => {
            const argMetadata = argsMetadata[index];
            switch (argMetadata.type) {
              case ArgType.ByOption:
                return (
                  <Controller
                    control={control}
                    name={`args.${index}.value`}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>{argMetadata.name}</InputLabel>
                        <Select {...field} label={argMetadata.name}>
                          <MenuItem value={"ByOption.ID"}>ID</MenuItem>
                          <MenuItem value={"ByOption.Class"}>Class</MenuItem>
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

              default:
                return (
                  <TextField
                    {...register(`args.${index}.value`)}
                    label={argsMetadata[index].name}
                    helperText={argsMetadata[index].description}
                  />
                );
            }
          })}
        </Stack>
        <Button
          type="submit"
          variant="contained"
          sx={{ position: "absolute", bottom: 15, right: 15 }}
        >
          Save
        </Button>
        <DevTool control={control} />
      </form>
    </Box>
  );
}
