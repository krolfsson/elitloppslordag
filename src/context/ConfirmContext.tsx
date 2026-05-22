import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ConfirmDialog,
  type ConfirmVariant,
} from "../components/ui/ConfirmDialog";

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
};

type ConfirmState = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);
  const resolving = useRef(false);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolving.current = false;
      setState({ ...options, resolve });
    });
  }, []);

  const finish = useCallback((value: boolean) => {
    if (resolving.current || !state) return;
    resolving.current = true;
    state.resolve(value);
    setState(null);
  }, [state]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog
        open={!!state}
        title={state?.title ?? ""}
        message={state?.message ?? ""}
        confirmLabel={state?.confirmLabel}
        cancelLabel={state?.cancelLabel}
        variant={state?.variant}
        onConfirm={() => finish(true)}
        onCancel={() => finish(false)}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm måste användas inom ConfirmProvider");
  }
  return ctx;
}
