import { motion } from "framer-motion";

const SectionCard = ({ title, subtitle, action, children, className = "" }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`glass-panel p-6 ${className}`}
  >
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </motion.section>
);

export default SectionCard;
