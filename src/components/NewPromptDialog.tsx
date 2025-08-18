"use client"

import { useState } from "react"

interface NewPromptDialogProps {
  onCreated: () => void
  onClose?: () => void
}

export default function NewPromptDialog({ onCreated, onClose }: NewPromptDialogProps) {
  const [open, setOpen] = useState(true)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const [busy, setBusy] = useState(false)

  async function save() {
    if (!title.trim() || !body.trim()) return
    setBusy(true)
    
    const res = await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        tags: tags.split(",").map(t => t.trim()).filter(Boolean)
      })
    })

    if (res.ok) {
      onCreated()
      handleClose()
    } else {
      const errorData = await res.json()
      console.error("Failed to create prompt", res.status, errorData)
      alert(`Failed to create prompt: ${errorData.error || 'Unknown error'}`)
    }
    
    setBusy(false)
  }

  function handleClose() {
    setOpen(false)
    setTitle("")
    setBody("")
    setTags("")
    onClose?.()
  }

  const canSave = title.trim().length > 0 && body.trim().length > 0

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="w-full max-w-xl rounded-2xl bg-white p-4">
        <div className="text-lg font-semibold mb-3">Create a new prompt</div>
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-xl border px-3 py-2 h-40"
            placeholder="Write your prompt"
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Tags separated by comma"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button 
            onClick={handleClose} 
            className="px-4 py-2 rounded-xl border hover:bg-gray-50"
            disabled={busy}
          >
            Cancel
          </button>
          <button 
            disabled={!canSave || busy} 
            onClick={save} 
            className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700"
          >
            {busy ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}