"use client"
import React from 'react';
import Link from "next/link";
import {getCurrentUser} from "@/lib/actions/user.actions";
import Image from "next/image";

const Navbar = () => {
    const [id, setId] = React.useState("");
    const [name, setName] = React.useState("");
    // const [email, setEmail] = React.useState("");
    const [avatar, setAvatar] = React.useState("");

    React.useEffect(() => {
        (async function(){
        const user = await getCurrentUser();
            if(user){
                setId(user.$id);
                setName(user.fullName);
                // setEmail(user.email);
                setAvatar(user.avatar);
            }
        })();
    }, []);

  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Digital Library</h1>
      </div>
        {!id ? (<div className="flex items-center gap-2">
            <Link href="/sign-in">
                <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    SignIn
                </button>
            </Link>
            <Link href="/sign-up" className="max-xl:hidden">
                <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    SignUp
                </button>
            </Link>
        </div>) :(
            <div className="flex items-center gap-2">
                <span>{name || "Name not found"}</span>
                <Image width={40} height={40} src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />
            </div>
        )}

    </nav>
  );
};

export default Navbar;
