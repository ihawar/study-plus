import { createContext, useContext, useState, type ReactNode } from "react";
import Alert from "../components/Alert";
import { v4 as uuidv4 } from "uuid";

type AlertType = "success" | "error" | "info";

type AlertItem = {
  id: string;
  message: string;
  type: AlertType;
};

type AlertContextType = {
  showAlert: (message: string, type?: AlertType) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
  return ctx;
};

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = (message: string, type: AlertType = "info") => {
    const id = uuidv4();
    const newAlert = { id, message, type };
    setAlerts((prev) => [...prev, newAlert]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 10_000);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100 space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
      {children}
    </AlertContext.Provider>
  );
}
