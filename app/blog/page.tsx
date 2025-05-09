import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NewsletterForm } from "@/components/newsletter-form"
import { executeQuery } from "@/lib/db"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  createdAt: string
  categories: { id: string; name: string }[]
}

interface BlogCategory {
  id: string
  name: string
  slug: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await executeQuery(`
      SELECT 
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
      WHERE p.published = true
      GROUP BY p.id
      ORDER BY p."createdAt" DESC
    `)
    return posts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const categories = await executeQuery(`
      SELECT c.*, COUNT(pc."postId") as post_count
      FROM "BlogCategory" c
      LEFT JOIN "BlogPostCategory" pc ON c.id = pc."categoryId"
      LEFT JOIN "BlogPost" p ON pc."postId" = p.id AND p.published = true
      GROUP BY c.id
      HAVING COUNT(pc."postId") > 0
      ORDER BY c.name
    `)
    return categories
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return []
  }
}

// Fallback data in case the database query fails
const fallbackPosts = [
  {
    id: "1",
    title: "5 Legal Documents Every Small Business Needs",
    excerpt:
      "Discover the essential legal documents that can protect your business from day one and help you avoid costly legal issues down the road.",
    slug: "essential-legal-documents",
    createdAt: "2023-05-15T00:00:00Z",
    categories: [{ id: "cat_1", name: "Business Formation" }],
  },
  {
    id: "2",
    title: "Independent Contractor vs. Employee: Legal Differences That Matter",
    excerpt:
      "Understanding the legal distinction between contractors and employees can save you from costly misclassification issues.",
    slug: "contractor-vs-employee",
    createdAt: "2023-06-02T00:00:00Z",
    categories: [{ id: "cat_4", name: "Legal Advice" }],
  },
  {
    id: "3",
    title: "How to Create a Legally Sound Return Policy",
    excerpt: "A well-crafted return policy can protect your business while keeping customers happy.",
    slug: "return-policy-guide",
    createdAt: "2023-07-10T00:00:00Z",
    categories: [{ id: "cat_2", name: "Legal Templates" }],
  },
]

const fallbackCategories = [
  { id: "cat_1", name: "Business Formation", slug: "business-formation", post_count: "2" },
  { id: "cat_2", name: "Legal Templates", slug: "legal-templates", post_count: "1" },
  { id: "cat_3", name: "Small Business", slug: "small-business", post_count: "1" },
  { id: "cat_4", name: "Legal Advice", slug: "legal-advice", post_count: "1" },
]

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()])

  // Use fallback data if the database query returns no results
  const displayPosts = posts.length > 0 ? posts : fallbackPosts
  const displayCategories = categories.length > 0 ? categories : fallbackCategories

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-heading">
                  Paperwise <span className="text-teal-600">Blog</span>
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Expert legal insights and practical advice for small businesses, entrepreneurs, and freelancers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
                <div className="grid gap-8">
                  {displayPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex flex-wrap gap-2">
                            {post.categories?.map((category) => (
                              <Badge key={category.id} variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{post.excerpt}</p>
                      </CardContent>
                      <CardFooter className="flex justify-end border-t bg-gray-50 px-6 py-3">
                        <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700" asChild>
                          <Link href={`/blog/${post.slug}`}>
                            Read more
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="sticky top-24">
                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {displayCategories.map((category) => (
                        <Badge key={category.id} variant="outline" className="cursor-pointer hover:bg-gray-100">
                          <Link href={`/blog/category/${category.slug}`} className="block px-1">
                            {category.name} {category.post_count && `(${category.post_count})`}
                          </Link>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="bg-teal-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Get the latest legal insights and tips delivered to your inbox.
                    </p>
                    <NewsletterForm />
                  </div>

                  {/* Admin Login Link - Discreet at the bottom */}
                  <div className="mt-8 text-center">
                    <Link href="/admin-login" className="text-xs text-gray-400 hover:text-teal-600">
                      Admin
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
