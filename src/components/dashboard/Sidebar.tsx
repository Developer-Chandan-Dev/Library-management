"use client";
import React, {useEffect, useState} from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconTableFilled,
  IconUsersGroup,
  IconUserPlus,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import {getCurrentUser, signOutUser} from "@/lib/actions/user.actions";
import Image from "next/image";

export function SidebarDemo() {

  const links = [
    {
      label: "Dashboard",
      href: "",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Sheets",
      href: "sheets",
      icon: (
        <IconTableFilled className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Students",
      href: "students",
      icon: (
        <IconUsersGroup className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Add Student",
      href: "add-student",
      icon: (
        <IconUserPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }
  ];

  const [open, setOpen] = useState(false);
  // const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  // const [email, setEmail] = React.useState("");
  const [avatar, setAvatar] = React.useState("");

  useEffect(() => {
    (async function(){
      const user = await getCurrentUser();
      if(user){
        setId(user.$id);
        setName(user.fullName);
        setEmail(user.email);
        setAvatar(user.avatar);
      }
    })();
  }, []);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            onClick={signOutUser}
            link={{
              label: "Logout",
              icon: (
                  <IconArrowLeft
                      className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200"
                  />
              ),
            }}
          />
          <SidebarLink
            link={{
              label: name || "User name",
              icon: (
                <Image
                  src={ avatar || "https://assets.aceternity.com/manu.png" }
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};