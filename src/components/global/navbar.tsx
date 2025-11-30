"use client";

import { modules } from "@/constants/module";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";

interface iProps {
    exitFunction: () => void;
}

const NavBar = ({ exitFunction }: iProps) => {
    const router = useRouter();
    const [abrirDrawer, setabrirDrawer] = useState(false);

    const toggleDrawer = () => {
        setabrirDrawer(!abrirDrawer);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        toggleDrawer();
    };

    return (
        <div className="flex items-start justify-start h-full">
            <Drawer direction="left" open={abrirDrawer} onClose={toggleDrawer}>
                <DrawerContent className="overflow-x-hidden overflow-y-auto bg-white max-w-xs w-full">
                    <DrawerHeader className="px-3 sm:px-4">
                        <Button variant="ghost" className="w-fit h-fit min-h-[44px] min-w-[44px] p-2" onClick={toggleDrawer}>
                            <X className="w-5 h-5" />
                        </Button>
                        <DrawerTitle className="text-center sm:text-left sm:pl-6 text-base sm:text-lg">Menu</DrawerTitle>
                    </DrawerHeader>

                    <div className="px-3 sm:px-4 py-2 space-y-2">
                        {modules.map((module) => {
                            const Icon = module.icon;
                            return (
                                <button
                                    key={module.id}
                                    onClick={() => handleNavigation(module.route)}
                                    className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg hover:bg-slate-100 transition-all text-left touch-manipulation min-h-[56px]"
                                >
                                    <div className={`p-2 rounded-md ${module.color} flex-shrink-0`}>
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm sm:text-base font-medium truncate">{module.title}</span>
                                        <span className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                                            {module.description}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <DrawerFooter className="mt-auto px-3 sm:px-4 py-3 sm:py-4 border-t space-y-2 sm:space-y-3">
                        <Link
                            href="/"
                            onClick={exitFunction}
                            className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-600 hover:text-red-600 transition min-h-[44px] px-2 py-2 rounded-lg hover:bg-red-50"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            Sair
                        </Link>
                        <div className="text-center text-xs sm:text-sm text-slate-400 italic px-2">
                            Versão: {process.env.version}
                        </div>
                    </DrawerFooter>
                </DrawerContent>

                <DrawerTrigger asChild className="md:h-full">
                    <div className="md:h-full md:w-full max-md:absolute max-md:top-3 max-md:left-2 max-md:rounded-lg md:p-4">
                        <Button
                            onClick={toggleDrawer}
                            variant="ghost"
                            className="hover:bg-white/20 rounded-md p-2 min-h-[44px] min-w-[44px]"
                        >
                            <Menu className="text-white size-5 sm:size-6" />
                        </Button>
                    </div>
                </DrawerTrigger>
            </Drawer>
        </div>
    );
};

export default NavBar;
