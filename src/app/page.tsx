"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewPromptDialog from "@/components/NewPromptDialog";
import EditPromptDialog from "@/components/EditPromptDialog";
import PromptCard from "@/components/PromptCard";

type Prompt = {
	id: string;
	title: string;
	body: string;
	tags: string[];
	isFavorite: boolean;
	isArchived: boolean;
	updatedAt: string;
};

interface Statistics {
	totalPrompts: number;
	favoritePrompts: number;
	archivedPrompts: number;
	totalTags: number;
	activePrompts: number;
}

export default function HomePage() {
	const router = useRouter();
	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [q, setQ] = useState("");
	const [loading, setLoading] = useState(false);
	const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
	const [showArchivedOnly, setShowArchivedOnly] = useState(false);
	const [sortBy, setSortBy] = useState<"date" | "title">("date");
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [userName, setUserName] = useState("User");
	const [userEmail, setUserEmail] = useState("");
	const [stats, setStats] = useState<Statistics | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	async function load(resetPagination = true) {
		setLoading(true);
		const params = new URLSearchParams();
		if (q) params.set("q", q);
		if (showFavoritesOnly) params.set("fav", "true");
		if (showArchivedOnly) params.set("archived", "true");
		if (sortBy === "title") params.set("sort", "title");
		params.set("limit", "20"); // Load 20 items at a time

		const res = await fetch(`/api/prompts?${params.toString()}`);
		setLoading(false);
		if (res.ok) {
			let data = await res.json();

			// Client-side tag filtering
			if (selectedTag) {
				data = data.filter((p: Prompt) => p.tags.includes(selectedTag));
			}

			if (resetPagination) {
				setPrompts(data);
				setHasMore(data.length === 20); // If we got 20 items, there might be more
			} else {
				setPrompts((prev) => [...prev, ...data]);
				setHasMore(data.length === 20);
			}
		} else if (res.status === 401) router.push("/signin");
	}

	async function loadMore() {
		if (loadingMore || !hasMore) return;

		setLoadingMore(true);
		const params = new URLSearchParams();
		if (q) params.set("q", q);
		if (showFavoritesOnly) params.set("fav", "true");
		if (showArchivedOnly) params.set("archived", "true");
		if (sortBy === "title") params.set("sort", "title");
		params.set("limit", "20");
		params.set("offset", prompts.length.toString()); // Use current prompts count as offset

		const res = await fetch(`/api/prompts?${params.toString()}`);
		setLoadingMore(false);

		if (res.ok) {
			let data = await res.json();

			// Client-side tag filtering
			if (selectedTag) {
				data = data.filter((p: Prompt) => p.tags.includes(selectedTag));
			}

			setPrompts((prev) => [...prev, ...data]);
			setHasMore(data.length === 20); // If we got 20 items, there might be more
		}
	}

	async function loadUserInfo() {
		try {
			const res = await fetch("/api/user");
			if (res.ok) {
				const user = await res.json();
				setUserName(user.name || user.email?.split("@")[0] || "User");
				setUserEmail(user.email || "");
			}
		} catch (error) {
			console.error("Failed to load user info:", error);
		}
	}

	async function loadStats() {
		try {
			const res = await fetch("/api/stats");
			if (res.ok) {
				const statistics = await res.json();
				setStats(statistics);
			}
		} catch (error) {
			console.error("Failed to load statistics:", error);
		}
	}

	async function handleLogout() {
		try {
			const res = await fetch("/api/auth/signout", { method: "POST" });
			if (res.ok) {
				router.push("/signin");
			} else {
				// Fallback to GET method
				window.location.href = "/api/auth/signout";
			}
		} catch (error) {
			console.error("Logout failed:", error);
			// Fallback to direct navigation
			window.location.href = "/api/auth/signout";
		}
	}

	async function handleEdit(id: string) {
		setEditingPromptId(id);
	}

	function handleNewPrompt() {
		setEditingPromptId("new");
	}

	async function handleDelete(id: string) {
		try {
			const res = await fetch(`/api/prompts/${id}`, {
				method: "DELETE",
			});

			if (res.ok) {
				setPrompts(prompts.filter((p) => p.id !== id));
				loadStats(); // Update statistics after deletion
			} else {
				const error = await res.json();
				alert(`Failed to delete prompt: ${error.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error("Error deleting prompt:", error);
			alert("Failed to delete prompt");
		}
	}

	async function handleFavorite(id: string, isFavorite: boolean) {
		try {
			const res = await fetch(`/api/prompts/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isFavorite }),
			});

			if (res.ok) {
				setPrompts(
					prompts.map((p) => (p.id === id ? { ...p, isFavorite } : p)),
				);
				loadStats(); // Update statistics after favorite change
			} else {
				const error = await res.json();
				alert(`Failed to update favorite: ${error.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error("Error updating favorite:", error);
			alert("Failed to update favorite");
		}
	}

	async function handleArchive(id: string, isArchived: boolean) {
		try {
			const res = await fetch(`/api/prompts/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isArchived }),
			});

			if (res.ok) {
				setPrompts(
					prompts.map((p) => (p.id === id ? { ...p, isArchived } : p)),
				);
				loadStats(); // Update statistics after archive change
			} else {
				const error = await res.json();
				alert(
					`Failed to update archive status: ${error.error || "Unknown error"}`,
				);
			}
		} catch (error) {
			console.error("Error updating archive status:", error);
			alert("Failed to update archive status");
		}
	}

	// Get all unique tags from all prompts
	const allTags = Array.from(new Set(prompts.flatMap((p) => p.tags)));

	useEffect(() => {
		const t = setTimeout(load, 250);
		return () => clearTimeout(t);
	}, [q, selectedTag, showFavoritesOnly, showArchivedOnly, sortBy]);

	useEffect(() => {
		load();
		loadUserInfo();
		loadStats();
	}, []);

	// Close user menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (showUserMenu) {
				setShowUserMenu(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showUserMenu]);

	return (
		<div className="min-h-screen bg-gray-50 select-none flex flex-col">
			<header className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 z-10 shadow-sm">
				<div className="max-w-5xl mx-auto px-6 py-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
								🔒
							</div>
							<h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
								Prompt Vault
							</h1>
						</div>
						<div className="flex-1" />
						<button
							onClick={() => setEditingPromptId("new")}
							className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer select-none"
							title="Create a new prompt"
						>
							<span className="text-lg">+</span>
							<span className="hidden sm:inline">New Prompt</span>
						</button>

						{/* User Profile Dropdown */}
						<div className="relative">
							<button
								onClick={() => setShowUserMenu(!showUserMenu)}
								className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer select-none"
								title="User menu"
							>
								<div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
									{userName.charAt(0).toUpperCase()}
								</div>
								<span className="hidden sm:inline text-sm font-medium text-gray-700">
									{userName}
								</span>
								<span
									className={`text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
								>
									▼
								</span>
							</button>

							{/* Dropdown Menu */}
							{showUserMenu && (
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
									<div className="px-4 py-2 border-b border-gray-100">
										<p className="text-sm font-medium text-gray-900">
											{userName}
										</p>
										<p className="text-xs text-gray-500">{userEmail}</p>
									</div>
									<button
										onClick={(e) => {
											e.preventDefault();
											handleLogout();
											setShowUserMenu(false);
										}}
										className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer select-none text-left"
									>
										<span>🚪</span>
										Sign out
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="max-w-5xl mx-auto px-6 mt-4">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<span className="text-gray-400">🔍</span>
						</div>
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Search your prompts..."
							className="w-full rounded-xl border border-gray-200 bg-white px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 cursor-text"
						/>
					</div>
				</div>

				{/* Filter Controls */}
				<div className="max-w-5xl mx-auto px-6 mt-4 flex flex-wrap gap-2 items-center">
					{/* Filter buttons */}
					<button
						onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
						className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
							showFavoritesOnly
								? "bg-red-500 text-white shadow-sm"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
						title={
							showFavoritesOnly
								? "Show all prompts"
								: "Show only favorite prompts"
						}
					>
						♥ {showFavoritesOnly ? "Favorites" : "Favorites"}
					</button>

					<button
						onClick={() => setShowArchivedOnly(!showArchivedOnly)}
						className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
							showArchivedOnly
								? "bg-blue-500 text-white shadow-sm"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
						title={
							showArchivedOnly
								? "Show all prompts"
								: "Show only archived prompts"
						}
					>
						📦 {showArchivedOnly ? "Archived" : "Archived"}
					</button>

					{/* Sort dropdown */}
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as "date" | "title")}
						className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-600 border-0 font-medium hover:bg-gray-200 transition-colors cursor-pointer select-none"
						title="Sort prompts"
					>
						<option value="date">📅 Latest</option>
						<option value="title">🔤 A-Z</option>
					</select>

					{/* Tag filter */}
					{allTags.length > 0 && (
						<>
							<div className="h-6 w-px bg-gray-300" />
							<span className="text-sm text-gray-500 font-medium">🏷️ Tags:</span>
							<button
								onClick={() => setSelectedTag(null)}
								className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
									!selectedTag
										? "bg-blue-500 text-white shadow-sm"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
								title="Show all tags"
							>
								All
							</button>
							{allTags.slice(0, 6).map((tag) => (
								<button
									key={tag}
									onClick={() =>
										setSelectedTag(selectedTag === tag ? null : tag)
									}
									className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
										selectedTag === tag
											? "bg-blue-500 text-white shadow-sm"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
									title={`Filter by ${tag} tag`}
								>
									{tag}
								</button>
							))}
							{allTags.length > 6 && (
								<span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
									+{allTags.length - 6} more
								</span>
							)}
						</>
					)}
				</div>

				{/* Active filters indicator */}
				{(selectedTag || showFavoritesOnly || showArchivedOnly) && (
					<div className="mt-2 flex gap-2 items-center">
						<span className="text-xs text-gray-500 font-medium">
							🔍 Active:
						</span>
						{selectedTag && (
							<span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 font-medium">
								🏷️ {selectedTag}
								<button
									onClick={() => setSelectedTag(null)}
									className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
									title="Remove tag filter"
								>
									×
								</button>
							</span>
						)}
						{showFavoritesOnly && (
							<span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 font-medium">
								♥ Favorites
								<button
									onClick={() => setShowFavoritesOnly(false)}
									className="ml-1 text-red-500 hover:text-red-700 font-bold"
									title="Remove favorites filter"
								>
									×
								</button>
							</span>
						)}
						{showArchivedOnly && (
							<span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 font-medium">
								📦 Archived
								<button
									onClick={() => setShowArchivedOnly(false)}
									className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
									title="Remove archived filter"
								>
									×
								</button>
							</span>
						)}
					</div>
				)}
			</header>

			<main className="flex-1 max-w-5xl mx-auto px-6 py-6">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{loading && <div>Loading...</div>}
					{!loading && prompts.length === 0 && (
						<div className="col-span-full text-center text-gray-500 mt-10">
							No prompts yet. Create one.
						</div>
					)}
					{prompts.map((p) => (
						<PromptCard
							key={p.id}
							id={p.id}
							title={p.title}
							body={p.body}
							tags={p.tags}
							isFavorite={p.isFavorite}
							isArchived={p.isArchived}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onFavorite={handleFavorite}
							onArchive={handleArchive}
						/>
					))}
				</div>

				{/* Pagination Controls */}
				{!loading && prompts.length > 0 && (
					<div className="mt-8 flex flex-col items-center gap-4">
						{/* Stats display */}
						<div className="text-sm text-gray-500">
							Showing {prompts.length} {stats && `of ${stats.totalPrompts}`}{" "}
							prompts
						</div>

						{/* Load More button */}
						{hasMore && (
							<button
								onClick={loadMore}
								disabled={loadingMore}
								className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none"
							>
								{loadingMore ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
										Loading more...
									</div>
								) : (
									"Load More"
								)}
							</button>
						)}

						{!hasMore && prompts.length > 20 && (
							<div className="text-sm text-gray-400 italic">
								🎉 You've reached the end! All prompts loaded.
							</div>
						)}
					</div>
				)}
			</main>

			{/* Conditional dialogs */}
			{editingPromptId === "new" ? (
				<NewPromptDialog
					onCreated={() => {
						load();
						loadStats();
						setEditingPromptId(null);
					}}
					onClose={() => setEditingPromptId(null)}
				/>
			) : editingPromptId ? (
				<EditPromptDialog
					promptId={editingPromptId}
					onClose={() => setEditingPromptId(null)}
					onUpdated={() => {
						load();
						loadStats();
						setEditingPromptId(null);
					}}
				/>
			) : null}

			{/* Footer with Statistics */}
			<footer className="mt-auto bg-gradient-to-r from-gray-100 to-gray-50 border-t border-gray-200">
				<div className="max-w-5xl mx-auto px-6 py-6">
					<div className="flex flex-col items-center gap-4">
						{/* App Info */}
						<div className="flex items-center gap-2 text-gray-600">
							<span className="text-lg">🔒</span>
							<span className="text-sm font-medium">Prompt Vault</span>
							<span className="text-xs text-gray-400">•</span>
							<span className="text-xs text-gray-500">
								Secure prompt management
							</span>
						</div>

						{/* Statistics */}
						{stats && (
							<div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
								<div className="flex items-center gap-1.5 text-sm">
									<span className="text-gray-400">📝</span>
									<span className="font-medium text-gray-700">
										{stats.totalPrompts}
									</span>
									<span className="text-gray-500 text-xs">prompts</span>
								</div>
								<div className="hidden sm:block w-px h-4 bg-gray-300" />
								<div className="flex items-center gap-1.5 text-sm">
									<span className="text-red-400">♥</span>
									<span className="font-medium text-gray-700">
										{stats.favoritePrompts}
									</span>
									<span className="text-gray-500 text-xs">favorites</span>
								</div>
								<div className="hidden sm:block w-px h-4 bg-gray-300" />
								<div className="flex items-center gap-1.5 text-sm">
									<span className="text-blue-400">📦</span>
									<span className="font-medium text-gray-700">
										{stats.archivedPrompts}
									</span>
									<span className="text-gray-500 text-xs">archived</span>
								</div>
								<div className="hidden sm:block w-px h-4 bg-gray-300" />
								<div className="flex items-center gap-1.5 text-sm">
									<span className="text-purple-400">🏷️</span>
									<span className="font-medium text-gray-700">
										{stats.totalTags}
									</span>
									<span className="text-gray-500 text-xs">tags</span>
								</div>
							</div>
						)}

						{/* Copyright */}
						<div className="text-xs text-gray-400 text-center">
							© 2024-2025 Indunil Illangasinghe • Built with Next.js & Prisma
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
