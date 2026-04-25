# Checklist QA — Tipografia Right Way

Use este checklist para validar se a nova stack tipográfica (Fraunces, Geist, JetBrains Mono, Caveat) está sendo aplicada corretamente no app completo.

## Globais

- [ ] A página principal da aplicação não apresenta Flash of Unstyled Text (FOUT) evidente para o usuário.
- [ ] O scroll não é interrompido por quebra de layout devido às métricas da fonte.
- [ ] Todas as fontes carregam via `font-display: swap`.
- [ ] Nenhum elemento continua utilizando "Arial", "Roboto" ou outras fontes sistêmicas genéricas acidentalmente.

## Hierarquia Display (Fraunces)

- [ ] Logo "Right Way" usa Fraunces display.
- [ ] Tonalidade da fraude: `font-variation-settings` com `SOFT 50` estão presentes na tag `.font-display`.
- [ ] Títulos grandes do Onboarding estão legíveis.
- [ ] Títulos hero (Ex: "Felipe Explorador") da tela de perfil usam Fraunces perfeitamente.
- [ ] Nomes de Países ("Japão", "Brasil") nos cards de viagens ou feed estão usando a Serif.

## Hierarquia UI (Geist/Sans)

- [ ] Corpos de texto, descrições base estão com `Geist` em `400` weight.
- [ ] Botões estão usando fontWeight `500` - `600` e uppercase onde necessário, limpos e neutros.
- [ ] Tags, Badges e Chips menores usam a variante "label" menor com letter-spacing adicional de `0.08em` a `0.12em`.
- [ ] Modais de confirmação mantêm clareza na leitura no Dark e Light Mode.

## Hierarquia Mono (JetBrains Mono)

- [ ] Códigos de Aeroportos (Ex: `JFK -> GRU`) estão utilizando `JetBrains Mono`.
- [ ] Ligatures nativas da JetBrains estão visíveis (`->` se transformando numa flecha longa).
- [ ] Qualquer número representando uma coordenada (Latitude/Longitude) usa Mono.
- [ ] Números de tabelas com estatísticas de custo (`$500.22`) tabulam perfeitamente.
- [ ] Data de ingresso do usuário (`03 Mar 24`).

## Acceents & Quirks (Caveat)

- [ ] Assinaturas de diários ou notas personalizadas nas viagens aparecem rotacionadas suavemente com a Caveat.
- [ ] "Easter eggs" como o carimbo de 'Primeira Viagem' parece escrito à mão.

## Acessibilidade e Performance

- [ ] Lighthouse Performance Score: Atingido > 95 após a implementação (fontes em Preload otimizadas ou usando cache correto pelo CDN).
- [ ] Componente `Text` renderiza corretamente suporte de alto constraste.
- [ ] Zoom de 200% não corrompe header text overlap.
