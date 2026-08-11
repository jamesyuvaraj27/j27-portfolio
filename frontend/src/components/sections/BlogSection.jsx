import { motion } from "framer-motion";

import SectionKicker from "../SectionKicker";
import { Badge, Card } from "../ui";
import { formatDate, mediaUrl } from "../../lib/utils";
import { EASE, fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";

const BlogSection = ({ posts = [] }) => {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="mx-auto max-w-6xl px-6 py-24">
      <SectionKicker number="08" label="Blog" />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="mb-12 max-w-2xl text-3xl font-bold sm:text-4xl"
      >
        Notes & <span className="gradient-text italic">writeups.</span>
      </motion.h2>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
            <Card className="flex h-full flex-col overflow-hidden p-0">
              {post.coverImage && (
                <div className="overflow-hidden">
                  <img
                    src={mediaUrl(post.coverImage)}
                    alt={post.title}
                    className="h-40 w-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BlogSection;
