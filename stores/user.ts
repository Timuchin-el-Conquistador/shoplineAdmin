import { createStore } from "zustand/vanilla";

import { fakeBackend } from "@/lib/axios";

import { verifySession } from "@/lib/dal";

import { Account, type NewUser } from "@/lib/types/user";

import { createSession, retrieveShopifyStore, updateSession } from "@/lib/session";



export type UserState = {
  loading: boolean;
  error: Error | null;
  user: Account | null;
  success: string | null;
  //subscription: Plan | null;
};

export type UserActions = {
  //auth
  signup: (user: NewUser, router: any) => void;
  resendEmailConfirmationToken: (email: string, router: any) => void;
  login: (user: { email: string; password: string }, router: any) => void;
  forgotPassword: (email: string, router: any) => void;
  //submitOTP: (otp: string, router: any) => void;
  //  resendToEmailOTP: () => void;
  resetPassword: (
    newPassword: string | null,
    confirmPassword: string | null,
    token: string,
    router: any
  ) => void;

  changeEmail:(email:string, router:any) =>void
  changeName:(fullName:string,router:any) =>void
  //private
  //getAccountInformation: () => void;
  // setCurrentSubscription: (plan: Plan) => void;
  /* editProfilePicture: (file: File, router: any) => void;
  editProfile: (user: {
    fullName: string;
    phoneNumber: string;
    password: string | null;
  }) => void;*/

  reset: () => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  loading: false,
  error: null,
  success: null,
  user: null,
  //subscription: null,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set, getState) => ({
    ...initState,
    signup: async (user, router) => {
      if (user.password != user.confirmPassword) {
        return set((prevState) => ({
          ...prevState,
          error: new Error("Şifrə və şifrə təsdiqi eyni olmalıdır."),
        }));
      }

      if (user.password == null) {
        return set((prevState) => ({
          ...prevState,
          error: new Error("Yeni şifrə yaradılmayıb."),
        }));
      }
      if (user.confirmPassword == null) {
        return set((prevState) => ({
          ...prevState,
          error: new Error("Şifrə və təsdiq şifrəsi uyğun deyil."),
        }));
      }
      set((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
        success: null,
      }));
      try {
        const path = `api/v1/admin/signup`

        const store =  await retrieveShopifyStore()
        
        const response: { message: string } = await fakeBackend.post(
         path,
          {
            email: user.email,
            fullName: user.fullName,
            password: user.password,
            storeId:store.storeId
          }
        );
        // await createSession(response.response._id, response.response.email);

        set((prevState) => ({
          ...prevState,
          loading: false,
          success: response.message,
        }));

        router.push("/users/sign_in");
      } catch (error) {
        set((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },

    resendEmailConfirmationToken: async (email: string, router: any) => {
      try {
        set((prevState) => ({
          ...prevState,
          loading: true,
          error: null,
          success: null,
        }));
        const  path = "api/v1/admin/resend-confirmation";
        const response: { message: string } = await fakeBackend.post(path, {
          email,
        });

        set((prevState) => ({
          ...prevState,
          loading: false,
          success: response.message,
          //  token:response.token
        }));
        router.push("/users");
      } catch (error) {
        set((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },
    login: async (user, router) => {
      set((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
        success: null,
      }));
      try {
        const path = "api/v1/admin/signin"
        const response: { message: string; account: Account } =
          await fakeBackend.post(path, { ...user, role: "web" });

        await createSession({
          userId: response.account.userId,
          email: response.account.email,
          fullName: response.account.fullName,
         // planName:response.account.planName,
         // monthlyMinutesCapacity:response.account.monthlyMinutesCapacity,
       //   monthlyLinksCapacity:response.account.monthlyLinksCapacity,
         // monthlyIntegrationsCapacity:response.account.monthlyIntegrationsCapacity,
        //  subscriptionStatus: response.account.subscriptionStatus,
         accountStatus:response.account.accountStatus,
       //  isBrowserNotificationsOn:response.account.isBrowserNotificationsOn,
      //    watchedTutorial:response.account.watchedTutorial,
      //    monthlyMinutesCapacityReached:response.account.monthlyMinutesCapacity<response.account.monthlyMinutesConsumed
        });

        set((prevState) => ({
          ...prevState,
          loading: false,
          user: response.account,
        }));
        router.replace("/links");
      } catch (error) {
        set((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },

    forgotPassword: async (email, router) => {
      try {
        set((prevState) => ({
          ...prevState,
          loading: true,
          error: null,
          success: null,
        }));
         const path = "api/v1/admin/forgot-password";
        const response: { message: string } = await fakeBackend.post(path, {
          email,
        });

        set((prevState) => ({
          ...prevState,
          loading: false,
          success: response.message,
          //  token:response.token
        }));

        router.replace("/users/sign_in");
      } catch (error) {
        set((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },



    resetPassword: async (password, confirmPassword, token, router) => {
      try {
        if (password != confirmPassword) {
          return set((prevState) => ({
            ...prevState,
            error: new Error("Passwords do not match"),
          }));
        }

        if (password == null) {
          return set((prevState) => ({
            ...prevState,
            error: new Error("New password not provided."),
          }));
        }

        set((prevState) => ({
          ...prevState,
          loading: true,
          error: null,
          success: null,
        }));
    
         const path = `api/v1/admin/${token}/reset-password`;
        const response: { account: Account } = await fakeBackend.post(
          path,
          {
            password,
          }
        );

        await createSession({
          userId: response.account.userId,
          email: response.account.email,
          fullName: response.account.fullName,
         // planName:response.account.planName,
         // monthlyMinutesCapacity:response.account.monthlyMinutesCapacity,
         // monthlyLinksCapacity:response.account.monthlyLinksCapacity,
      //    numberOfCreatedLinks:response.account.numberOfCreatedLinks,
       //   monthlyIntegrationsCapacity:response.account.monthlyIntegrationsCapacity,
        //  monthlyMinutesConsumed:response.account.monthlyMinutesConsumed,
        // isBrowserNotificationsOn:response.account.isBrowserNotificationsOn,
        // subscriptionStatus: response.account.subscriptionStatus,
       accountStatus:response.account.accountStatus,
      //   watchedTutorial:response.account.watchedTutorial,
      //  monthlyMinutesCapacityReached:response.account.monthlyMinutesCapacity <response.account.monthlyMinutesConsumed
         
        });
        set((prevState) => ({
          ...prevState,
          loading: false,
          user: response.account,
        }));
        router.replace("/links");

      } catch (error) {
        set((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },


    changeEmail: async (email, router) => {
      try {

        const session = await verifySession()

        if(session == null){
          router.replace("/users/sign_in");
          return
        }

        set((prevState) => ({
          ...prevState,
          loading: true,
          error: null,
          success: null,
        }));


         const path = `api/v1/user/${session?.email}/change-email`;
        const response: { message: string } = await fakeBackend.put(path, {
          email,
        });
        await updateSession('email', email)
        
        set((prevState) => ({
          ...prevState,
          loading: false,
          success: response.message,
          //  token:response.token
        }));

      
      } catch (error) {
        set((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },
    
    changeName: async (name,router) => {
      try {

        const session = await verifySession()

        if(session == null){
          router.replace("/users/sign_in");
          return
        }
        set((prevState) => ({
          ...prevState,
          loading: true,
          error: null,
          success: null,
        }));
        const path = `api/v1/user/${session?.email}/change-name`;
        const response: { message: string } = await fakeBackend.put(path, {
          fullName:name
        });

        await updateSession('name', name)

        set((prevState) => ({
          ...prevState,
          loading: false,
          success: response.message,
          //  token:response.token
        }));

      
      } catch (error) {
        set((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },
    /* getAccountInformation: async () => {
      try {
        const session = await verifySession();
        if (!session) return null;
        set((prevState) => ({
          ...prevState,
          loading: true,
          error: null,
          message: null,
        }));
        const path = `api/v1/user/${session?.email}`;
        const response: { user: User } = await fakeBackend.get(path);

        set((prevState) => ({
          ...prevState,
          loading: false,
          user: response.user,
        }));
      } catch (error) {
        set((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },*/
    /*setCurrentSubscription: (plan: Plan) => {
      set((prevState) => ({
        ...prevState,
        subscription: plan,
      }));
    },*/
    reset: () => {
      set((prevState) => ({
        ...prevState,
        error: null,
        success: null,
      }));
    },
  }));
};
