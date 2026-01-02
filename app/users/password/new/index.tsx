"use client";
import dynamic from "next/dynamic";

import Image from "next/image";
import "@/styles/login.scss";

import { useUserStore } from "@/providers/user";

import { useRouter } from "next/navigation";

import { useVisibility } from "@/hooks/alerts-visibility";

import { useRef } from "react";

import Danger from "@/components/Alerts/danger";

const SlSpinner = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/spinner/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);

function ForgotPassword() {
  const router = useRouter();

  const { error, loading, success, reset, forgotPassword } =
    useUserStore((state) => state);
  const {
    isDangerAlertVisible,
    setDangerAlertVisibility,
    isPasswordVisible,
    setPasswordVisibility,
  } = useVisibility(reset, error, loading, success);

  const emailRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 log-auth">
        <Image src="/logo-auth.png" alt="logo" width={120} height={120} className="fixed top-4 left-4 z-50" />
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-lg rounded-3xl sm:px-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
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
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const email = emailRef?.current?.value || "";

                forgotPassword(email, router);
              }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_631_1511)">
                      <path d="M18.3337 4.99992C18.3337 4.08325 17.5837 3.33325 16.667 3.33325H3.33366C2.41699 3.33325 1.66699 4.08325 1.66699 4.99992M18.3337 4.99992V14.9999C18.3337 15.9166 17.5837 16.6666 16.667 16.6666H3.33366C2.41699 16.6666 1.66699 15.9166 1.66699 14.9999V4.99992M18.3337 4.99992L10.0003 10.8333L1.66699 4.99992" stroke="#383838" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  </svg>
                </div>
                <input
                  autoFocus
                  autoComplete="email"
                  style={{ paddingLeft: '40px' }}
                  className="bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 block w-full text-sm py-3 pr-10 placeholder-gray-400"
                  placeholder="your@email.com"
                  type="email"
                  name="user[email]"
                  id="user_email"
                  ref={emailRef}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-50 text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <SlSpinner style={{ fontSize: "1.2rem" }}></SlSpinner> : "Send me reset password instructions"}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <a className="text-blue-600 hover:text-blue-700 font-medium" href="/users/sign_in">Log in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
