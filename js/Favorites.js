import { GithubUser } from "./GithubUser.js";

// Class that manages favorite user data | Classe que gerencia os dados dos usuários favoritos
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load(); // Loads data from localStorage | Carrega os dados do localStorage
  }

  load() {
    // Retrieves data stored in localStorage or initializes an empty array if none exists
    // Recupera os dados armazenados no localStorage ou inicia um array vazio caso não existam dados
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    // Saves the favorites list to localStorage | Salva a lista de favoritos no localStorage
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    // Adds a user to the favorites list | Adiciona um usuário à lista de favoritos
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("User already registered!"); // Prevents duplicates | Impede duplicatas
      }

      const user = await GithubUser.search(username);
      if (user.login === undefined) {
        throw new Error("User not found!"); // If the user doesn't exist on GitHub | Se o usuário não existir no GitHub
      }

      this.entries = [user, ...this.entries]; // Adds the new user to the top of the list | Adiciona o novo usuário no topo da lista
      this.update(); // Updates the table view | Atualiza a exibição da tabela
      this.save(); // Saves to localStorage | Salva no localStorage
    } catch (error) {
      alert(error.message); // Displays the error message to the user | Exibe o erro ao usuário
    }
  }

  delete(user) {
    // Removes a user from the favorites list | Remove um usuário da lista de favoritos
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries; // Updates the list without the removed user | Atualiza a lista sem o usuário removido
    this.update(); // Updates the view | Atualiza a exibição
    this.save(); // Updates localStorage | Atualiza o localStorage
  }
}

// Class that manages the graphical interface and HTML events | Classe que gerencia a interface gráfica e os eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root); // Links Favorites class to this class | Liga a classe Favorites a esta classe

    this.tbody = this.root.querySelector("table tbody"); // Selects the table body | Seleciona o corpo da tabela

    this.update(); // Updates the interface | Atualiza a interface
    this.onadd(); // Sets up the event for adding a user | Configura o evento de adicionar usuário
  }

  onadd() {
    // Event listener to handle the click on the add-user button | Evento para capturar o clique no botão de adicionar usuário
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value); // Adds the user when the button is clicked | Adiciona o usuário ao clicar no botão
    };
  }

  update() {
    // Updates the table display | Atualiza a exibição da tabela
    this.removeAllTr(); // Removes all rows before adding new ones | Remove todas as linhas antes de adicionar novas

    this.entries.forEach((user) => {
      const row = this.createRow(user); // Creates a new row for each user | Cria uma nova linha para cada usuário

      // Populates user data in the table row | Preenche os dados do usuário na linha da tabela
      row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Image of ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      // Sets up removal event when the "×" button is clicked | Configura o evento de remoção ao clicar no botão "×"
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Are you sure you want to delete this row?");
        if (isOk) this.delete(user);
      };

      this.tbody.append(row); // Adds the row to the table | Adiciona a linha à tabela
    });
  }

  createRow() {
    // Creates a new row element (tr) for the table | Cria um novo elemento de linha (tr) para a tabela
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/miqueiaslemos67.png" alt="Image of Github miqueiaslemos67" />
        <a href="https://github.com/miqueiaslemos67" target="_blank">
          <p>Miquéias Lemos</p>
          <span>miqueiaslemos67</span>
        </a>
      </td>
      <td class="repositories">26</td>
      <td class="followers">2</td>
      <td>
        <button class="remove">Remove</button>
      </td> 
    `;

    return tr; // Returns the created row to be inserted into the table | Retorna a linha criada para ser inserida na tabela
  }

  removeAllTr() {
    // Removes all rows from the table before updating | Remove todas as linhas da tabela antes de atualizar
    this.tbody.querySelectorAll("tr").forEach((tr) => tr.remove());
  }
}
