import { createStore } from "zustand/vanilla";

export type LayoutState = {

  selectedSidebarPage: string;
  globalLoading: boolean;
};

export type LayoutActions = {
  selectActiveSidebarPage: (page: string) => void;
  setGlobalLoading: (loading: boolean) => void;
};

export type LayoutStore = LayoutState & LayoutActions;



const defaultInitState: LayoutState = {
  selectedSidebarPage:  '',
  globalLoading: false,
};



export const createLayoutStore = (
  initState: LayoutState = defaultInitState
) => {
  return createStore<LayoutStore>()((set) => ({
    ...initState,
    selectActiveSidebarPage: (page) => {
      set((state) => ({ ...state, selectedSidebarPage: page }));
    },
    setGlobalLoading: (loading) => {
      set((state) => ({ ...state, globalLoading: loading }));
    },
  }));
};
