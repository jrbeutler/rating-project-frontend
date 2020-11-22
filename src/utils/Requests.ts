import axios from 'axios';

export default class Requests {
  static login = async (email: string, password: string) => {
    const promise = await axios({
      url: 'http://localhost:3000/graphql',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        query: `
          mutation {
            login(data: {email: "${email}", password: "${password}"}) {
              accessToken
              user {
                id
                email
                firstname
                lastname
                role
              }
            }
          }
          `
      }
    });
    return promise;
  }

  static getCurrentUser = (sessionToken: string) => {
    axios({
      url: 'http://localhost:3000/graphql',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      data: {
        query: `
        query {
          me {
            id,
            email,
            firstname,
            lastname,
            role
          }
        }
        `
      }
    }).then((result) => {
      console.log(result);
      return(result);
    }).catch((e) => {
      return(e.message);
    });
  };
}
