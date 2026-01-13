import { ENDPOINTS } from '~/app/endpoints';
import {
  setIsLoginModalOpen,
  setIsSignUpModalOpen,
} from '~/store/rtk/slices/modals.slice';
import { setIsLoggedIn } from '~/store/rtk/slices/user.slice';

import { baseApi } from './baseApi';

type LoginRequest = {
  email: string;
  password: string;
  isGoogleUser?: boolean;
};

type LoginResponse = {
  token: string;
  email: string;
};

type RegisterRequest = {
  email: string;
  password: string;
  isGoogleUser?: boolean;
  unregisteredFollowedShows?: number[];
};

type RequestOneTimeCodeRequest = {
  email: string;
};

type VerifyOneTimeCodeRequest = {
  email: string;
  oneTimeCode: string;
};

type ChangePasswordForResetRequest = {
  email: string;
  password: string;
};

type ChangePasswordRequest = {
  email: string;
  oldPassword: string;
  newPassword: string;
};

type GoogleUserInfoResponse = {
  email: string;
  sub: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setIsLoginModalOpen(false));
          dispatch(setIsSignUpModalOpen(false));
          dispatch(
            setIsLoggedIn({
              email: data.email,
              token: data.token,
              isGoogleUser: arg.isGoogleUser,
            })
          );
        } catch {
          // Error handling done in components
        }
      },
    }),

    register: builder.mutation<void, RegisterRequest>({
      query: body => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    requestOneTimeCode: builder.mutation<void, RequestOneTimeCodeRequest>({
      query: body => ({
        url: '/requestonetimecode',
        method: 'POST',
        body,
      }),
    }),

    verifyOneTimeCode: builder.mutation<void, VerifyOneTimeCodeRequest>({
      query: body => ({
        url: '/verifyonetimecode',
        method: 'POST',
        body,
      }),
    }),

    changePasswordForReset: builder.mutation<
      void,
      ChangePasswordForResetRequest
    >({
      query: body => ({
        url: '/changepasswordforreset',
        method: 'POST',
        body,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: body => ({
        url: '/changepassword',
        method: 'POST',
        body,
      }),
    }),

    getGoogleUserInfo: builder.query<GoogleUserInfoResponse, string>({
      query: accessToken => ({
        url: ENDPOINTS.GOOGLE_USER_INFO,
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestOneTimeCodeMutation,
  useVerifyOneTimeCodeMutation,
  useChangePasswordForResetMutation,
  useChangePasswordMutation,
  useLazyGetGoogleUserInfoQuery,
} = authApi;
