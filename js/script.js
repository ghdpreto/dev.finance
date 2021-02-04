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

// localStorage
const Storage = {
  get() {
    // pega os valores do localstorage, passa para array, caso não tenha cria um array vazio
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transactions) {
    // colocando os valores no localstorage, transformando de array para string
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};

// array de transacoes (valores)
//const transactions = [];

// calculos matematicos
const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    //debug
    //console.log(Transaction.all);

    App.reload();
  },
  remove(index) {
    // removendo valor da posicao informada do array
    Transaction.all.splice(index, 1);

    App.reload();
  },

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
    tr.innerHTML = this.innerHTMLTransaction(transaction, index);
    // add index no tr
    tr.dataset.index = index;

    // adicionando no html
    DOM.transactionContainer.appendChild(tr);
  },

  // criando o modelo html
  innerHTMLTransaction(transaction, index) {
    // css caso o valor seja positivo ou negativo
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
              <td class="description">${transaction.description}</td>
              <td class=${CSSclass}>${amount}</td>
              <td class="date">${transaction.date}</td>
              <td> <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação"></td>
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

  clearTransactions() {
    DOM.transactionContainer.innerHTML = "";
  },

  notFoundTransactions(value) {
    const transactionNotFound = document.getElementById(
      "transaction-not-found"
    );
    const transaction = document.getElementById("transaction");

    if (value) {
      // esconde o aviso
      transactionNotFound.style.display = "none";
      //exibe as transacoes
      transaction.style.display = "block";
    } else {
      // exibe o aviso
      transactionNotFound.style.display = "block";
      //esconde as transacoes
      transaction.style.display = "none";
    }
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

  formatAmount(value) {
    value = Number(value) * 100;

    return value;
  },

  formatDate(date) {
    // separando a data
    const splittedDate = date.split("-");

    // dia mes ano
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
};

const Form = {
  //propriedades pegando o campo (html) para extração dos dados
  description: document.getElementById("description"),
  amount: document.getElementById("amount"),
  date: document.getElementById("date"),
  signalExpense: document.getElementById("expense"),

  // pegar os dados do formulario
  getValues() {
    let result;

    if (Form.signalExpense.checked) {
      result = {
        description: Form.description.value,
        amount: "-" + Form.amount.value,
        date: Form.date.value,
      };
    } else {
      result = {
        description: Form.description.value,
        amount: Form.amount.value,
        date: Form.date.value,
      };
    }

    return result;
  },

  validateFields() {
    //desestruturação de dados (usando somente o que é preciso)
    const { description, amount, date } = Form.getValues();

    //removendo o sinal para validar se o campo contem dados
    const validate = amount.replace("-", "");

    // trim => removendo os espaços em branco
    if (
      validate === "" ||
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      // if algum estiver vazio, retorna um erro
      throw new Error("Preencha os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  saveTransaction(value) {
    Transaction.add(value);
    alert(`Transação adicionada com sucesso ${value.description}`);
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  // capturando o evento do html
  submit(event) {
    event.preventDefault();

    try {
      // verificar se os campos foram preenchidos
      Form.validateFields();
      // formartar os dados para salvar
      const data = Form.formatValues();
      // salvar os dados
      Form.saveTransaction(data);
      // limpar o formulario
      Form.clearFields();
      // fechar o modal e retorno de sucess para o usuário
      Modal.close();
      // atualizar o app
      App.reload();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    if (Transaction.all.length > 0) {
      DOM.notFoundTransactions(true);
      // loop para adicionar conforme o array de transações
      Transaction.all.forEach((transaction, index) => {
        DOM.addTransaction(transaction, index);
      });
      // atualizando o local storage
      Storage.set(Transaction.all);
    } else {
      DOM.notFoundTransactions(false);
      // atualizando o local storage
      Storage.set(Transaction.all);

      // atualiza os valores totais
      DOM.updateBalance();
    }
  },

  reload() {
    // limpando as transacoes
    DOM.clearTransactions();
    // chama o app novamente
    App.init();
  },
};

// iniciando a aplicacao
App.init();
