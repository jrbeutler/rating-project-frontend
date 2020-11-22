import axios from 'axios';
import config from "../config";

export default class Requests {
  static login = async (email: string, password: string) => {
    const promise = await axios({
      url: config.apiURL,
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

  static rate = async (sessionToken: string, reviewerID: string, reviewedID: string, category: string, rating: number, notes: string) =>{
    const promise = await axios({
      url: config.apiURL,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        query: `
        mutation {
          createRating(
            data: {
              reviewedID: "${reviewedID}"
              reviewerID: "${reviewerID}"
              category: "${category}"
              rating: "${rating}"
              notes: "${notes}"
            }
          ) {
            id
            reviewedID
            reviewerID
            category
            rating
            notes
          }
        }`
      }
    });
    return promise
  }

  static getAllUsers =  (sessionToken: string) => {
    const promise = axios({
      url: config.apiURL,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      data: {
        query:`
        query{
          allUsers {
            id
            email
            firstname
            lastname
          }
        }
        `
      }
    });
    return promise;
  }

  static getUserByID = (sessionToken: string, userID: string) => {
    const promise = axios({
      url: config.apiURL,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken.toString()}`
      },
      data: {
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
      }
    });
    return promise;
  };

  static getCurrentUser = (sessionToken: string) => {
    axios({
      url: config.apiURL,
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

  static getUserRatings = (sessionToken: string, userID: string) => {
    const promise = axios({
      url: config.apiURL,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken.toString()}`
      },
      data: {
        query: `
        query {
          userRatings(reviewedID: "${userID}") {
            id,
            reviewedID,
            reviewerID,
            rating,
            category,
            notes
          }
        }
        `
      }
    });
    return promise;
  }

  static getRatingsCreated = (sessionToken: string, userID: string) => {
    const promise = axios({
      url: config.apiURL,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken.toString()}`
      },
      data: {
        query: `
        query {
          userReviewedRatings(reviewerID: "${userID}") {
            id,
            reviewedID,
            reviewerID,
            rating,
            category,
            notes
          }
        }
        `
      }
    });
    return promise;
  }
}
