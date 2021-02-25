import config from "../../config";

// This file contains all network requests related to the user.

export async function login(email: string, password: string) {
  const response = await fetch(config.apiURL,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `mutation {
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
          }`
    }),
  });
  return await response.json();
}

export async function refreshToken(sessionToken: string) {
  const response = await fetch(config.apiURL,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        mutation {
          refreshToken(
            token: "${sessionToken}"
          ) {
            accessToken
            refreshToken
          }
        }`
    }),
  });
  return await response.json();
}

export async function getUserByID(sessionToken: string | null, userID: string) {
  if (sessionToken === '') {
    return null;
  }
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
      query: `
        query {
          userByID(userID: "${userID}") {
            id,
            firstname,
            lastname,
            email,
            role
          }
        }
        `
    }),
  });
  return await response.json();
}

export async function getCurrentUser(sessionToken: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
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
    }),
  });
  return await response.json();
}

export async function getAllUsers(sessionToken: string | null) {
  if (sessionToken === '') {
    return null;
  }
  const response = await fetch(config.apiURL,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
      query: `
        query{
          allUsers {
            id
            email
            firstname
            lastname
          }
        }
        `
    }),
  });
  return await response.json();
}

export async function getAllApprentices(sessionToken: string | null) {
  if (sessionToken === '') {
    return null;
  }
  const response = await fetch(config.apiURL,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
      query: `
        query{
          allApprentices {
            id
            firstname
            lastname
            role
          }
        }
        `
    }),
  });
  return await response.json();
}

export async function createUser(sessionToken: string | null,
                                 firstName: string,
                                 lastName: string,
                                 email: string,
                                 role: string,
                                 password: string) {
  if (sessionToken === '') {
    return null;
  }
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
      query: `
        mutation {
          createUser(data: {
              firstname: "${firstName}",
              lastname: "${lastName}",
              email: "${email}",
              role: "${role}",
              password: "${password}" }) {
            id
            firstname
            lastname
            email
          }
        }
        `
    }),
  });
  return await response.json();
}

export async function updateUser(sessionToken: string | null,
                                 firstName: string,
                                 lastName: string) {
  if (sessionToken === '') {
    return null;
  }
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
      query: `
        mutation {
          updateUser(data: {
            firstname: "${firstName}",
            lastname: "${lastName}"
          }) {
            firstname,
            lastname
          }
        }
        `
    }),
  });
  return await response.json();
}
