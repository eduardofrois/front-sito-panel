Aqui está o conteúdo totalmente formatado em **Markdown**, pronto para usar como documentação oficial, painho:

---

# **Fluxo Operacional: Solicitation, Orders, Contas e Conferência**

## **1. Solicitation (Agrupamento de Pedidos)**

A **Solicitation** atua como o agrupador dos pedidos criados pelo usuário.
Ao iniciar uma nova solicitação, ela começa com o array `orders` vazio.
Cada pedido adicionado simplesmente referencia seu próprio ID dentro da solicitação.

**Estados e operações:**

* **Criação da Solicitation:** `solicitation.orders = []`
* **Adicionar Order:** inclusão do ID da Order no array `orders`

---

## **2. Ciclo de Vida da Order**

Cada **Order** possui seu próprio fluxo independente dentro da Solicitation.

### **2.1 Criação da Order**

Ao ser criada, a Order inicia com:

* `status = Compra Pendente`
* `status_conference = null`
* `date_order = null`
* `date_purchase_order = null`
* `date_conference = null`

---

### **2.2 Compra Realizada**

Quando a compra é marcada como realizada:

* `status → Compra Realizada`
* `date_order` é preenchido
* O sistema cria automaticamente um registro em **Contas a Pagar**, calculado como:
  `cost_price * amount`

---

### **2.3 Efetivar Compra**

Ao efetivar (quitar) a compra:

* `status → Compra Quitada`
* `date_purchase_order` é preenchido
* `status_conference → A Conferir`
* A baixa em **Contas a Pagar** é realizada automaticamente

---

### **2.4 Conferência**

Após a compra estar quitada, a Order entra no fluxo de conferência:

**Aguardando conferência**

* `status_conference = A Conferir`

**Conferência concluída**

* `status_conference = Conferido`
* `date_conference` é preenchido

---

### **2.5 Fluxo Alternativo: Cliente Desistiu**

Caso o cliente desista:

* `status → Pronta a Entrega`
* O cliente é desvinculado da Order
* É criado um registro em **Contas a Receber**, vinculado ao estoque de pronta entrega

---

## **3. Contas a Pagar**

### **3.1 Geração**

Criada automaticamente quando a Order muda para **Compra Realizada**:

* valor = `cost_price * amount`
* vinculada à Order

### **3.2 Baixa**

A baixa é feita quando a Order passa para **Compra Quitada**.

---

## **4. Contas a Receber (Pronta Entrega)**

Acontece exclusivamente quando o cliente desiste.

* A Order é transformada em **Pronta a Entrega**
* O cliente é removido
* Gera-se uma Conta a Receber associada ao estoque de pronta entrega

---

## **5. Relações Gerais do Fluxo**

* **Solicitation** apenas agrega as Orders.
* **Orders** podem gerar contas a pagar ou contas a receber, dependendo do fluxo.
* O fluxo de **conferência** só ocorre após o pedido estar **quitado**.
* O fluxo de **Pronta Entrega** só ocorre quando há desistência do cliente.

---
