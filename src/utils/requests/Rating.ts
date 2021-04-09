import config from "../../config";

// This file contains all network requests related to ratings.

export async function rate(
  sessionToken: string | null,
  reviewerID: string,
  reviewedID: string,
  categoryID: string,
  rating: number,
  notes: string) {
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

export async function getUserRatings(userID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          userRatings(reviewedID: "${userID}") {
            id,
            createdAt,
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

export async function getUserCategoryRatings(sessionToken: string | null, userID: string, categoryID: string) {
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
          userRatingsByCategory(
            data: {
              userID: "${userID}"
              categoryID: "${categoryID}"
            }
          ) {
            id
            categoryID
            createdAt
            reviewedID
            reviewerID
            rating
            notes
          }
        }
        `
    }),
  });
  return await response.json();
}

export async function getOverallRatingAverage(userID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          userOverallAverage(userID: "${userID}")
        }
      `
    })
  });
  return await response.json();
}

export async function getCategoryAverages(userID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          userRatingCategoryAverages(userID: "${userID}") {
            categoryID
            name
            average
          }
        }
      `
    })
  });
  return await response.json();
}

export async function getRatingsCreated(userID: string) {
  const response = await fetch(config.apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          userReviewedRatings(reviewerID: "${userID}") {
            id,
            createdAt,
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
