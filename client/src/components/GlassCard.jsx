const GlassCard = ({ children, className }) => {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg 
      border border-white/20 
      rounded-2xl p-6 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
