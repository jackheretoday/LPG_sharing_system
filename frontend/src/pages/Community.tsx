import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { communityApi } from "@/lib/communityApi";
import { getToken } from "@/lib/trustAuth";

type CommunityPost = {
  id: string;
  type: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  location?: string;
  urgency?: string;
  helpfulCount: number;
  commentCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    verified?: boolean;
  };
};

export default function Community() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authNotice, setAuthNotice] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await communityApi.listPosts();
        setPosts(res.posts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filteredPosts = useMemo(() => {
    if (filter === "All") return posts;
    if (filter === "Emergency") return posts.filter((post) => post.type === "emergency");
    if (filter === "Available") return posts.filter((post) => post.type === "available");
    return posts;
  }, [filter, posts]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Community</h1>
            <p className="text-sm text-neutral-400 mt-2">Live updates from the LPG network</p>
          </div>
          <button
            onClick={() => {
              if (!getToken()) {
                setAuthNotice("Please login to create a post.");
                return;
              }
              setAuthNotice("");
              navigate("/community/create");
            }}
            className="bg-white text-black px-4 py-3 rounded-xl text-sm font-black"
          >
            Create Post
          </button>
        </div>
        {authNotice && (
          <div className="mb-6 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm text-amber-100 flex items-center justify-between gap-3">
            <span>{authNotice}</span>
            <button onClick={() => navigate("/auth")} className="rounded-lg bg-white text-black px-3 py-1.5 text-xs font-semibold">
              Login
            </button>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          {["All", "Emergency", "Available"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-full text-xs font-bold ${
                filter === item ? "bg-white text-black" : "bg-white/5 text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && <div className="text-neutral-400">Loading posts...</div>}
        {error && <div className="text-red-400">{error}</div>}

        <div className="space-y-5">
          {filteredPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => navigate(`/community/post/${post.id}`)}
              className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{post.author.name}</span>
                    {post.author.verified && (
                      <span className="text-[10px] uppercase tracking-widest text-emerald-400">Verified</span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {post.location || "Unknown location"} · {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                    post.type === "emergency" ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white"
                  }`}
                >
                  {post.type}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-2xl border border-white/10 mb-4"
                />
              )}
              <p className="text-sm text-neutral-300 leading-6 mb-4">{post.content}</p>
              <div className="text-xs text-neutral-500">
                {post.helpfulCount} helpful · {post.commentCount} comments
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
