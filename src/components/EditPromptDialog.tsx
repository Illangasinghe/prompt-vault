"use client"

import { useState, useEffect } from "react"

interface EditPromptDialogProps {
  promptId: string | null
  onClose: () => void
  onUpdated: () => void
}

export default function EditPromptDialog({ promptId, onClose, onUpdated }: EditPromptDialogProps) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [isArchived, setIsArchived] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (promptId) {
      loadPrompt()
    }
  }, [promptId])

  async function loadPrompt() {
    if (!promptId) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/prompts/${promptId}`)
      if (res.ok) {
        const prompt = await res.json()
        setTitle(prompt.title)
        setBody(prompt.body)
        setTags(prompt.tags.join(", "))
        setIsFavorite(prompt.isFavorite)
        setIsArchived(prompt.isArchived)
      } else {
        console.error("Failed to load prompt")
        onClose()
      }
    } catch (error) {
      console.error("Error loading prompt:", error)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    if (!promptId || !title.trim() || !body.trim()) return
    
    setBusy(true)
    try {
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          isFavorite,
          isArchived
        })
      })

      if (res.ok) {
        onUpdated()
        onClose()
        // Reset form
        setTitle("")
        setBody("")
        setTags("")
        setIsFavorite(false)
        setIsArchived(false)
      } else {
        const errorData = await res.json()
        alert(`Failed to update prompt: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error updating prompt:", error)
      alert("Failed to update prompt")
    } finally {
      setBusy(false)
    }
  }

  if (!promptId) return null

  const canSave = title.trim().length > 0 && body.trim().length > 0

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="w-full max-w-xl rounded-2xl bg-white p-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer select-none"
          title="Close"
        >
          ✕
        </button>
        
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : (
          <>
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
              
              {/* Toggles */}
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={e => setIsFavorite(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Favorite</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isArchived}
                    onChange={e => setIsArchived(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Archived</span>
                </label>
              </div>
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button 
                onClick={onClose} 
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
                {busy ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
