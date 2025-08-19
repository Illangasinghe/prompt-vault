"use client";

import { useState } from "react";

interface PromptCardProps {
	id: string;
	title: string;
	body: string;
	tags?: string[];
	isFavorite?: boolean;
	isArchived?: boolean;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onFavorite: (id: string, isFavorite: boolean) => void;
	onArchive: (id: string, isArchived: boolean) => void;
}

export default function PromptCard({
	id,
	title,
	body,
	tags = [],
	isFavorite = false,
	isArchived = false,
	onEdit,
	onDelete,
	onFavorite,
	onArchive,
}: PromptCardProps) {
	const [copied, setCopied] = useState(false);
	const [showActions, setShowActions] = useState(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(body);
			setCopied(true);
			setTimeout(() => setCopied(false), 1200);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}

	async function handleDelete() {
		if (confirm("Are you sure you want to delete this prompt?")) {
			onDelete(id);
		}
	}

	return (
		<div
			className={`rounded-2xl bg-white shadow-sm p-4 border hover:shadow-md transition-all duration-200 relative group cursor-pointer select-none ${
				isArchived
					? "border-gray-200 bg-gray-50"
					: "border-gray-200 hover:border-gray-300"
			} ${isFavorite ? "ring-1 ring-red-100" : ""}`}
			onClick={() => onEdit(id)}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			{/* Action buttons */}
			<div
				className={`absolute top-2 right-2 flex gap-1.5 transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}
			>
				<button
					onClick={(e) => {
						e.stopPropagation();
						onFavorite(id, !isFavorite);
					}}
					className={`p-2 rounded-lg text-base transition-colors cursor-pointer select-none ${
						isFavorite
							? "text-red-500 bg-red-50 hover:bg-red-100"
							: "text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-500"
					}`}
					title={isFavorite ? "Remove from favorites" : "Add to favorites"}
				>
					♥
				</button>
				<button
					onClick={(e) => {
						e.stopPropagation();
						onArchive(id, !isArchived);
					}}
					className={`p-2 rounded-lg text-base transition-colors cursor-pointer select-none ${
						isArchived
							? "text-blue-500 bg-blue-50 hover:bg-blue-100"
							: "text-gray-400 bg-gray-50 hover:bg-blue-50 hover:text-blue-500"
					}`}
					title={isArchived ? "Unarchive prompt" : "Archive prompt"}
				>
					📦
				</button>
				<button
					onClick={(e) => {
						e.stopPropagation();
						handleDelete();
					}}
					className="p-2 rounded-lg text-base text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer select-none"
					title="Delete prompt"
				>
					🗑️
				</button>
			</div>

			{/* Copy button - always visible in bottom right */}
			<button
				onClick={(e) => {
					e.stopPropagation();
					handleCopy();
				}}
				className={`absolute bottom-3 right-3 p-2 rounded-lg text-base transition-all duration-200 shadow-md cursor-pointer select-none ${
					copied
						? "bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-110"
						: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
				}`}
				title={copied ? "Copied to clipboard!" : "Copy to clipboard"}
			>
				{copied ? "✓" : "📋"}
			</button>

			{/* Status indicators */}
			<div className="absolute top-2 left-2 flex gap-1">
				{isFavorite && <div className="text-red-500 text-sm">♥</div>}
				{isArchived && <div className="text-blue-500 text-sm">📦</div>}
			</div>

			{/* Content */}
			<div
				className={`font-medium line-clamp-1 pr-20 pb-12 ${isFavorite || isArchived ? "pl-6" : ""} ${isArchived ? "opacity-60" : ""}`}
			>
				{title}
			</div>
			<p
				className={`text-sm text-gray-500 line-clamp-3 mt-1 whitespace-pre-wrap mb-3 ${isArchived ? "opacity-60" : ""}`}
			>
				{body}
			</p>

			{/* Tags */}
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-1 mb-3">
					{tags.map((t) => (
						<span
							key={t}
							className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
								isArchived
									? "bg-gray-50 text-gray-400"
									: "bg-blue-50 text-blue-700 border border-blue-100"
							}`}
						>
							{t}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
