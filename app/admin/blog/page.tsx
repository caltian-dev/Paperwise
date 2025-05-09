"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusCircle, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  createdAt: string
  categories: { id: string; name: string }[]
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch blog posts
    async function fetchPosts() {
      try {
        const response = await fetch("/api/blog/posts")
        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("Failed to load blog posts")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update post")
      }

      // Update the post in the state
      setPosts(posts.map((post) => (post.id === id ? { ...post, published: !currentStatus } : post)))
    } catch (err) {
      console.error("Error updating post:", err)
      alert("Failed to update post status")
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      // Remove the post from the state
      setPosts(posts.filter((post) => post.id !== id))
    } catch (err) {
      console.error("Error deleting post:", err)
      alert("Failed to delete post")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No blog posts found. Create your first post!</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleTogglePublish(post.id, post.published)}
                      className={`mr-2 p-1 rounded-full ${
                        post.published ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"
                      }`}
                      title={post.published ? "Unpublish" : "Publish"}
                    >
                      {post.published ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mr-2 p-1 rounded-full text-blue-600 hover:text-blue-900"
                      title="View"
                      target="_blank"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/blog/edit/${post.id}`}
                      className="mr-2 p-1 rounded-full text-teal-600 hover:text-teal-900"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 rounded-full text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
