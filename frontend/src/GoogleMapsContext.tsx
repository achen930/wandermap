import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { api } from "./lib/api";

const GoogleMapsContext = createContext<string | null>(null);

export const useGoogleMapsApiKey = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error(
      "useGoogleMapsApiKey must be used within a GoogleMapsProvider"
    );
  }
  return context;
};

export const GoogleMapsProvider = ({ children }: { children: ReactNode }) => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      const res = await api.map.$get();
      if (res.ok) {
        const data = await res.json();
        setGoogleMapsApiKey(data.googleMapsApiKey);
      }
    };

    fetchApiKey();
  }, []);

  return (
    <GoogleMapsContext.Provider value={googleMapsApiKey}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
