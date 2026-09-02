import { gql } from "@apollo/client"


export const GET_NAVIGATION = gql`
  query Navigation {
    navigation {
      id
      label
      path
      icon
      children {
        id
        label
        path
        icon
      }
    }    
  }
`;