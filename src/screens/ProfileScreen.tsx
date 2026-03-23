import React from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Camera,
  Award,
  Globe,
  Wallet,
  Heart,
  History,
  Languages,
  Coins,
  Lock,
  Eye,
  RefreshCw,
  Download,
  Share2,
  MapPin,
  Plane,
  CreditCard,
  Info,
  Calendar
} from 'lucide-react';
import { 
  MobileContainer, 
  AnimatedContainer, 
  NeonCard, 
  GlowButton,
  BlurCard
} from '../components/MobileUI';
import { useStore } from '../store/useStore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
  color?: string;
  delay?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, description, onClick, color = 'text-primary', delay = 0 }) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02, x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass-card p-4 rounded-[24px] flex items-center justify-between border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="flex items-center gap-4 relative z-10">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:bg-primary group-hover:text-background transition-all duration-300 shadow-lg`}>
        {icon}
      </div>
      <div className="text-left">
        <h4 className="text-[15px] font-black text-white group-hover:text-primary transition-colors">{label}</h4>
        <p className="text-[11px] font-medium text-subtext group-hover:text-white/60 transition-colors">{description}</p>
      </div>
    </div>
    
    <motion.div
      animate={{ x: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <ChevronRight className="w-5 h-5 text-subtext group-hover:text-primary transition-colors" />
    </motion.div>
  </motion.button>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-[12px] font-black text-primary uppercase tracking-[0.3em] mb-4 mt-2 px-2">
    {title}
  </h3>
);

export const ProfileScreen: React.FC = () => {
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/');
  };

  const stats = [
    { label: 'Viagens', value: '12', icon: <Plane className="w-4 h-4" /> },
    { label: 'Países', value: '8', icon: <Globe className="w-4 h-4" /> },
    { label: 'Média', value: 'R$ 3.2k', icon: <Wallet className="w-4 h-4" /> },
  ];

  return (
    <div className="py-6">
      {/* Logo & Header */}
      <div className="flex items-center justify-between mb-8">
        <Logo size="sm" />
        <motion.button 
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
        >
          <Settings className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex flex-col gap-8 pb-32">
        {/* Profile Header Card */}
        <AnimatedContainer delay={0.1}>
          <NeonCard className="p-0 overflow-hidden bg-gradient-to-b from-primary/10 to-background border-primary/20">
            <div className="p-8 flex flex-col items-center text-center relative">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative mb-6">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative w-32 h-32 rounded-[40px] border-4 border-primary/30 p-1.5 bg-background/50 backdrop-blur-xl shadow-2xl"
                >
                  <img 
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=00E5FF&color=020617&size=256&bold=true`} 
                    alt={user?.displayName}
                    className="w-full h-full rounded-[32px] object-cover"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-2 -right-2 w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-background border-4 border-background shadow-xl"
                  >
                    <Camera className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-[28px] font-black text-white tracking-tight mb-1">{user?.displayName || 'João Silva'}</h2>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-[12px] font-bold text-subtext">Brasil</span>
                </div>
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-8">Membro desde 2026</p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="glass-card p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-primary mb-1">{stat.icon}</div>
                    <span className="text-[18px] font-black text-white leading-none">{stat.value}</span>
                    <span className="text-[9px] font-bold text-subtext uppercase tracking-widest">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </NeonCard>
        </AnimatedContainer>

        {/* Menu Sections */}
        <div className="space-y-8">
          {/* Section: Desenvolvedor */}
          <div>
            <SectionTitle title="Desenvolvedor" />
            <div className="flex flex-col gap-3">
              <MenuItem 
                icon={<Camera className="w-6 h-6" />} 
                label="Gerador de Mockup 4K" 
                description="Gerar screenshot para App Store"
                onClick={() => navigate('/mockup')}
                delay={0.35}
                color="text-accent"
              />
            </div>
          </div>

          {/* Section: Conta */}
          <div>
            <SectionTitle title="Conta" />
            <div className="flex flex-col gap-3">
              <MenuItem 
                icon={<User className="w-6 h-6" />} 
                label="Dados Pessoais" 
                description="Editar nome, foto e contatos"
                delay={0.4}
              />
              <MenuItem 
                icon={<Settings className="w-6 h-6" />} 
                label="Preferências de Viagem" 
                description="Personalize seu estilo de viagem"
                delay={0.45}
                color="text-secondary"
              />
              <MenuItem 
                icon={<Languages className="w-6 h-6" />} 
                label="Idioma" 
                description="Português (Brasil)"
                delay={0.5}
                color="text-accent"
              />
              <MenuItem 
                icon={<Coins className="w-6 h-6" />} 
                label="Moeda Padrão" 
                description="Real Brasileiro (BRL)"
                delay={0.55}
                color="text-yellow-400"
              />
            </div>
          </div>

          {/* Section: Viagens */}
          <div>
            <SectionTitle title="Viagens" />
            <div className="flex flex-col gap-3">
              <MenuItem 
                icon={<Heart className="w-6 h-6" />} 
                label="Destinos Favoritos" 
                description="Lugares que você amou"
                delay={0.6}
                color="text-red-400"
              />
              <MenuItem 
                icon={<History className="w-6 h-6" />} 
                label="Histórico de Viagens" 
                description="Suas aventuras passadas"
                delay={0.65}
                color="text-blue-400"
              />
              <MenuItem 
                icon={<CreditCard className="w-6 h-6" />} 
                label="Orçamentos Salvos" 
                description="Planejamentos financeiros"
                delay={0.7}
                color="text-emerald-400"
              />
            </div>
          </div>

          {/* Section: App */}
          <div>
            <SectionTitle title="App" />
            <div className="flex flex-col gap-3">
              <MenuItem 
                icon={<Bell className="w-6 h-6" />} 
                label="Notificações" 
                description="Alertas de preços e viagens"
                delay={0.75}
                color="text-purple-400"
              />
              <MenuItem 
                icon={<Lock className="w-6 h-6" />} 
                label="Segurança" 
                description="Biometria e acesso"
                delay={0.8}
                color="text-orange-400"
              />
              <MenuItem 
                icon={<Eye className="w-6 h-6" />} 
                label="Privacidade" 
                description="Controle de seus dados"
                delay={0.85}
                color="text-cyan-400"
              />
            </div>
          </div>

          {/* Section: Suporte & Ações */}
          <div>
            <SectionTitle title="Suporte & Mais" />
            <div className="flex flex-col gap-3">
              <MenuItem 
                icon={<HelpCircle className="w-6 h-6" />} 
                label="Ajuda" 
                description="Central de suporte 24/7"
                delay={0.9}
                color="text-indigo-400"
              />
              <MenuItem 
                icon={<Info className="w-6 h-6" />} 
                label="Sobre o RotaCerta" 
                description="Versão, termos e licenças"
                delay={0.95}
                color="text-slate-400"
              />
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-2"
                >
                  <Download className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Exportar</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-2"
                >
                  <Share2 className="w-5 h-5 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Compartilhar</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 glass-card rounded-3xl border border-red-500/20 flex items-center justify-center gap-3 text-red-400 mt-4"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-[12px] font-black uppercase tracking-widest">Resetar Aplicativo</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full h-16 glass-card rounded-[32px] flex items-center justify-center gap-3 text-red-500 border border-red-500/30 shadow-lg mt-2"
              >
                <LogOut className="w-6 h-6" />
                <span className="text-[14px] font-black uppercase tracking-widest">Encerrar Sessão</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-8">
          <Logo size="sm" showText={false} />
          <div className="text-center">
            <p className="text-[10px] font-black text-subtext uppercase tracking-[0.4em] opacity-50">
              RotaCerta v3.0.0
            </p>
            <p className="text-[8px] font-bold text-subtext uppercase tracking-widest mt-1 opacity-30">
              Made with ❤️ for Travelers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
