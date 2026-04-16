import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { communityApi } from "@/lib/communityApi";

export default function CreatePost() {
  const navigate = useNavigate();
  const [postType, setPostType] = useState("emergency");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageDataUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError("");
      setImageDataUrl(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => setError("Failed to read image");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await communityApi.createPost({
        postType,
        title,
        content,
        location,
        urgency,
        imageDataUrl: imageDataUrl || undefined,
      });
      navigate(`/community/post/${res.post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Create Post</h1>
        <p className="text-sm text-neutral-400 mb-8">Publish a real update to the community feed</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
          >
            <option value="emergency">Emergency</option>
            <option value="availability">Availability</option>
            <option value="update">Update</option>
          </select>

          <input
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 min-h-40"
            placeholder="What should people know?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="space-y-3">
            <input
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-bold file:text-black"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageDataUrl && (
              <img src={imageDataUrl} alt="Post preview" className="w-full max-h-80 object-cover rounded-xl border border-white/10" />
            )}
          </div>

          <input
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/community")}
              className="px-4 py-3 rounded-xl border border-white/20"
            >
              Cancel
            </button>
            <button className="px-4 py-3 rounded-xl bg-white text-black font-bold" type="submit" disabled={busy}>
              {busy ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
