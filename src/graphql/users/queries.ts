import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query Users(
    $page: Int
    $limit: Int
    $search: String
  ) {
    users(
      page: $page
      limit: $limit
      search: $search
    ) {
      users {
        id
        name
        email
        role
        createdAt
        updatedAt
        lastLogin
      }
      total
      page
      limit
  }
}
`;