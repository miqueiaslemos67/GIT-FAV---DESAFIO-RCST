export class GithubUser {
  // Defines a class called GithubUser to fetch user data from GitHub | Define uma classe chamada GithubUser para buscar dados de um usuário no GitHub

  static search(username) {
    // Static method that searches for the user on GitHub | Método estático que realiza a busca do usuário no GitHub

    const endpoint = `https://api.github.com/users/${username}`;
    // Sets the GitHub API URL to fetch user information | Define a URL da API do GitHub para buscar informações do usuário

    return fetch(endpoint)
      // Makes an HTTP request to the endpoint | Faz uma requisição HTTP para o endpoint

      .then((data) => data.json())
      // Converts the response to JSON | Converte a resposta para JSON

      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }));
      // Extracts relevant data from response and returns it as a simplified object | Extrai os dados relevantes da resposta e os retorna em um objeto simplificado
  }
}
