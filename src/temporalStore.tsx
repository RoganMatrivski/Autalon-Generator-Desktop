import { create } from "zustand";
import useStore from "./store";

const useTemporalStore = create(useStore.temporal);
export default useTemporalStore;
