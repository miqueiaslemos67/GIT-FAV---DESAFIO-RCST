export class GithubUser {
    // Define uma classe chamada GithubUser para buscar dados de um usuário no GitHub
  
    static search(username) {
      // Método estático que realiza a busca do usuário no GitHub
  
      const endpoint = `https://api.github.com/users/${username}`;
      // Define a URL da API do GitHub para buscar informações do usuário
  
      return fetch(endpoint)
        // Faz uma requisição HTTP para o endpoint
  
        .then((data) => data.json())
        // Converte a resposta para JSON
  
        .then(({ login, name, public_repos, followers }) => ({
          login,
          name,
          public_repos,
          followers,
        }));
        // Extrai os dados relevantes da resposta e os retorna em um objeto simplificado
    }
  }