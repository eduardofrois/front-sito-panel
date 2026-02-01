# Fluxo Operacional do Sistema

## Status (Enum)

**Status do pedido (compra/venda):**

* `PendingPurchase` → Compra Pendente
* `ConfirmSale` → Compra Realizada
* `ToCheck` → A Conferir
* `Checked` → Conferido
* `ReadyForDelivery` → Pronta a Entrega
* `DeliveredToClient` → Entregue ao Cliente

**Pagamento:**

* `PartialPayment` → Pagamento Parcial
* `FullyPaid` → Pagamento Quitado

**Financeiro:**

* `PaidPurchase` → Compra Quitada (pagamento fábrica)
* `SaleToRecive` → Venda a Receber

---

## 1. Vendas

* Cria o pedido inicial.
* Pedido nasce com status **Compra Pendente** (`PendingPurchase`).
* Tabela é somente leitura; nenhuma ação operacional acontece aqui.

---

## 2. Compras (alimentado por Vendas)

**Responsabilidades:**

* Agrupar produtos por fornecedor.
* Mostrar quantidade total por produto.

**Status da compra:**

* `PendingPurchase` (Compra Pendente)
* `ConfirmSale` (Compra Realizada)

**Status pagamento fábrica:**

* `PaidPurchase` (Compra Quitada)
* `PartialPayment` (Pagamento Parcial)
* `FullyPaid` (Pagamento Quitado)

**Funcionalidades:**

* Filtros: Produto, Fornecedor, Status da compra, Status pagamento fábrica.
* Seleção de múltiplas linhas com status **Compra Pendente**.
* Botão **Realizar Compra**.

**Ação "Realizar Compra":**

* Atualiza status: `PendingPurchase` → `ConfirmSale`.
* Atualiza automaticamente os pedidos relacionados: `status_conference` → **A Conferir** (`ToCheck`).
* Endpoint: `PATCH /orders/realizar-compra` (body: `orderIds[]`).
* Checkbox por linha para controlar pagamento da fábrica: `PartialPayment` / `FullyPaid` (via `PATCH /purchases/update-payment`).

---

## 3. Conferência (módulo Pronta Entrega – Aba 1)

* Lista pedidos com `status_conference = "A Conferir"` (`ToCheck`).
* Usuário realiza a conferência e, ao finalizar, atualiza: `ToCheck` → **Conferido** (`Checked`).
* No backend: `PUT /orders?value=8` atualiza `status_conference` e `date_conference`.

---

## 4. Pronta Entrega (módulo Pronta Entrega – Aba 2)

* Lista pedidos com `status_conference = "Conferido"` (`Checked`).
* Ação: marcar como entregue: `Checked` → **Entregue ao Cliente** (`DeliveredToClient`).
* `ReadyForDelivery` pode ser usado como estado intermediário na UX se fizer sentido.
* No backend: `PUT /orders?value=11` atualiza status e `date_delivery`.

---

## 5. Contas a Pagar (Conciliação)

* Pedidos com status **Compra Realizada**, **Compra Pendente** ou **Pagamento Parcial** (filtros por status da compra e pagamento fábrica).
* Controle de pagamento à fábrica: registrar pagamentos parciais ou quitar (`PaidPurchase`).
* Ao quitar (Efetivar Compra): `status` → **Compra Quitada** e `status_conference` → **A Conferir** (pedido entra no fluxo de conferência).
* Endpoint de pagamento: `PATCH /orders/update-paid-price`.

---

## 6. Contas a Receber (Conciliação)

* Pedidos com status **Entregue ao Cliente** (`DeliveredToClient`).
* Listagem via `GET /orders/pending` (pedidos entregues).
* Controle de pagamento do cliente: `PartialPayment` / `FullyPaid`.
* Ao atingir **Pagamento Quitado** (`FullyPaid`), o pedido pode ser considerado finalizado.
* `SaleToRecive` representa pedidos entregues ainda não totalmente pagos.

---

## 7. Módulos e navegação

* **Vendas** – Criação de pedidos (somente leitura na tabela de listagem).
* **Compras** – Agrupamento por fornecedor, Realizar Compra e registro de pagamento fábrica.
* **Pronta Entrega** – Aba 1: Conferência (A Conferir → Conferido). Aba 2: Entregas (Conferido → Entregue ao Cliente).
* **Conciliação** – Aba Contas a Pagar (pagamento fábrica) e Aba Contas a Receber (pagamento cliente, pedidos entregues).

---

## 8. Endpoints principais

* `PATCH /orders/realizar-compra` – Realizar compra (PendingPurchase → ConfirmSale, status_conference → A Conferir).
* `PUT /orders?value=8` – Conferir pedido (ToCheck → Checked).
* `PUT /orders?value=11` – Marcar como entregue ao cliente.
* `PATCH /orders/update-paid-price` – Atualizar pagamento (cliente ou fábrica, conforme contexto).
* `PATCH /purchases/update-payment` – Registrar pagamento fábrica nas linhas de compra.
* `GET /orders/filter?statusConference=...` – Filtrar pedidos por `status_conference` (ex.: "A Conferir", "Conferido").
