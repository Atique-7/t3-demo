"use client";

import React, { useState } from "react";
import Image from "next/image";
import T3_Full from "../../public/assets/t3_cars_full_logo.png";
import { setCookie, deleteCookie } from "cookies-next";
// import { loginUser, listSessions, logoutUser } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import PrimaryButton from "./PrimaryButton";
import { listAllUsers, loginUser, logoutUser } from "@/lib/appwrite";

// import { checkUserAccess } from "@/helpers/auth";

type Props = {};

function Login({}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const login = async () => {
    setIsSigningIn((prev) => true);

    const user = await loginUser(email, password);
    const userDetails = user?.userDetails;

    console.log("THESE ARE THE USER DETAILS - ", userDetails);
    setCookie("user", JSON.stringify(userDetails));
    console.log("COOKIE SET", userDetails);

    const userAccess = userDetails.labels[0];
    //const allUsers = await listAllUsers();

    if (userAccess === "service") {
      // console.log("lkkkkkkk", allUsers);
      // setCookie("users", allUsers);
    }
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
    setIsSigningIn((prev) => false);
  };

  const logout = async () => {
    await logoutUser();
    deleteCookie("userId");
  };

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
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
        <PrimaryButton
          title={"clear session"}
          handleButtonPress={logout}
          isLoading={isSigningIn}
        />
      </div>
    </div>
  );
}

export default Login;
