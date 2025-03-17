import { GithubUser } from "./GithubUser.js";

// Classe que gerencia os dados dos usuários favoritos
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load(); // Carrega os dados do localStorage
  }

  load() {
    // Recupera os dados armazenados no localStorage ou inicia um array vazio caso não existam dados
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    // Salva a lista de favoritos no localStorage
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    // Adiciona um usuário à lista de favoritos
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuário já cadastrado!"); // Impede duplicatas
      }

      const user = await GithubUser.search(username);
      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!"); // Se o usuário não existir no GitHub
      }

      this.entries = [user, ...this.entries]; // Adiciona o novo usuário no topo da lista
      this.update(); // Atualiza a exibição da tabela
      this.save(); // Salva no localStorage
    } catch (error) {
      alert(error.message); // Exibe o erro ao usuário
    }
  }

  delete(user) {
    // Remove um usuário da lista de favoritos
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries; // Atualiza a lista sem o usuário removido
    this.update(); // Atualiza a exibição
    this.save(); // Atualiza o localStorage
  }
}

// Classe que gerencia a interface gráfica e os eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root); // Liga a classe Favorites a esta classe

    this.tbody = this.root.querySelector("table tbody"); // Seleciona o corpo da tabela

    this.update(); // Atualiza a interface
    this.onadd(); // Configura o evento de adicionar usuário
  }

  onadd() {
    // Evento para capturar o clique no botão de adicionar usuário
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value); // Adiciona o usuário ao clicar no botão
    };
  }

  update() {
    // Atualiza a exibição da tabela
    this.removeAllTr(); // Remove todas as linhas antes de adicionar novas

    this.entries.forEach((user) => {
      const row = this.createRow(user); // Cria uma nova linha para cada usuário

      // Preenche os dados do usuário na linha da tabela
      row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      // Configura o evento de remoção ao clicar no botão "×"
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");
        if (isOk) this.delete(user);
      };

      this.tbody.append(row); // Adiciona a linha à tabela
    });
  }

  createRow() {
    // Cria um novo elemento de linha (tr) para a tabela
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/miqueiaslemos67.png" alt="Imagem do Github miqueiaslemos67" />
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

    return tr; // Retorna a linha criada para ser inserida na tabela
  }

  removeAllTr() {
    // Remove todas as linhas da tabela antes de atualizar
    this.tbody.querySelectorAll("tr").forEach((tr) => tr.remove());
  }
}