import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "@/lib/communityApi";
import { getStoredUser, getToken } from "@/lib/trustAuth";

type CommentNode = {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  author: { name: string };
  replies: CommentNode[];
};

export default function PostDetails() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const storedUser = getStoredUser();

  const load = async () => {
    try {
      const res = await communityApi.getPost(id);
      setPost(res.post);
      setComments(res.comments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    if (!getToken()) {
      setError("Please login to post a reply.");
      return;
    }
    try {
      await communityApi.addComment(id, { content: reply.trim() });
      setReply("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
    }
  };

  const handleDelete = async () => {
    if (!id || deleting) return;
    setDeleting(true);
    setError("");
    try {
      await communityApi.deletePost(id);
      navigate("/community");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
      setDeleting(false);
    }
  };

  const renderComment = (comment: CommentNode, depth = 0) => (
    <div key={comment.id} className={`${depth > 0 ? "ml-8 mt-4" : ""}`}>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-sm font-bold">{comment.author.name}</div>
        <div className="text-xs text-neutral-500 mb-2">{new Date(comment.createdAt).toLocaleString()}</div>
        <div className="text-sm text-neutral-300">{comment.content}</div>
      </div>
      {comment.replies.map((item) => renderComment(item, depth + 1))}
    </div>
  );

  if (loading) return <div className="min-h-screen bg-[#0e0e0e] text-white p-8">Loading...</div>;

  const canDelete = Boolean(post?.author?.id && storedUser?.id && post.author.id === storedUser.id);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/community")} className="text-sm text-neutral-400 mb-6">
          Back
        </button>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {post && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <div className="text-sm text-neutral-400 mb-2">
              {post.author.name} · {post.location || "Unknown"} · {new Date(post.createdAt).toLocaleString()}
            </div>
            <h1 className="text-3xl font-black mb-4">{post.title}</h1>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full max-h-[28rem] object-cover rounded-2xl border border-white/10 mb-6"
              />
            )}
            <p className="text-neutral-300 leading-7">{post.content}</p>
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="mt-6 px-4 py-3 rounded-xl bg-red-500/90 text-white font-bold"
              >
                {deleting ? "Deleting..." : "Delete Post"}
              </button>
            )}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <textarea
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 min-h-28"
            placeholder="Write a reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button onClick={handleReply} className="mt-4 px-4 py-3 rounded-xl bg-white text-black font-bold">
            Post Reply
          </button>
        </div>

        <div className="space-y-4">{comments.map((comment) => renderComment(comment))}</div>
      </div>
    </div>
  );
}
