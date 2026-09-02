import { gql } from '@apollo/client';


export const REGISTER_USER = gql`
  mutation Register($name:String!,$email:String!,$password:String!){
    register(name:$name,email:$email,password:$password){
     token
     user{
       id
       name
       email
       role
     }
   }
 }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      id
      name
      email
      role
      createdAt
      updatedAt
      lastLogin
    }
  }
`;