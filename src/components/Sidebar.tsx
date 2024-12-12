"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/Logomark.png";
import loader from "../../public/assets/t3-loader.gif";
// import { Home01Icon, Layers01Icon, Logout04Icon } from "hugeicons-react";
import {
  Car,
  ClipboardList,
  House,
  Layers3,
  LogOut,
  Menu,
  PlusIcon,
  UserRoundCog,
} from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/appwrite";
import { deleteCookie } from "cookies-next";
import { Button } from "./ui/button";

export default function Sidebar({ home }: any) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();

  console.log("THIS IS THE HOME - ", home);

  const logout = async () => {
    setIsLoggingOut((prev) => true);
    await logoutUser();
    deleteCookie("user");
    router.push("/");
    // setIsLoggingOut((prev) => false);
  };

  return (
    <>
      <div className="sm:flex lg:hidden z-10 absolute top-5 right-5">
        <Drawer>
          <DrawerTrigger>
            <Menu color="#EF4444" size={38} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex justify-center">
                <Image src={logo} width={50} height={50} alt="Logo" />
              </DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button
                  className="flex justify-between p-4 border-b w-full"
                  onClick={() => router.push(home)}
                  variant={"link"}
                >
                  <House />
                  <div>Home</div>
                </Button>
              </DrawerClose>
              {(home == "/parts" || home == "/biller") && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/parts-inventory`)}
                    variant={"link"}
                  >
                    <ClipboardList />
                    <div>Parts Inventory</div>
                  </Button>
                </DrawerClose>
              )}
              {home == "/parts" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/addParts`)}
                    variant={"link"}
                  >
                    <PlusIcon />
                    <div>Add Parts</div>
                  </Button>
                </DrawerClose>
              )}
              {home == "/biller" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/addLabour`)}
                    variant={"link"}
                  >
                    <PlusIcon />
                    <div>Add Labour</div>
                  </Button>
                </DrawerClose>
              )}
              {home == "/biller" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/labour-inventory`)}
                    variant={"link"}
                  >
                    <UserRoundCog />
                    <div>Labour Inventory</div>
                  </Button>
                </DrawerClose>
              )}
              {home == "/security" && (
                <DrawerClose>
                  <Button
                    className="flex justify-between p-4 border-b w-full"
                    onClick={() => router.push(`${home}/addCar`)}
                    variant={"link"}
                  >
                    <Car />
                    <div>Add Car</div>
                  </Button>
                </DrawerClose>
              )}
              <Button
                onClick={logout}
                className="flex justify-between p-4 border-b"
                variant={"link"}
              >
                {isLoggingOut ? (
                  <Image src={loader} width={50} height={50} alt="Logo" />
                ) : (
                  <>
                    <LogOut />
                    <div>Logout</div>
                  </>
                )}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden lg:flex sticky top-0 shadow-xl p-6 flex-col h-dvh bg-gray-50 min-w-[80px] items-center py-8">
        <div className="mb-10">
          <Image src={logo} width={50} height={50} alt="Logo" />
        </div>
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col space-y-5">
            <Link className="border-2 rounded-md shadow-md p-3" href={home}>
              <House />
            </Link>
            {(home == "/parts" || home == "/biller") && (
              <Link
                className="border-2 rounded-md shadow-md p-3"
                href={`${home}/parts-inventory`}
              >
                <ClipboardList />
              </Link>
            )}

            {home == "/admin" && (
              <Link
                className="border-2 rounded-md shadow-md p-3"
                href={`${home}/manage-jobcards`}
              >
                <ClipboardList />
              </Link>
            )}
            {home == "/biller" && (
              <Link
                className="border-2 rounded-md shadow-md p-3"
                href={`${home}/labour-inventory`}
              >
                <UserRoundCog />
              </Link>
            )}
            {home == "/security" && (
              <Link
                className="border-2 rounded-md shadow-md p-3"
                href={`${home}/addCar`}
              >
                <Car />
              </Link>
            )}
            {home == "/parts" && (
              <Link
                className="border-2 rounded-md shadow-md p-3"
                href={`${home}/addParts`}
              >
                <PlusIcon />
              </Link>
            )}
            {home == "/biller" && (
              <Link
                className="border-2 rounded-md shadow-md p-3"
                href={`${home}/addLabour`}
              >
                <PlusIcon />
              </Link>
            )}
          </div>
          <div>
            <button
              onClick={logout}
              className={`border-2 rounded-md shadow-md ${
                isLoggingOut ? "opacity-50 p-1" : "p-3"
              }`}
            >
              {isLoggingOut ? (
                <Image src={loader} width={50} height={50} alt="Logo" />
              ) : (
                <LogOut />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
