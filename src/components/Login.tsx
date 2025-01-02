"use client";

import React, { use, useState } from "react";
import Image from "next/image";
import T3_Full from "../../public/assets/t3_cars_full_logo.png";
import loader from "../../public/assets/loader.png";
import { setCookie, deleteCookie } from "cookies-next";
// import { loginUser, listSessions, logoutUser } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import PrimaryButton from "./PrimaryButton";
import { account, listAllUsers, loginUser, logoutUser } from "@/lib/appwrite";

// import { checkUserAccess } from "@/helpers/auth";

type Props = {};

function Login({}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isUserPresent, setIsUserPresent] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const login = async () => {
    setIsSigningIn(true);
    setIsUserPresent(true);

    try {
      const user = await loginUser(email, password);
      if (user?.sessionDetails) {
        console.log("USER HAI");
        const userDetails = user?.userDetails;

        console.log("THESE ARE THE USER DETAILS - ", userDetails);
        setCookie("user", JSON.stringify(userDetails));
        console.log("COOKIE SET", userDetails);

        const userAccess = userDetails.labels[0];
        let redirectURL = "/";

        switch (userAccess) {
          case "parts":
            redirectURL = "/parts";
            break;
          case "biller":
            redirectURL = "/biller";
            break;
          case "security":
            redirectURL = "/security";
            break;
          case "service":
            redirectURL = "/service";
            break;
          case "admin":
            redirectURL = "/admin";
            break;
          default:
            break;
        }

        console.log("REDIRECTING TO - ", redirectURL);
        router.push(redirectURL);
      } else {
        console.log("USER NAHI HAI");
        console.log(user);
        setErrorMessage(user.errorMsg);
        setIsUserPresent(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsUserPresent(false);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      {/* Overlay to disable page
      {isSigningIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Image src={loader} width={100} height={100} alt="Loading" />
        </div>
      )} */}
      <Image src={T3_Full} width={200} height={200} alt="Logo" />
      <div className="flex flex-col justify-center items-center space-y-5 mt-10">
        <div className="text-gray-800 font-semibold text-3xl">
          Login to your Account
        </div>
        <div className="text-gray-500 font-semibold text-lg">
          Welcome back ! Please enter your details.
        </div>
      </div>
      <div className="flex flex-col w-full justify-center items-center mt-10 space-y-5">
        <input
          // value={Props.name}
          type="text"
          id="email"
          name="email"
          placeholder="Enter your Email"
          className="border-2 border-gray-400 bg-transparent placeholder-gray-400 p-3 w-[80%] lg:w-1/4 rounded-xl"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          // value={Props.name}
          type="password"
          id="password"
          name="password"
          placeholder="Enter your Password"
          className="border-2 border-gray-400 bg-transparent placeholder-gray-400 p-3 w-[80%] lg:w-1/4 rounded-xl"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div className="flex flex-col justify-center items-center w-full mt-10 space-y-4">
        <PrimaryButton
          title={"Sign In"}
          handleButtonPress={login}
          isLoading={isSigningIn}
        />
        {isUserPresent ? (
          <></>
        ) : (
          <>
            <div className="text-red-600">{errorMessage}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
