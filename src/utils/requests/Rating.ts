import config from "../../config";

// This file contains all network requests related to ratings.

export async function rate(
  sessionToken: string,
  reviewerID: string,
  reviewedID: string,
  categoryID: string,
  rating: number,
  notes: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    },
    body: JSON.stringify({
      query: `
        mutation {
          createRating(
            data: {
              reviewedID: "${reviewedID}"
              reviewerID: "${reviewerID}"
              categoryID: "${categoryID}"
              rating: ${rating}
              notes: "${notes}"
            }
          ) {
            id
            reviewedID
            reviewerID
            categoryID
            rating
            notes
          }
        }`
    }),
  });
  return await response.json();
}

export async function getUserRatings(sessionToken: string, userID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken.toString()}`
    },
    body: JSON.stringify({
      query: `
        query {
          userRatings(reviewedID: "${userID}") {
            id,
            reviewedID,
            reviewerID,
            rating,
            categoryID,
            notes
          }
        }
        `
    }),
  });
  return await response.json();
}

export async function getRatingsCreated(sessionToken: string, userID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken.toString()}`
    },
    body: JSON.stringify({
      query: `
        query {
          userReviewedRatings(reviewerID: "${userID}") {
            id,
            reviewedID,
            reviewerID,
            rating,
            categoryID,
            notes
          }
        }
        `
    }),
  });
  return await response.json();
}
