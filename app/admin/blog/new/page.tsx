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
import { ArrowLeft, Save } from "lucide-react"
import { BlogPostEditor } from "@/components/blog-post-editor"
import { MultiSelect } from "@/components/multi-select"

interface Category {
  id: string
  name: string
}

export default function NewBlogPostPage() {
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
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/blog/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Auto-generate slug from title
    setSlug(generateSlug(newTitle))
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
      const response = await fetch("/api/blog/posts", {
        method: "POST",
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
        throw new Error(error.message || "Failed to create post")
      }

      toast({
        title: "Success",
        description: "Blog post created successfully",
      })

      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
        </Button>
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
                  {published ? "This post will be visible to the public" : "This post will be saved as a draft"}
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
