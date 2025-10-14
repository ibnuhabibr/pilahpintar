import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  Plus,
  Search,
  Send,
  ThumbsUp,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CommunityPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Fetch posts from API
  const fetchPosts = async (category = "all", search = "") => {
    try {
      setPostsLoading(true);
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (search) params.append("search", search);

      const response = await axios.get(`/api/community/posts?${params}`);
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Gagal memuat postingan");
    } finally {
      setPostsLoading(false);
    }
  };

  // Initialize posts on mount
  useEffect(() => {
    fetchPosts(activeTab, searchTerm);
  }, [activeTab, searchTerm]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Submit new post
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Judul dan konten harus diisi");
      return;
    }

    try {
      setSubmittingPost(true);
      const response = await axios.post("/api/community/posts", {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category,
        tags: newPost.tags,
      });

      if (response.data.success) {
        toast.success("Postingan berhasil dibuat!");
        setNewPost({ title: "", content: "", category: "general", tags: "" });
        setShowNewPostForm(false);
        fetchPosts(activeTab, searchTerm); // Refresh posts
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Gagal membuat postingan");
    } finally {
      setSubmittingPost(false);
    }
  };

  // Submit reply
  const handleSubmitReply = async (postId) => {
    if (!newReply.trim()) {
      toast.error("Balasan tidak boleh kosong");
      return;
    }

    try {
      const response = await axios.post(
        `/api/community/posts/${postId}/replies`,
        {
          content: newReply.trim(),
        }
      );

      if (response.data.success) {
        toast.success("Balasan berhasil ditambahkan!");
        setNewReply("");

        // Update the specific post in the posts array
        setPosts(
          posts.map((post) => (post._id === postId ? response.data.post : post))
        );

        // If we're viewing post detail, update it
        if (selectedPost && selectedPost._id === postId) {
          setSelectedPost(response.data.post);
        }
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan balasan");
    }
  };

  // Like/unlike post
  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(`/api/community/posts/${postId}/like`);

      if (response.data.success) {
        // Update posts array
        setPosts(
          posts.map((post) => {
            if (post._id === postId) {
              const updatedPost = { ...post };
              if (response.data.liked) {
                updatedPost.likes = [...(post.likes || []), user._id];
              } else {
                updatedPost.likes = (post.likes || []).filter(
                  (like) => like !== user._id
                );
              }
              return updatedPost;
            }
            return post;
          })
        );

        // Update selected post if viewing detail
        if (selectedPost && selectedPost._id === postId) {
          const updatedPost = { ...selectedPost };
          if (response.data.liked) {
            updatedPost.likes = [...(selectedPost.likes || []), user._id];
          } else {
            updatedPost.likes = (selectedPost.likes || []).filter(
              (like) => like !== user._id
            );
          }
          setSelectedPost(updatedPost);
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Gagal menyukai postingan");
    }
  };

  // Get formatted time
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik lalu`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const labels = {
      general: "Umum",
      tips: "Tips",
      pengalaman: "Pengalaman",
      lokasi: "Lokasi",
      "tanya-jawab": "Tanya Jawab",
      berita: "Berita",
    };
    return labels[category] || category;
  };

  // Show loading or redirect if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const categories = [
    { id: "all", label: "Semua", count: posts.length },
    {
      id: "tips",
      label: "Tips & Trik",
      count: posts.filter((p) => p.category === "tips").length,
    },
    {
      id: "pengalaman",
      label: "Pengalaman",
      count: posts.filter((p) => p.category === "pengalaman").length,
    },
    {
      id: "lokasi",
      label: "Lokasi TPS",
      count: posts.filter((p) => p.category === "lokasi").length,
    },
    {
      id: "diskusi",
      label: "Diskusi Umum",
      count: posts.filter((p) => p.category === "diskusi").length,
    },
  ];

  const filteredPosts =
    activeTab === "all"
      ? posts
      : posts.filter((post) => post.category === activeTab);

  const handleReply = (postId) => {
    handleSubmitReply(postId);
  };

  const handleOldReply = (postId) => {
    if (!newReply.trim()) return;

    const reply = {
      id: Date.now(),
      content: newReply,
      author: user.name,
      createdAt: "Baru saja",
      likes: 0,
    };

    setPosts(
      posts.map((post) =>
        post._id === postId
          ? { ...post, replies: [...post.replies, reply] }
          : post
      )
    );
    setNewReply("");
  };

  const openPostDetail = (post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-display mb-2">
                  Forum Komunitas PilahPintar
                </h1>
                <p className="text-primary-100 text-lg">
                  Berbagi pengalaman, tips, dan diskusi seputar pengelolaan
                  sampah
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="text-lg font-semibold">1,247</span>
                </div>
                <div className="text-primary-100 text-sm">Anggota Aktif</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 lg:mr-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari topik diskusi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowNewPostForm(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Buat Topik Baru</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === category.id
                    ? "bg-primary-600 text-white"
                    : "bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Forum Posts */}
        <div className="space-y-4">
          {postsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-neutral-600 mt-4">Memuat postingan...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">
                Belum ada postingan
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Jadilah yang pertama berbagi di komunitas ini!
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowNewPostForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Postingan
                </button>
              </div>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={
                      post.author?.avatar ||
                      `https://ui-avatars.io/api/?name=${encodeURIComponent(
                        post.author?.name || "User"
                      )}&background=0D8ABC&color=fff`
                    }
                    alt={post.author?.name || "User"}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-800 hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {getCategoryLabel(post.category)}
                      </span>
                    </div>
                    <p className="text-neutral-600 mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-neutral-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author?.name || "Anonim"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{getTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePost(post._id);
                          }}
                          className="flex items-center space-x-1 text-neutral-500 hover:text-primary-600 transition-colors"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes?.length || 0}</span>
                        </button>
                        <button
                          onClick={() => openPostDetail(post)}
                          className="flex items-center space-x-1 text-neutral-500 hover:text-primary-600 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.replies?.length || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* New Post Modal */}
        {showNewPostForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-800">
                  Buat Topik Diskusi Baru
                </h2>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Judul Topik
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Masukkan judul topik diskusi..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({ ...newPost, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="general">Umum</option>
                    <option value="tips">Tips & Trik</option>
                    <option value="pengalaman">Pengalaman</option>
                    <option value="lokasi">Lokasi TPS</option>
                    <option value="tanya-jawab">Tanya Jawab</option>
                    <option value="berita">Berita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Konten
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tulis konten diskusi Anda di sini..."
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submittingPost}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submittingPost ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memposting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Posting
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="flex-1 bg-neutral-200 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-300 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Post Detail Modal */}
        {showPostDetail && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-800">
                  Detail Diskusi
                </h2>
                <button
                  onClick={() => setShowPostDetail(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>

              {/* Original Post */}
              <div className="border-b border-neutral-200 pb-6 mb-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedPost.avatar}
                    alt={selectedPost.author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-800">
                        {selectedPost.title}
                      </h3>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {
                          categories.find((c) => c.id === selectedPost.category)
                            ?.label
                        }
                      </span>
                    </div>
                    <p className="text-neutral-600 mb-3">
                      {selectedPost.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-neutral-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{selectedPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedPost.createdAt}</span>
                      </div>
                      <button
                        onClick={() => handleLikePost(selectedPost._id)}
                        className="flex items-center space-x-1 text-neutral-500 hover:text-primary-600 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{selectedPost.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-neutral-800">
                  Balasan ({selectedPost.replies.length})
                </h4>
                {selectedPost.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-neutral-800">
                          {reply.author}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {reply.createdAt}
                        </span>
                      </div>
                      <p className="text-neutral-600 mb-2">{reply.content}</p>
                      <button className="flex items-center space-x-1 text-xs text-neutral-500 hover:text-primary-600 transition-colors">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{reply.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {selectedPost.replies.length === 0 && (
                  <p className="text-neutral-500 text-center py-4">
                    Belum ada balasan. Jadilah yang pertama untuk membalas!
                  </p>
                )}
              </div>

              {/* Reply Form */}
              <div className="border-t border-neutral-200 pt-6">
                <h4 className="font-semibold text-neutral-800 mb-4">
                  Tulis Balasan
                </h4>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
                      placeholder="Tulis balasan Anda..."
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setNewReply("")}
                        className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleReply(selectedPost._id)}
                        disabled={!newReply.trim()}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Balas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
