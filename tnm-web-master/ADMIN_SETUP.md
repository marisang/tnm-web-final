# Admin Panel - Moderação e Criação de Shows

## Estrutura

A página de administração está localizada em `/admin` e possui dois módulos principais:

### 1. **Moderação de Shows** (`/components/admin/ModerationSection.tsx`)

- Exibe uma lista de shows enviados pelo aplicativo aguardando aprovação
- Cada show é apresentado em um card com:
  - Banner do álbum/show (amarelo por padrão)
  - Título do show
  - Data e horário com ícone de calendário
  - Local com ícone de localização
  - Botões grandes: **APROVAR** (verde) e **RECUSAR** (vermelho)

**Funcionalidades:**
- Clicar em "APROVAR" → Show vai para o feed
- Clicar em "RECUSAR" → Show é marcado como spam
- Lista atualiza em tempo real após cada ação

### 2. **Criar Novo Show** (`/components/admin/CreateShowSection.tsx`)

Formulário idêntico ao do aplicativo com os seguintes campos:

- **Capa do Álbum**: Upload de imagem (drag & drop)
- **Data e Hora**: Campo datetime
- **Endereço**: Texto livre
- **URL da Venda de Ingressos**: URL
- **Whatsapp de Contato**: Telefone
- **Botão CADASTRAR**: Amarelo destacado

## Componentes

```
components/
├── Header.tsx                 # Header purple com logo TNM
├── admin/
│   ├── ModerationSection.tsx  # Lista de shows para moderação
│   ├── CreateShowSection.tsx  # Formulário de criação
│   └── ShowCard.tsx          # Card individual do show
```

## Tipos

Arquivo `types/show.ts` contém interfaces:
- `Show`: Dados de um show completo
- `CreateShowInput`: Dados de entrada para criação

## Como Usar

1. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acessar a página de admin:**
   ```
   http://localhost:3000/admin
   ```

3. **Integrar com API:**
   - Modificar `ModerationSection.tsx` para buscar dados de sua API
   - Adicionar chamadas POST em `CreateShowSection.tsx` para enviar dados
   - Usar `useState` e `useEffect` para carregar dados do servidor

## Exemplo de Integração com API

```typescript
// Em ModerationSection.tsx
useEffect(() => {
  const fetchShows = async () => {
    const res = await fetch('/api/admin/shows/pending');
    const data = await res.json();
    setShows(data);
  };
  fetchShows();
}, []);

const handleApprove = async (id: string) => {
  await fetch(`/api/admin/shows/${id}/approve`, { method: 'POST' });
  setShows(shows.filter(show => show.id !== id));
};
```

## Próximas Etapas

- [ ] Conectar com API de dados
- [ ] Adicionar paginação se houver muitos shows
- [ ] Adicionar filtros (por data, status, etc)
- [ ] Implementar autenticação para acesso ao painel
- [ ] Adicionar notificações de sucesso/erro
- [ ] Fazer upload de imagens para servidor
