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
