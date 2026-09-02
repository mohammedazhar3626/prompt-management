import { gql } from "@apollo/client"

export type AuthUser = {
  id: string;
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

export type RegisterMutationData = {
  register: AuthPayload
}

export type RegisterMutationVariables = {
  name: string
  email: string;
  password: string
}

export type RequestPasswordResetData = {
  requestPasswordReset: {
    success: boolean;
    message: string;
    challengeId: string | null;
    expiresAt: string | null;
    resendAvailableAt: string | null;
  };
};

export type RequestPasswordResetVariables = {
  email: string;
};

export type VerifyPasswordResetOtpData = {
  verifyPasswordResetOtp: {
    success: boolean;
    message: string;
    resetToken: string | null;
  };
};

export type VerifyPasswordResetOtpVariables = {
  challengeId: string;
  otp: string;
};

export type ResetPasswordData = {
  resetPassword: {
    success: boolean;
    message: string;
  };
};

export type ResetPasswordVariables = {
  resetToken: string;
  password: string;
};


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


export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
     success
     message
     challengeId
     expiresAt
     resendAvailableAt
    }
  }
`;


export const VERIFY_PASSWORD_RESET_OTP = gql`
  mutation VerifyPasswordResetOtp(
    $challengeId: String!
    $otp: String!)
     {
        verifyPasswordResetOtp(
        challengeId: $challengeId
        otp: $otp)
     {
        success
        message
        resetToken
    }
  }
`;


export const RESET_PASSWORD = gql`
  mutation ResetPassword(
    $resetToken: String!
    $password: String!)
     {
        resetPassword(
        resetToken: $resetToken
        password: $password)
     {
        success
        message
    }
}
`;


