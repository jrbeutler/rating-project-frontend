import config from "../../config";

// This file contains all network requests related to the categories table.

export async function getCategoryByID(sessionToken: string | null, categoryID: string) {
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
          getCategoryByID(categoryID: "${categoryID}") {
            id
            name
          }
        }
      `
    })
  });
  return await response.json();
}

export async function getAllCategories() {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          getAllCategories {
            id
            name
            isActive
          }
        }
      `
    })
  });
  return await response.json();
}

export async function createCategory(sessionToken: string | null, categoryName: string) {
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
          createCategory(name: "${categoryName}") {
            id
            name
            isActive
          }
        }
      `
    })
  });
  return await response.json();
}

export async function archiveCategory(sessionToken: string, categoryID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
      query: `
        mutation {
          archiveCategory(categoryID: "${categoryID}") {
            id
            name
            isActive
          }
        }
      `
    })
  });
  return await response.json();
}

export async function activateCategory(sessionToken: string, categoryID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
      query: `
        mutation {
          activateCategory(categoryID: "${categoryID}") {
            id
            name
            isActive
          }
        }
      `
    })
  });
  return await response.json();
}
