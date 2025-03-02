'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type CustomersStore, createCustomersStore } from '@/stores/customers'

export type CustomersStoreApi = ReturnType<typeof createCustomersStore>

export const CustomersStoreContext = createContext<CustomersStoreApi | undefined>(
  undefined,
)

export interface CustomersStoreProviderProps {
  children: ReactNode
}

export const CustomersStoreProvider = ({
  children,
}: CustomersStoreProviderProps) => {
  const storeRef = useRef<CustomersStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createCustomersStore()
  }

  return (
    <CustomersStoreContext.Provider value={storeRef.current}>
      {children}
    </CustomersStoreContext.Provider>
  )
}

export const useCustomersStore = <T,>(
  selector: (store: CustomersStore) => T,
): T => {
  const customersStoreContext = useContext(CustomersStoreContext)

  if (!customersStoreContext) {
    throw new Error(`useLayoutStore must be used within LayoutStoreProvider`)
  }

  return useStore(customersStoreContext, selector)
}