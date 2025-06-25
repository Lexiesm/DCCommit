'use client';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import HamburgerMenu from "./HamburgerMenu";
import LogoLabel from "./LogoLabel";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-color-background text-white">
            <div className="flex items-center">
                <Link href="/">
                    <LogoLabel />
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <Link href="/post">
                    <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                        Publicar
                    </button>
                </Link>
                <HamburgerMenu />
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal" />
                </SignedOut>
            </div>
        </header>
    );
}
