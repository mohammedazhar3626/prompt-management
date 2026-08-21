import { gql } from "@apollo/client"

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN"
}

export type AuthPayload = {
    token: string;
    user: AuthUser;
}

export type LoginMutationsData = {
    login: AuthPayload
}

export type LoginMutationVariables = {
    email: string;
    password: string
}


export const LOGIN_MUTATION = gql`
  mutation Login($email:String!,$password:String!){
    login(email:$email,password:$password){
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