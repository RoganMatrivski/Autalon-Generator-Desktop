import { create } from "zustand";
import { temporal } from "zundo";

import product from "immer";
import { arrayMoveMutable } from "array-move";

import FunctionValue from "./structs/Class/FunctionValue";
import { TargetUI } from "./structs/Interface/TargetUI";

import { mountStoreDevtool } from "simple-zustand-devtools";

interface GlobalState {
  instructionList: FunctionValue[];
  addInstruction: (instruction: FunctionValue) => void;
  removeInstruction: (index: number) => void;
  updateInstruction: (index: number, newInstruction: FunctionValue) => void;
  moveInstruction: (index: number, offset: number) => void;
  removeNullInstructions: () => void;
  clearInstruction: () => void;
  setInstruction: (instructionList: Array<FunctionValue>) => void;

  targetUI: TargetUI;
  setTargetUI: (target: TargetUI) => void;
  setTargetUIClearInstruction: (target: TargetUI) => void;

  // currentRowIndex: number;
  // setCurrentRowIndex: (index: number) => void;
  // currentRowInstruction: FunctionValue | null;
  // updateCurrentRowInstruction: () => void;
}

const store = create<GlobalState>()(
  temporal(set => ({
    instructionList: [],

    addInstruction: (instr: FunctionValue) =>
      set(
        product((draft: GlobalState) => {
          draft.instructionList.push(instr);
        })
      ),

    removeInstruction: (index: number) =>
      set(
        product((draft: GlobalState) => {
          draft.instructionList.splice(index, 1);
        })
      ),

    updateInstruction: (index: number, instr: FunctionValue) =>
      set(
        product((draft: GlobalState) => {
          if (instr.name == null) {
            draft.instructionList.splice(index, 1);

            return;
          }

          draft.instructionList[index] = instr;
        })
      ),

    moveInstruction: (index: number, offset: number) =>
      set(
        product((draft: GlobalState) => {
          const newIndex = index + offset;
          if (newIndex < 0 || newIndex >= draft.instructionList.length) {
            return;
          }

          arrayMoveMutable(draft.instructionList, index, newIndex);
        })
      ),

    moveInstructionAbsolute: (index: number, newIndex: number) =>
      set(
        product((draft: GlobalState) => {
          if (newIndex < 0 || newIndex >= draft.instructionList.length) {
            return;
          }

          arrayMoveMutable(draft.instructionList, index, newIndex);
        })
      ),

    removeNullInstructions: () =>
      set(
        product((draft: GlobalState) => {
          draft.instructionList = draft.instructionList.filter(
            x => x.name != null
          );
        })
      ),

    clearInstruction: () => {
      set(
        product((draft: GlobalState) => {
          draft.instructionList = [];
        })
      );
      // get().updateCurrentRowInstruction();
    },

    setInstruction: (instructionList: Array<FunctionValue>) => {
      set(
        product((draft: GlobalState) => {
          draft.instructionList = instructionList;
        })
      );
      // get().updateCurrentRowInstruction();
    },

    targetUI: TargetUI.ExtUI,

    setTargetUI: target => {
      set(
        product((draft: GlobalState) => {
          draft.targetUI = target;
        })
      );
    },

    setTargetUIClearInstruction: target => {
      set(
        product((draft: GlobalState) => {
          draft.targetUI = target;
          draft.instructionList = [];
        })
      );
    },
  }))
);

export default store;

export type { GlobalState };

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", store);
}
