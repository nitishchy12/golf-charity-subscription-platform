import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const ToastViewport = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-2xl ${
              toast.variant === "error"
                ? "border-rose-400/40 bg-rose-500/10 text-rose-100"
                : "border-brand-400/30 bg-brand-400/10 text-brand-50"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
