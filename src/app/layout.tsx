import "./../styles/globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Prompt Vault",
	description:
		"A powerful prompt management application for organizing and storing your AI prompts",
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon.ico", sizes: "any" },
		],
		apple: {
			url: "/apple-touch-icon.png",
			sizes: "180x180",
			type: "image/png",
		},
		other: [{ rel: "manifest", url: "/site.webmanifest" }],
	},
	manifest: "/site.webmanifest",
};

export function generateViewport() {
	return {
		width: "device-width",
		initialScale: 1,
		themeColor: "#000000",
	};
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link
					rel="icon"
					href="/favicon-16x16.png"
					sizes="16x16"
					type="image/png"
				/>
				<link
					rel="icon"
					href="/favicon-32x32.png"
					sizes="32x32"
					type="image/png"
				/>
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body>{children}</body>
		</html>
	);
}
