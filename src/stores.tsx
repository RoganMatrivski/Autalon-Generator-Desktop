import create from "zustand";
import { FunctionValue } from "./BuiltinFunctionList";

interface ProgramState {
  instructionList: FunctionValue[];
  addInstruction: (instruction: FunctionValue) => void;
  removeInstruction: (index: number) => void;
  updateInstruction: (index: number, newInstruction: FunctionValue) => void;

  currentRowIndex: number;
  setCurrentRowIndex: (index: number) => void;
  currentRowInstruction: FunctionValue | null;
  updateCurrentRowInstruction: () => void;
}

const useStore = create<ProgramState>()((set, get) => ({
  instructionList: [],
  addInstruction: (instr) => {
    const instrListLen = get().instructionList.length;

    set((state) => ({ instructionList: [...state.instructionList, instr] }));

    get().updateCurrentRowInstruction();
  },
  removeInstruction: (idx) => {
    const instrListLen = get().instructionList.length;

    set((state) => ({
      instructionList: [
        ...state.instructionList.slice(0, idx),
        ...state.instructionList.slice(idx + 1),
      ],
      currentRowIndex:
        idx === instrListLen - 1 ? instrListLen - 2 : state.currentRowIndex,
    }));

    get().updateCurrentRowInstruction();
  },
  updateInstruction: (idx, instr) => {
    set((state) => ({
      instructionList: [
        ...state.instructionList.slice(0, idx),
        instr,
        ...state.instructionList.slice(idx + 1),
      ],
    }));
    get().updateCurrentRowInstruction();
  },

  currentRowIndex: 0,
  setCurrentRowIndex: (idx) => {
    set((state) => ({
      currentRowIndex: idx,
    }));
    get().updateCurrentRowInstruction();
  },
  currentRowInstruction: null,
  updateCurrentRowInstruction: () =>
    set((state) => ({
      currentRowInstruction:
        state.instructionList[state.currentRowIndex] || null,
    })),
}));

export { useStore };
