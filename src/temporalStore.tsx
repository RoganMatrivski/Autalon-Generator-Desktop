import { TemporalState } from "zundo";
import { create, useStore as zustandUseStore } from "zustand";
import useStore, { GlobalState } from "./store";

const useTemporalStore = <T,>(
    selector: (state: TemporalState<GlobalState>) => T,
    equality?: (a: T, b: T) => boolean,
  ) => zustandUseStore(useStore.temporal, selector, equality);
export default useTemporalStore;
