import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NewsletterForm } from "@/components/newsletter-form"
import { executeQuery } from "@/lib/db"
import { notFound } from "next/navigation"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  published: boolean
  coverImage: string | null
  createdAt: string
  categories: { id: string; name: string }[]
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await executeQuery(
      `SELECT 
        p.*, 
        COALESCE(
          json_agg(
            json_build_object('id', c.id, 'name', c.name)
          ) FILTER (WHERE c.id IS NOT NULL), 
          '[]'
        ) as categories
      FROM "BlogPost" p
      LEFT JOIN "BlogPostCategory" pc ON p.id = pc."postId"
      LEFT JOIN "BlogCategory" c ON pc."categoryId" = c.id
      WHERE p.slug = $1 AND p.published = true
      GROUP BY p.id`,
      [slug],
    )

    return posts.length > 0 ? posts[0] : null
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

async function getRelatedPosts(postId: string, categoryIds: string[]): Promise<any[]> {
  if (!categoryIds.length) return []

  try {
    const posts = await executeQuery(
      `SELECT DISTINCT p.id, p.title, p.slug, p."createdAt"
       FROM "BlogPost" p
       JOIN "BlogPostCategory" pc ON p.id = pc."postId"
       WHERE p.published = true
       AND p.id != $1
       AND pc."categoryId" IN (${categoryIds.map((_, i) => `$${i + 2}`).join(",")})
       ORDER BY p."createdAt" DESC
       LIMIT 3`,
      [postId, ...categoryIds],
    )

    return posts
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

// Fallback data in case the database query fails
const fallbackPost = {
  id: "1",
  title: "5 Legal Documents Every Small Business Needs",
  slug: "essential-legal-documents",
  content: `
    <p>Starting a business is exciting, but it also comes with legal responsibilities. Having the right legal documents in place from the beginning can protect your business, clarify relationships with customers and partners, and help you avoid costly disputes down the road.</p>
    
    <h2>1. Business Formation Documents</h2>
    <p>Whether you're forming an LLC, corporation, or partnership, proper formation documents are the foundation of your business's legal structure. These documents define ownership, management responsibilities, and operational procedures.</p>
    <p>For LLCs, an <strong>Operating Agreement</strong> is essential, even in states where it's not legally required. This document outlines ownership percentages, voting rights, profit distributions, and what happens if an owner leaves.</p>
    <p>For corporations, <strong>Bylaws</strong> and <strong>Shareholder Agreements</strong> serve similar functions, establishing the rules for corporate governance and shareholder relationships.</p>
    
    <h2>2. Client/Customer Agreements</h2>
    <p>Every business needs a solid agreement that governs relationships with clients or customers. Depending on your business type, this might be a:</p>
    <ul>
      <li>Service Agreement</li>
      <li>Sales Contract</li>
      <li>Terms of Service</li>
      <li>Membership Agreement</li>
    </ul>
    <p>These documents should clearly outline what you're providing, payment terms, timelines, limitations of liability, and how disputes will be resolved.</p>
  `,
  createdAt: "2023-05-15T00:00:00Z",
  categories: [{ id: "cat_1", name: "Business Formation" }],
  relatedPosts: [
    {
      id: "2",
      title: "Independent Contractor vs. Employee: Legal Differences That Matter",
      slug: "contractor-vs-employee",
      createdAt: "2023-06-02T00:00:00Z",
    },
    {
      id: "3",
      title: "How to Create a Legally Sound Return Policy",
      slug: "return-policy-guide",
      createdAt: "2023-07-10T00:00:00Z",
    },
  ],
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    // Check if we're using the fallback post for development
    if (params.slug === fallbackPost.slug) {
      return renderPostPage(fallbackPost, fallbackPost.relatedPosts)
    }
    return notFound()
  }

  const categoryIds = post.categories.map((cat) => cat.id)
  const relatedPosts = await getRelatedPosts(post.id, categoryIds)

  return renderPostPage(post, relatedPosts)
}

function renderPostPage(post: any, relatedPosts: any[]) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <article className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <Button variant="ghost" size="sm" className="mb-8" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all articles
              </Link>
            </Button>

            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories?.map((category: any) => (
                  <Badge key={category.id} className="mb-4">
                    {category.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{post.title}</h1>
              <p className="text-gray-500 mb-8">{new Date(post.createdAt).toLocaleDateString()}</p>

              {post.coverImage && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

              {relatedPosts.length > 0 && (
                <div className="border-t border-gray-200 mt-12 pt-8">
                  <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-medium mb-1">{relatedPost.title}</h4>
                        <p className="text-sm text-gray-500">{new Date(relatedPost.createdAt).toLocaleDateString()}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        <section className="bg-teal-50 py-12">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h2>
              <p className="text-gray-600 mb-6">Get the latest legal insights and tips delivered to your inbox.</p>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
