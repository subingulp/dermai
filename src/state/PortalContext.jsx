// Lets modals render inside the phone-sized frame instead of the whole page.

import { createContext, useContext } from 'react'

export const PortalContext = createContext(null)
export const usePortalHost = () => useContext(PortalContext)
