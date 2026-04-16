const { getSupabaseAdminClient } = require("../config/supabaseClient");

const COMMUNITY_BUCKET = process.env.SUPABASE_COMMUNITY_BUCKET || "community-posts";

const sanitizeFolderName = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "unknown-user";
};

const normalizeInventory = (inventory) => {
  if (inventory && typeof inventory === "object" && !Array.isArray(inventory)) {
    return inventory;
  }

  return {};
};

const getImageMeta = (post) => {
  const inventory = normalizeInventory(post.inventory);
  return {
    imageUrl: inventory.imageUrl || null,
    imagePath: inventory.imagePath || null,
  };
};

const ensureCommunityBucket = async (supabase) => {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (!error && Array.isArray(buckets) && buckets.some((bucket) => bucket.name === COMMUNITY_BUCKET)) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(COMMUNITY_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
  });

  if (createError && !String(createError.message || "").toLowerCase().includes("already")) {
    throw createError;
  }
};

const parseImageDataUrl = (imageDataUrl) => {
  if (!imageDataUrl) {
    return null;
  }

  const match = String(imageDataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image format");
  }

  const mimeType = match[1].toLowerCase();
  const base64 = match[2];
  const extensionMap = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const extension = extensionMap[mimeType];
  if (!extension) {
    throw new Error("Unsupported image type");
  }

  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length) {
    throw new Error("Image payload is empty");
  }

  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("Image must be 5MB or smaller");
  }

  return {
    mimeType,
    buffer,
    extension,
  };
};

const resolveCommunityFolderName = async (supabase, userId) => {
  const { data: user } = await supabase
    .from("users")
    .select("name,email")
    .eq("id", userId)
    .maybeSingle();

  return sanitizeFolderName(user?.name || user?.email || userId);
};

const getNextCommunityImageName = async (supabase, folderName, extension) => {
  const { data, error } = await supabase.storage
    .from(COMMUNITY_BUCKET)
    .list(folderName, {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    throw new Error(error.message);
  }

  let maxNumber = 0;
  for (const item of data || []) {
    const match = String(item.name || "").match(/^(\d+)\.[a-z0-9]+$/i);
    if (!match) {
      continue;
    }

    const nextValue = Number(match[1]);
    if (Number.isFinite(nextValue)) {
      maxNumber = Math.max(maxNumber, nextValue);
    }
  }

  return `${String(maxNumber + 1).padStart(2, "0")}.${extension}`;
};

const uploadCommunityImage = async (supabase, userId, imageDataUrl) => {
  const parsed = parseImageDataUrl(imageDataUrl);
  if (!parsed) {
    return { imageUrl: null, imagePath: null };
  }

  await ensureCommunityBucket(supabase);
  const folderName = await resolveCommunityFolderName(supabase, userId);
  const fileName = await getNextCommunityImageName(supabase, folderName, parsed.extension);
  const objectPath = `${folderName}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(COMMUNITY_BUCKET)
    .upload(objectPath, parsed.buffer, {
      contentType: parsed.mimeType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(COMMUNITY_BUCKET).getPublicUrl(objectPath);
  return {
    imageUrl: data?.publicUrl || null,
    imagePath: objectPath,
  };
};

const removeCommunityImage = async (supabase, imagePath) => {
  if (!imagePath) {
    return;
  }

  await supabase.storage.from(COMMUNITY_BUCKET).remove([imagePath]);
};

const mapAuthor = (user) => ({
  id: user.id,
  name: user.name || "Unknown user",
  role: user.role || "consumer",
  verified: Boolean(user.is_verified),
});

const normalizePostType = (value) => {
  if (value === "availability") return "available";
  if (value === "update") return "info";
  return value || "info";
};

const enrichPosts = async (posts) => {
  const supabase = getSupabaseAdminClient();
  const authorIds = [...new Set(posts.map((post) => post.author_id).filter(Boolean))];
  const { data: users } = authorIds.length
    ? await supabase.from("users").select("id,name,role,is_verified").in("id", authorIds)
    : { data: [] };

  const usersById = new Map((users || []).map((user) => [user.id, user]));

  return posts.map((post) => ({
    id: post.id,
    type: post.post_type,
    title: post.title,
    content: post.content,
    location: post.location,
    urgency: post.urgency,
    inventory: post.inventory || {},
    helpfulCount: post.helpful_count || 0,
    commentCount: post.comment_count || 0,
    status: post.status,
    createdAt: post.created_at,
    ...getImageMeta(post),
    author: mapAuthor(usersById.get(post.author_id) || { id: post.author_id }),
  }));
};

const listPosts = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    const posts = await enrichPosts(data || []);
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    return next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { id } = req.params;

    const { data: post, error } = await supabase
      .from("community_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      res.status(404);
      throw new Error("Post not found");
    }

    const [mappedPost] = await enrichPosts([post]);

    const { data: comments, error: commentsError } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (commentsError) {
      res.status(400);
      throw new Error(commentsError.message);
    }

    const authorIds = [...new Set((comments || []).map((comment) => comment.author_id).filter(Boolean))];
    const { data: users } = authorIds.length
      ? await supabase.from("users").select("id,name,role,is_verified").in("id", authorIds)
      : { data: [] };
    const usersById = new Map((users || []).map((user) => [user.id, user]));

    const commentMap = new Map();
    const roots = [];

    for (const comment of comments || []) {
      const mapped = {
        id: comment.id,
        content: comment.content,
        likeCount: comment.like_count || 0,
        createdAt: comment.created_at,
        parentCommentId: comment.parent_comment_id,
        author: mapAuthor(usersById.get(comment.author_id) || { id: comment.author_id }),
        replies: [],
      };
      commentMap.set(comment.id, mapped);
      if (!comment.parent_comment_id) {
        roots.push(mapped);
      }
    }

    for (const comment of comments || []) {
      if (comment.parent_comment_id && commentMap.has(comment.parent_comment_id)) {
        commentMap.get(comment.parent_comment_id).replies.push(commentMap.get(comment.id));
      }
    }

    return res.status(200).json({
      success: true,
      post: mappedPost,
      comments: roots,
    });
  } catch (error) {
    return next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { postType, title, content, location, urgency, inventory, imageDataUrl } = req.body || {};

    if (!title || !content) {
      res.status(400);
      throw new Error("title and content are required");
    }

    const normalizedType = normalizePostType(postType);
    let uploadedImage = null;

    try {
      uploadedImage = await uploadCommunityImage(supabase, req.user.id, imageDataUrl);
      const nextInventory = {
        ...normalizeInventory(inventory),
        imageUrl: uploadedImage.imageUrl,
        imagePath: uploadedImage.imagePath,
      };

      const { data, error } = await supabase
        .from("community_posts")
        .insert([
          {
            author_id: req.user.id,
            type: normalizedType,
            post_type: normalizedType,
            title,
            content,
            location: location || "",
            urgency: urgency || "medium",
            inventory: nextInventory,
          },
        ])
        .select("*")
        .single();

      if (error) {
        res.status(400);
        throw new Error(error.message);
      }

      const [post] = await enrichPosts([data]);
      return res.status(201).json({ success: true, post });
    } catch (error) {
      if (uploadedImage?.imagePath) {
        await removeCommunityImage(supabase, uploadedImage.imagePath);
      }

      throw error;
    }
  } catch (error) {
    return next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { id } = req.params;

    const { data: post, error } = await supabase
      .from("community_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const requesterRole = String(req.user?.role || "").toLowerCase();
    const canDelete =
      String(post.author_id) === String(req.user?.id) ||
      ["admin", "volunteer_inspector"].includes(requesterRole);

    if (!canDelete) {
      res.status(403);
      throw new Error("Not allowed to delete this post");
    }

    const { imagePath } = getImageMeta(post);
    if (imagePath) {
      await removeCommunityImage(supabase, imagePath);
    }

    const { error: deleteError } = await supabase.from("community_posts").delete().eq("id", id);
    if (deleteError) {
      res.status(400);
      throw new Error(deleteError.message);
    }

    return res.status(200).json({ success: true, deletedId: id });
  } catch (error) {
    return next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { id } = req.params;
    const { content, parentCommentId } = req.body || {};

    if (!content) {
      res.status(400);
      throw new Error("content is required");
    }

    const { data, error } = await supabase
      .from("community_comments")
      .insert([
        {
          post_id: id,
          author_id: req.user.id,
          parent_comment_id: parentCommentId || null,
          content,
        },
      ])
      .select("*")
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    const { data: post } = await supabase
      .from("community_posts")
      .select("comment_count")
      .eq("id", id)
      .single();

    await supabase
      .from("community_posts")
      .update({ comment_count: Number(post?.comment_count || 0) + 1 })
      .eq("id", id);

    return res.status(201).json({ success: true, comment: data });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listPosts,
  getPost,
  createPost,
  deletePost,
  addComment,
};
