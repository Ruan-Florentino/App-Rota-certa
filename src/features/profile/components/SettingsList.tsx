import React from 'react';
import { ChevronRight, User, Settings2, Globe2, DollarSign, Heart, History, Wallet, HelpCircle, Shield, Info } from 'lucide-react';

const Item = ({ icon: Icon, title, sub, color }: any) => (
  <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-[20px] p-[16px] flex items-center justify-between mb-[8px] cursor-pointer hover:bg-white/5 transition-colors">
    <div className="flex items-center gap-[16px]">
      <div className={`w-[40px] h-[40px] rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-white text-[14px] font-bold uppercase">{title}</h4>
        <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider">{sub}</span>
      </div>
    </div>
    <ChevronRight size={20} className="text-[#5A6178]" />
  </div>
);

export default function SettingsList() {
  return (
    <div className="pt-[24px]">
      <div className="mb-[24px]">
         <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-[0.2em] mb-[12px] block ml-[8px]">Conta</span>
         <Item icon={User} title="Dados Pessoais" sub="Editar nome, foto e contatos" color="text-[#7DD3FC]" />
         <Item icon={Settings2} title="Preferências de Viagem" sub="Personalize seu estilo" color="text-[#A855F7]" />
         <Item icon={Globe2} title="Idioma" sub="PT-BR" color="text-[#7DD3FC]" />
         <Item icon={DollarSign} title="Moeda Padrão" sub="BRL" color="text-[#A855F7]" />
      </div>

      <div className="mb-[24px]">
         <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-[0.2em] mb-[12px] block ml-[8px]">Viagens</span>
         <Item icon={Heart} title="Destinos Favoritos" sub="Lugares que você amou" color="text-[#A855F7]" />
         <Item icon={History} title="Histórico de Viagens" sub="Suas aventuras passadas" color="text-[#7DD3FC]" />
         <Item icon={Wallet} title="Orçamentos Salvos" sub="Planejamentos Financeiros" color="text-[#7DD3FC]" />
      </div>

      <div>
         <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-[0.2em] mb-[12px] block ml-[8px]">Suporte & Mais</span>
         <Item icon={HelpCircle} title="Central de Ajuda" sub="Dúvidas frequentes e suporte" color="text-gray-400" />
         <Item icon={Shield} title="Privacidade" sub="Termos e políticas" color="text-gray-400" />
         <div className="bg-[#141928]/60 backdrop-blur-xl border border-white/5 rounded-[20px] p-[16px] flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-[16px]">
            <div className="w-[40px] h-[40px] rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
              <Info size={20} />
            </div>
            <div>
              <h4 className="text-white text-[14px] font-bold uppercase">Sobre o App</h4>
              <span className="text-[#5A6178] text-[10px] uppercase font-bold tracking-wider" style={{ fontFamily: '"JetBrains Mono", monospace' }}>VERSÃO 3.0.0</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#5A6178]" />
        </div>
      </div>
    </div>
  );
}
