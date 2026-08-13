import AppHeader from "@/components/AppHeader";
import { motion } from "framer-motion";

interface AppHeaderSectionProps {
  userName?: string;
  userProfile?: any;
  onCameraClick?: () => void;
  onLogout?: () => void;
}

const AppHeaderSection = ({ userName, userProfile, onCameraClick, onLogout }: AppHeaderSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="app-header"
    >
      <AppHeader onCameraClick={onCameraClick} onLogout={onLogout} />
      {userName && (
        <div className="text-center py-4">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold text-ghibli-forest font-ghibli"
          >
            Welcome back, {userName}! 🎨
          </motion.h2>
          {userProfile?.display_name && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-ghibli-forest/70 mt-2"
            >
              Ready to explore more beautiful colors?
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AppHeaderSection;