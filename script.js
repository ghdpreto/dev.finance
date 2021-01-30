const Modal = {
  open() {
    const modal = document.querySelector(".modal-overlay");
    modal.classList.add("active");

    const modal_box = document.querySelector(".modal");
    modal_box.classList.add("animate-up");
  },
  close() {
    const modal = document.querySelector(".modal-overlay");
    modal.classList.remove("active");

    const modal_box = document.querySelector(".modal");
    modal_box.classList.remove("animate-up");
  },
};

// array de transacoes (valores)
const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -50000,
    date: "23/01/2021",
  },
  {
    id: 2,
    description: "Criação web site",
    amount: 100000,
    date: "21/01/2021",
  },
  {
    id: 3,
    description: "Internet",
    amount: -20000,
    date: "15/01/2021",
  },
];

// calculos matematicos
const Transaction = {
    all: transactions,
  incomes() {
    // somar as entradas
    let income = 0;

    //pegar todas as transações (array)
    Transaction.all.forEach((transaction) => {
      // verificar se o valor é positivo
      if (transaction.amount > 0) {
        // somar todos os valores
        income += transaction.amount;
      }
    });

    // retornar o valor
    return income;
  },
  expenses() {
    // somar as saidas
    let expense = 0;

    // pegar todas as transações (array)
    Transaction.all.forEach((transaction) => {
      // verificar se o valor é negativo
      if (transaction.amount < 0) {
        // somando os valores negativos
        expense += transaction.amount;
      }
    });
    //retornar o valor
    return expense;
  },
  total() {
    // valor total (entrada - saida)
    let total = 0;

    // diferenca da saida + entrada
    total = this.expenses() + this.incomes();

    return total;
  },
};

// colocar os valores do js no html de forma dinamica
const DOM = {
  transactionContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    // debug
    //console.log(transaction.amount);

    //criando o elemento tr (html)
    const tr = document.createElement("tr");
    // adicionando o td no tr (html)
    tr.innerHTML = this.innerHTMLTransaction(transaction);

    // adicionando no html
    DOM.transactionContainer.appendChild(tr);
  },

  // criando o modelo html
  innerHTMLTransaction(transaction) {
    // css caso o valor seja positivo ou negativo
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
              <td class="description">${transaction.description}</td>
              <td class=${CSSclass}>${amount}</td>
              <td class="date">${transaction.date}</td>
              <td> <img src="./assets/minus.svg" alt="Remover transação"></td>
        `;
    // retornando a estrutura dos td
    return html;
  },

  // atualizando os cards entrada saida total
  updateBalance() {
    // pegando os elementos pelo id adicionando os valores
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );

    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );

    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },
};

//utilidades, formatacao dos valores
const Utils = {
  formatCurrency(value) {
    //add sinal de negativo
    const signal = Number(value) < 0 ? "-" : "";

    // transformando em string para remocao dos caracteres especiais
    //value = String(value).replace("-", "")
    value = String(value).replace(/\D/g, ""); //regex

    value = Number(value) / 100;

    //transformando em moeda
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

// loop para adicionar conforme o array de transações
transactions.forEach((transaction) => {
  DOM.addTransaction(transaction);
});
// teste
//DOM.addTransaction(transactions[0], transactions.length)

DOM.updateBalance();
