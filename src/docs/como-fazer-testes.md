# Como fazer os testes do sistema

Este documento descreve o passo a passo para testar o fluxo completo do sistema, do cadastro de vendas até contas a receber.

---

## Pré-requisitos

- Backend rodando (`dotnet watch` ou `dotnet run` no ServiceSitoPanel).
- Frontend rodando (`pnpm dev` no front-sitopanel).
- Usuário logado no painel.

---

## 1. Vendas (criar pedidos)

**Onde:** Módulo **Vendas** (ou tela onde se criam pedidos).

**O que fazer:**

1. Acesse o módulo de Vendas.
2. Crie um ou mais pedidos (informe cliente, fornecedor, produto, quantidade, preço de custo, preço de venda, etc.).
3. Salve os pedidos.

**O que validar:**

- Os pedidos aparecem na listagem com status **Compra Pendente**.
- A tela é basicamente de leitura; não há ações de mudança de status aqui.

---

## 2. Compras (realizar compra)

**Onde:** Módulo **Compras**.

**O que fazer:**

1. Acesse o módulo Compras.
2. Verifique as linhas agrupadas por fornecedor/produto (alimentadas pelas vendas).
3. Use os filtros se quiser (Produto, Fornecedor, Status da compra, Status do pagamento).
4. Na coluna **Realizar compra**, marque o checkbox das linhas que estão com status **Compra Pendente**.
5. Clique no botão **Realizar Compra**.

**O que validar:**

- As linhas selecionadas passam a ter status da compra **Compra Realizada**.
- Os pedidos relacionados passam a ter status de conferência **A Conferir**.

**Opcional:** Marque o checkbox de pagamento nas linhas que têm valor a pagar para registrar pagamento à fábrica (Parcial ou Totalmente Pago).

---

## 3. Pronta Entrega – Aba Recebimento (conferência)

**Onde:** Módulo **Pronta Entrega** → aba **Recebimento de Mercadoria**.

**O que fazer:**

1. Acesse o módulo Pronta Entrega e abra a aba Recebimento.
2. Verifique a lista de pedidos com status de conferência **A Conferir** (incluindo os que você realizou compra no passo anterior).
3. Selecione os pedidos que foram conferidos na prática (checkbox).
4. Clique no botão de **Confirmar** (conferência).

**O que validar:**

- Os pedidos selecionados passam a ter status de conferência **Conferido**.
- Eles passam a aparecer na aba **Entregas**.

---

## 4. Pronta Entrega – Aba Entregas (destino do pedido)

**Onde:** Módulo **Pronta Entrega** → aba **Entregas**.

**O que fazer:**

1. Abra a aba Entregas.
2. Verifique a lista de pedidos com status de conferência **Conferido** (e também os que já estão Entregue ao Cliente ou Pronta a Entrega).
3. Na coluna **Status**, confira o status de cada pedido (Conferido, Entregue ao Cliente, Pronta a Entrega).
4. Para pedidos que ainda **não** estão entregues nem em pronta entrega:
   - Clique em **Entregue ao cliente** ou **Pronta entrega** conforme o destino real.
5. Clique em **Confirmar Destino**.

**O que validar:**

- Pedidos marcados como **Entregue ao cliente** ficam com status **Entregue ao Cliente** e na coluna de ação aparece **Já entregue** (sem nova seleção).
- Pedidos marcados como **Pronta entrega** ficam com status **Pronta a Entrega** e na coluna aparece **Pronta entrega** (sem nova seleção).
- Pedidos já entregues ou já em pronta entrega não exibem os botões de seleção novamente.

---

## 5. Conciliação – Contas a Pagar (pagamento fábrica)

**Onde:** Módulo **Conciliação** → aba **Contas a Pagar**.

**O que fazer:**

1. Acesse Conciliação e abra a aba Contas a Pagar.
2. Verifique a lista de pedidos (por status da compra e do pagamento: Compra Pendente, Compra Realizada, Pagamento Parcial, etc.).
3. Para quitar o pagamento à fábrica, use a ação **Efetivar Compra** (ou o fluxo de registro de pagamento) nos pedidos em Compra Realizada ou com valor a pagar.

**O que validar:**

- Ao quitar, o status do pedido vai para **Compra Quitada** e o status de conferência para **A Conferir** (o pedido volta ao fluxo de conferência na aba Recebimento).

---

## 6. Conciliação – Contas a Receber (pagamento cliente)

**Onde:** Módulo **Conciliação** → aba **Contas a Receber**.

**O que fazer:**

1. Abra a aba Contas a Receber.
2. Verifique a lista de pedidos **Entregue ao Cliente** (pendentes de pagamento do cliente).
3. Registre o pagamento do cliente (parcial ou total) conforme a tela permitir.

**O que validar:**

- Pedidos com pagamento total (Pagamento Quitado) podem ser considerados finalizados.
- Pedidos com pagamento parcial continuam como **Venda a Receber** até a quitação total.

---

## Ordem sugerida para um teste completo

1. **Vendas** → criar 1 ou 2 pedidos (Compra Pendente).
2. **Compras** → selecionar essas linhas e clicar em **Realizar Compra** (ficam Compra Realizada e A Conferir).
3. **Pronta Entrega → Recebimento** → selecionar esses pedidos e **Confirmar** conferência (ficam Conferido).
4. **Pronta Entrega → Entregas** → escolher **Entregue ao cliente** ou **Pronta entrega** e **Confirmar Destino** (Status e coluna de ação refletem o estado correto).
5. **Conciliação → Contas a Pagar** → testar Efetivar Compra / registro de pagamento fábrica em algum pedido.
6. **Conciliação → Contas a Receber** → testar registro de pagamento do cliente nos pedidos entregues.

Seguindo essa ordem você percorre todo o fluxo: **Vendas → Compras → Conferência (Recebimento) → Destino (Entregas) → Contas a Pagar → Contas a Receber**.
