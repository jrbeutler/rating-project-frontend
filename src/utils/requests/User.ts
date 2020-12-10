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

export async function getUserByID(sessionToken: string, userID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken.toString()}`
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

async function getCurrentUser(sessionToken: string) {
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

