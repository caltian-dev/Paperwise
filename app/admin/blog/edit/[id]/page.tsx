"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { BlogPostEditor } from "@/components/blog-post-editor"
import { MultiSelect } from "@/components/multi-select"

interface Category {
  id: string
  name: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  published: boolean
  coverImage: string | null
  categories: { id: string; name: string }[]
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [coverImage, setCoverImage] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch post")
        const data = await response.json()

        setPost(data)
        setTitle(data.title)
        setSlug(data.slug)
        setExcerpt(data.excerpt || "")
        setContent(data.content)
        setPublished(data.published)
        setCoverImage(data.coverImage || "")
        setSelectedCategories(data.categories?.map((cat: any) => cat.id) || [])
      } catch (error) {
        console.error("Error fetching post:", error)
        toast({
          title: "Error",
          description: "Failed to load blog post. Please try again.",
          variant: "destructive",
        })
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/blog/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    Promise.all([fetchPost(), fetchCategories()]).finally(() => {
      setIsLoading(false)
    })
  }, [params.id, toast])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Auto-generate slug from title if slug hasn't been manually edited
    if (!post?.slug || post.slug === generateSlug(post.title)) {
      setSlug(generateSlug(newTitle))
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSave = async () => {
    if (!title || !slug || !content) {
      toast({
        title: "Error",
        description: "Title, slug, and content are required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/blog/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          published,
          coverImage: coverImage || null,
          categoryIds: selectedCategories,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update post")
      }

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      })

      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="container py-10 text-center">Loading post...</div>
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isSaving} asChild>
            <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" /> Preview
            </a>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Post title"
                  className="mb-2"
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="content">Content</Label>
                <BlogPostEditor value={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Published</Label>
                  <Switch id="published" checked={published} onCheckedChange={setPublished} />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {published ? "This post is visible to the public" : "This post is a draft"}
                </p>
              </div>

              <div className="mb-6">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-url-slug" />
                <p className="text-sm text-gray-500 mt-1">URL: /blog/{slug}</p>
              </div>

              <div className="mb-6">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the post"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {coverImage && (
                  <div className="mt-2 rounded-md overflow-hidden">
                    <img
                      src={coverImage || "/placeholder.svg"}
                      alt="Cover preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/colorful-abstract-flow.png"
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="categories">Categories</Label>
                <MultiSelect
                  options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Select categories"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
