"use client";

import "@/styles/login.scss";

import dynamic from "next/dynamic";

import Image from "next/image";

import { useRef } from "react";


import { useUserStore } from "@/providers/user";

import Link from "next/link";

import "@/styles/login.scss";

import Logo from "@/public/logo-white.svg";


import { useVisibility } from "@/hooks/alerts-visibility";

import { useRouter } from "next/navigation";

const SlSpinner = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/spinner/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);

const SlAlert = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/alert/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);

const SlIcon = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);
function Login() {
  const router = useRouter();

  const { reset, error, loading, success, login } = useUserStore(
    (state) => state
  );
  const {
    isDangerAlertVisible,
    setDangerAlertVisibility,
    isPasswordVisible,
    setPasswordVisibility,
    isSuccessAlertVisible,
  } = useVisibility(reset, error, loading, success);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 log-auth">
        <Image src="/logo-auth.png" alt="logo" width={120} height={120} className="fixed top-4 left-4 z-50" />
        <div
          style={{
            position: "fixed",
            right: "15px",
            top: "15px",
            display: isSuccessAlertVisible ? "block" : "hidden",
          }}
        >
          <SlAlert variant="primary" open={isSuccessAlertVisible}>
            <SlIcon slot="icon" name="info-circle"></SlIcon>
            <strong>{success}</strong>
          </SlAlert>
        </div>

        <div
          style={{
            position: "fixed",
            right: "15px",
            top: "15px",
            display: isDangerAlertVisible ? "block" : "hidden",
          }}
        >
          <SlAlert variant="danger" open={isDangerAlertVisible}>
            <SlIcon slot="icon" name="exclamation-octagon"></SlIcon>
            <strong>{error?.message}</strong>
          </SlAlert>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-lg rounded-3xl sm:px-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>
              <button className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Continue with Google</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = emailRef?.current?.value || "";
                const password = passwordRef?.current?.value || "";
                login({ email, password }, router);
              }}
              className="space-y-4"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_631_1511)">
                      <path d="M18.3337 4.99992C18.3337 4.08325 17.5837 3.33325 16.667 3.33325H3.33366C2.41699 3.33325 1.66699 4.08325 1.66699 4.99992M18.3337 4.99992V14.9999C18.3337 15.9166 17.5837 16.6666 16.667 16.6666H3.33366C2.41699 16.6666 1.66699 15.9166 1.66699 14.9999V4.99992M18.3337 4.99992L10.0003 10.8333L1.66699 4.99992" stroke="#383838" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_631_1511">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <input
                  autoFocus
                  autoComplete="email"
                  style={{ paddingLeft: '40px' }}
                  className="bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 block w-full text-sm py-3 pr-10 placeholder-gray-400"
                  placeholder="olivia@untitledui.com"
                  type="email"
                  name="user[email]"
                  id="user_email"
                  ref={emailRef}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_631_1090)">
                      <path d="M5.83333 9.16675V5.83341C5.83333 4.72835 6.27232 3.66854 7.05372 2.88714C7.83512 2.10573 8.89493 1.66675 10 1.66675C11.1051 1.66675 12.1649 2.10573 12.9463 2.88714C13.7277 3.66854 14.1667 4.72835 14.1667 5.83341V9.16675M4.16667 9.16675H15.8333C16.7538 9.16675 17.5 9.91294 17.5 10.8334V16.6667C17.5 17.5872 16.7538 18.3334 15.8333 18.3334H4.16667C3.24619 18.3334 2.5 17.5872 2.5 16.6667V10.8334C2.5 9.91294 3.24619 9.16675 4.16667 9.16675Z" stroke="#383838" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_631_1090">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <input
                  autoComplete="current-password"
                  style={{ paddingLeft: '40px' }}
                  className="bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 block w-full text-sm py-3 pr-10 placeholder-gray-400"
                  placeholder="Password"
                  type={isPasswordVisible ? "text" : "password"}
                  name="user[password]"
                  id="user_password"
                  ref={passwordRef}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisibility(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isPasswordVisible ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-50 text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <SlSpinner style={{ fontSize: "1.2rem" }}></SlSpinner> : "Login"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/users/sign_up" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
