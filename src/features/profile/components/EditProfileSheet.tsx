import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useProfileStore } from '@/store/profileStore';
import { COUNTRIES, getCountryByCode } from '@/data/countries';
import { ImagePicker } from './ImagePicker';
import { FormField, FormTextarea } from './FormField';

interface EditProfileSheetProps {
  open: boolean;
  onClose: () => void;
}

export const EditProfileSheet = ({ open, onClose }: EditProfileSheetProps) => {
  const { profile, updateProfile } = useProfileStore();
  
  // Estado local — só aplica no store quando clicar "Salvar"
  const [draft, setDraft] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);

  // Resetar draft quando abrir
  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(profile);

  const handleSave = async () => {
    setSaving(true);
    // Validações básicas
    if (!draft.name.trim()) {
      console.error('Nome é obrigatório');
      setSaving(false);
      return;
    }
    if (!/^[a-z0-9_.]+$/i.test(draft.username)) {
      console.error('Usuário só pode ter letras, números, _ e .');
      setSaving(false);
      return;
    }
    updateProfile(draft);
    setSaving(false);
    onClose();
  };

  const countryObj = getCountryByCode(draft.countryCode);
  const filteredCountries = countryQuery
    ? COUNTRIES.filter(c => 
        c.name.toLowerCase().includes(countryQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(countryQuery.toLowerCase())
      )
    : COUNTRIES;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 
                       bg-rw-dark border-t border-rw-border
                       rounded-t-3xl max-h-[94vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 shrink-0">
              <div className="w-10 h-1 rounded-full bg-rw-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 
                            border-b border-rw-border shrink-0">
              <button 
                onClick={onClose}
                className="text-rw-muted text-sm font-medium"
              >
                Cancelar
              </button>
              <h2 className="text-rw-text font-semibold">Editar perfil</h2>
              <button 
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="px-4 py-1.5 rounded-full bg-rw-gradient
                           text-rw-black text-sm font-semibold
                           shadow-rw-glow-sm
                           disabled:opacity-40 disabled:shadow-none
                           transition-all"
              >
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
            </div>

            {/* Content (scrollable) */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-5 space-y-6 pb-10">
                
                {/* COVER + AVATAR */}
                <section>
                  <ImagePicker 
                    currentUrl={draft.coverUrl}
                    onSelect={(url) => setDraft({ ...draft, coverUrl: url })}
                    maxWidth={1200}
                  >
                    {({ preview, isLoading, error, trigger }) => (
                      <button
                        onClick={trigger}
                        className="relative w-full h-32 rounded-2xl overflow-hidden
                                   bg-rw-surface border border-rw-border group"
                      >
                        {preview ? (
                          <img 
                            src={preview} 
                            className="w-full h-full object-cover" 
                            alt="Capa"
                          />
                        ) : (
                          <div className="w-full h-full bg-rw-gradient opacity-30" />
                        )}
                        <div className="absolute inset-0 bg-black/40 
                                        opacity-0 group-hover:opacity-100
                                        flex items-center justify-center
                                        transition-opacity">
                          <span className="text-white text-xs font-medium">
                            {isLoading ? 'Carregando…' : '📷 Trocar capa'}
                          </span>
                        </div>
                        {error && (
                          <div className="absolute bottom-2 left-2 right-2 
                                          bg-rw-danger/90 text-white text-xs 
                                          px-2 py-1 rounded">
                            {error}
                          </div>
                        )}
                      </button>
                    )}
                  </ImagePicker>

                  {/* Avatar sobreposto */}
                  <div className="relative -mt-10 ml-4">
                    <ImagePicker
                      currentUrl={draft.avatarUrl}
                      onSelect={(url) => setDraft({ ...draft, avatarUrl: url })}
                      maxWidth={400}
                    >
                      {({ preview, isLoading, trigger }) => (
                        <button
                          onClick={trigger}
                          className="relative w-20 h-20 rounded-full 
                                     border-4 border-rw-dark overflow-hidden
                                     bg-rw-surface block"
                        >
                          {preview ? (
                            <img 
                              src={preview} 
                              className="w-full h-full object-cover"
                              alt="Avatar"
                            />
                          ) : (
                            <div className="w-full h-full bg-rw-gradient 
                                            flex items-center justify-center">
                              <span className="text-rw-black text-2xl font-bold">
                                {(draft.name ?? '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          {isLoading && (
                            <div className="absolute inset-0 bg-black/60 
                                            flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-rw-sky 
                                              border-t-transparent rounded-full 
                                              animate-spin" />
                            </div>
                          )}
                          {/* Badge câmera */}
                          <div className="absolute bottom-0 right-0 
                                          w-6 h-6 rounded-full bg-rw-sky 
                                          border-2 border-rw-dark
                                          flex items-center justify-center
                                          text-[10px]">
                            📷
                          </div>
                        </button>
                      )}
                    </ImagePicker>
                  </div>
                </section>

                {/* NOME */}
                <FormField
                  label="Nome"
                  value={draft.name}
                  onChange={(v) => setDraft({ ...draft, name: v })}
                  maxLength={40}
                  placeholder="Seu nome"
                />

                {/* USERNAME */}
                <FormField
                  label="Usuário"
                  prefix="@"
                  value={draft.username}
                  onChange={(v) => setDraft({ 
                    ...draft, 
                    username: v.toLowerCase().replace(/[^a-z0-9_.]/g, '') 
                  })}
                  maxLength={20}
                  placeholder="seu.usuario"
                />

                {/* BIO */}
                <FormTextarea
                  label="Bio"
                  value={draft.bio}
                  onChange={(v) => setDraft({ ...draft, bio: v })}
                  maxLength={160}
                  placeholder="Uma linha sobre você"
                  rows={3}
                />

                {/* CIDADE + PAÍS */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Cidade"
                    value={draft.city}
                    onChange={(v) => setDraft({ ...draft, city: v })}
                    placeholder="Salvador"
                    maxLength={50}
                  />
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] 
                                      text-rw-muted font-semibold mb-1.5 block">
                      País
                    </label>
                    <button
                      onClick={() => setShowCountryList(!showCountryList)}
                      className="w-full h-11 px-4 bg-rw-surface border border-rw-border
                                 rounded-xl text-left flex items-center gap-2
                                 hover:border-rw-sky transition"
                    >
                      <span className="text-lg">{countryObj?.flag}</span>
                      <span className="text-rw-text text-sm font-medium flex-1 truncate">
                        {countryObj?.name}
                      </span>
                      <span className="text-rw-muted text-xs">▾</span>
                    </button>
                  </div>
                </div>

                {/* Lista de países expansível */}
                {showCountryList && (
                  <div className="rounded-xl bg-rw-surface border border-rw-border 
                                  max-h-72 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-rw-border">
                      <input
                        autoFocus
                        value={countryQuery}
                        onChange={(e) => setCountryQuery(e.target.value)}
                        placeholder="Buscar país…"
                        className="w-full h-9 px-3 bg-rw-dark border border-rw-border
                                   rounded-lg text-sm text-rw-text
                                   placeholder:text-rw-dim focus:outline-none
                                   focus:border-rw-sky"
                      />
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {filteredCountries.slice(0, 50).map(c => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setDraft({ ...draft, countryCode: c.code });
                            setShowCountryList(false);
                            setCountryQuery('');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2
                                     hover:bg-rw-sky/5 transition text-left"
                        >
                          <span className="text-xl">{c.flag}</span>
                          <span className="text-sm text-rw-text flex-1">{c.name}</span>
                          <span className="text-xs text-rw-dim font-mono">{c.code}</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <p className="p-4 text-center text-sm text-rw-muted">
                          Nenhum país encontrado
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* INSTAGRAM */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] 
                                text-rw-muted font-semibold mb-3">
                    Redes sociais
                  </p>
                  <FormField
                    label="Instagram"
                    prefix="@"
                    value={draft.instagram}
                    onChange={(v) => setDraft({ 
                      ...draft, 
                      instagram: (v ?? '').toLowerCase().replace(/[^a-z0-9_.]/g, '') 
                    })}
                    maxLength={30}
                    placeholder="seu.usuario"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
