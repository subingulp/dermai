import { createContext, useContext } from 'react';

// Lets the Modal render inside the phone frame (instead of covering the whole browser window).
export const DeviceContext = createContext(null);
export const useDeviceRoot = () => useContext(DeviceContext);
