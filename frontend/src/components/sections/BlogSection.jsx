import AnimatedSection from "../AnimatedSection";
import SectionHeading from "../SectionHeading";
import { Badge, Card } from "../ui";
import { formatDate, mediaUrl } from "../../lib/utils";

const BlogSection = ({ posts = [] }) => {
  if (posts.length === 0) return null;

  return (
    <AnimatedSection id="blog" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Blog" title="Notes & Writeups" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden p-0">
            {post.coverImage && (
              <img src={mediaUrl(post.coverImage)} alt={post.title} className="h-40 w-full object-cover" loading="lazy" />
            )}
            <div className="flex flex-1 flex-col p-6">
              <p className="mb-2 text-xs text-text-secondary/70">{formatDate(post.publishedAt)}</p>
              <h3 className="mb-2 text-lg font-semibold">{post.title}</h3>
              <p className="mb-4 flex-1 text-sm text-text-secondary">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default BlogSection;
