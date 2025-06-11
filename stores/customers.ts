import { createStore } from "zustand/vanilla";

import { type User } from "@/lib/types/user";
import { verifySession } from "@/lib/dal";
import { fakeBackend } from "@/lib/axios";

export type CustomersState = {
  customers: User[];
  loaded: boolean;
  error: Error | null;
  success: string | null;
  filter: {
    slug: string;
    caller: string;
  };
};

export type CustomersActions = {
    retrieveCustomers: (router: any) => void;
    reset: () => void;
};

export type CustomersStore = CustomersState & CustomersActions;

const defaultInitState: CustomersState = {
  customers: [],
  loaded: false,
  error: null,
  success: null,
  filter: {
    slug: "All Links",
    caller: "",
  },
};

export const createCustomersStore = (
  initState: CustomersState = defaultInitState
) => {
  return createStore<CustomersStore>()((set, get) => ({
    ...initState,
    retrieveCustomers: async (router) => {
        try {
          set((prevState) => ({
            ...prevState,
            loaded: false,
          }));
          const session = await verifySession();
  
          if (!session) return router.replace("/users/sign_in");
  
          const path = `/api/v1/admin/users`;
  
          const response: { message: string; users: User[] } =
            await fakeBackend.get(path);
  
          set((prevState) => ({
            ...prevState,
            loaded: true,
            customers: response.users,
            success: response.message,
          }));
        } catch (error) {
          set((prevState) => ({
            ...prevState,
            loaded: true,
            error: error instanceof Error ? error : new Error(String(error)),
          }));
        }
      },

    reset: () => {
        set((prevState) => ({
          ...prevState,
          error: null,
          success: null,
        }));
      },
  }));
};
