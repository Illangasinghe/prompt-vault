"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/signin";
			const body = isSignUp
				? { email, password, name: name || undefined }
				: { email, password };

			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await res.json();

			if (res.ok) {
				router.push("/");
				router.refresh();
			} else {
				setError(data.error || "Authentication failed");
			}
		} catch (err) {
			setError("Network error occurred");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						{isSignUp ? "Create your account" : "Sign in to your account"}
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						{isSignUp ? "Already have an account? " : "Don't have an account? "}
						<button
							type="button"
							onClick={() => setIsSignUp(!isSignUp)}
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							{isSignUp ? "Sign in" : "Sign up"}
						</button>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						{isSignUp && (
							<div>
								<label htmlFor="name" className="sr-only">
									Name
								</label>
								<input
									id="name"
									name="name"
									type="text"
									className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
									placeholder="Full name (optional)"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						)}
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className={`relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
									isSignUp && name !== undefined
										? "rounded-none"
										: "rounded-t-md"
								} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
								placeholder="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete={isSignUp ? "new-password" : "current-password"}
								required
								className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					{error && (
						<div className="text-red-600 text-sm text-center">{error}</div>
					)}

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{loading ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
