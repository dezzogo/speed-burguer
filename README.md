# 🍔 Speed Burguer - Cartão Fidelidade Digital

> **Status do Projeto:** Em Desenvolvimento (MVP Funcional) 🚧

Um sistema web progressivo (PWA) de cartão-fidelidade digital criado para o food-truck Speed Burguer, localizado no Vale das Pedrinhas, Salvador - BA. 

Este projeto substitui os tradicionais cartões de papel por uma solução digital, promovendo sustentabilidade, inclusão digital e modernização do atendimento, inclusive para pedidos via delivery.

---

## 🎯 Contexto Acadêmico

Este projeto integra a **Atividade Extensionista III: Tecnologia Aplicada à Inclusão Digital - Análise** do curso de **Bacharelado em Engenharia de Software** (UNINTER).

A aplicação foi desenhada para atender diretamente aos seguintes Objetivos de Desenvolvimento Sustentável (ODS) da ONU:
* **ODS 09:** Indústria, inovação e infraestrutura.
* **ODS 12:** Consumo e produção responsáveis (Redução do consumo de papel).
* **ODS 17:** Parcerias e meios de implementação.

---

## 🚀 Tecnologias Utilizadas

A arquitetura do projeto foi pensada para ser leve, moderna e de fácil manutenção:

* **Frontend:** [Next.js](https://nextjs.org/) (React) com tipagem em TypeScript.
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) para um design responsivo e *Mobile-First*.
* **Fontes:** `next/font` (Geist Sans e Geist Mono) para otimização de performance.
* **Backend e Banco de Dados (BaaS):** [Supabase](https://supabase.com/) (PostgreSQL).
* **Deploy e Hospedagem:** [Vercel](https://vercel.com/).
* **Métricas:** Google Tag Manager (GTM) integrado para acompanhamento de eventos web.

---

## ✨ Funcionalidades Atuais (MVP)

A versão atual foca na jornada do cliente, permitindo testar a mecânica principal do aplicativo:

- [x] **Cadastro Rápido:** Criação de conta utilizando nome, telefone e senha.
- [x] **Autenticação:** Login via telefone e senha.
- [x] **Dashboard do Cliente:** Interface gamificada exibindo a cartela com 10 espaços para selos (hambúrgueres).
- [x] **Resgate de Selos:** Inserção de código fornecido pelo atendente para ganhar selos na cartela. *(Nota: Na fase atual de testes, utiliza-se um código fixo universal).*

---

## 🗺️ Próximos Passos (Roadmap)

Como o projeto está em evolução para a etapa de implementação completa, as seguintes funcionalidades estão no roteiro de desenvolvimento:

- [ ] **Visão do Administrador (Atendente):** Interface dedicada para os funcionários do food-truck.
- [ ] **Geração Dinâmica de Códigos:** Sistema seguro onde o admin gera um código único e temporário para cada compra, evitando fraudes.
- [ ] **Recuperação de Senha:** Fluxo para o cliente redefinir a senha através de link seguro ou SMS.
- [ ] **Validação de Resgate de Prêmio:** Lógica para zerar a cartela quando o cliente atingir 10 selos e resgatar o lanche grátis.

---

## 💻 Como rodar este projeto localmente

Caso deseje clonar o repositório e rodar em sua máquina, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/speed-burguer-app.git](https://github.com/SEU_USUARIO/speed-burguer-app.git)
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd speed-burguer-app
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto com as chaves do seu banco no Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

6. Abra o navegador e acesse [http://localhost:3000](http://localhost:3000).