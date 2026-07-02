import { useParams, Link } from "react-router-dom";
import { SimpleNavbar } from "../../components/SimpleNavbar/SimpleNavbar";
import { Footer } from "../../components/Footer/Footer";
import { journalEntries } from "../../data/journalData";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

export function StyleJournalDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(journalEntries[0]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    if (id) {
      const foundPost = journalEntries.find((entry) => entry.id === Number(id));
      if (foundPost) {
        setPost(foundPost);
      }
    }
  }, [id]);

  useEffect(() => {
    api.get('/api/categories/public')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.categories)) {
          setDbCategories(res.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  if (!post) {
    return <div>Post not found</div>;
  }

  // Get recent posts (excluding current)
  const recentPosts = journalEntries.filter(p => p.id !== post.id).slice(0, 3);
  
  // Get prev and next posts
  const currentIndex = journalEntries.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? journalEntries[currentIndex - 1] : null;
  const nextPost = currentIndex < journalEntries.length - 1 ? journalEntries[currentIndex + 1] : null;

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased min-h-screen flex flex-col font-body-md selection:bg-primary selection:text-on-primary">
      <SimpleNavbar />
      
      <main className="flex-grow w-full pb-20">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          
          {/* Post Header */}
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.2em] font-bold text-primary uppercase mb-4 block">
              {post.tag}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-primary leading-tight mb-6 max-w-4xl mx-auto">
              {post.title}
            </h1>
            <p className="text-secondary font-body-md text-sm">
              By <span className="text-primary font-medium">{post.author}</span> on {post.date}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 relative">
            
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              {post.image && (
                <div className="mb-10 overflow-hidden bg-surface-container rounded-sm">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-auto max-h-[800px] object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-secondary prose-p:leading-relaxed prose-a:text-primary">
                {post.content.map((paragraph, idx) => (
                  <p key={idx} className="mb-6">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24 space-y-12">
                
                {/* Categories */}
                <div>
                  <h3 className="font-display text-xl font-medium text-primary mb-6">Categories</h3>
                  <ul className="space-y-3">
                    {dbCategories.map((category) => {
                      const catId = category.id || category._id || "";
                      return (
                        <li key={catId || category.name} className="flex items-center justify-between group">
                          <Link 
                            to={`/collection?category=${catId}&name=${encodeURIComponent(category.name)}`}
                            className="text-secondary group-hover:text-primary transition-colors text-sm w-full block"
                          >
                            {category.name}
                          </Link>
                        </li>
                      );
                    })}
                    {dbCategories.length === 0 && (
                      <li className="text-secondary text-sm italic">No categories found.</li>
                    )}
                  </ul>
                </div>

                {/* Recent Comments */}
                <div>
                  <h3 className="font-display text-xl font-medium text-primary mb-6">Recent Comments</h3>
                  <p className="text-sm text-secondary italic">No comments to show.</p>
                </div>

                {/* Recent Posts */}
                <div>
                  <h3 className="font-display text-xl font-medium text-primary mb-6">Recent Posts</h3>
                  <div className="space-y-6">
                    {recentPosts.map((recentPost) => (
                      <Link to={`/style-journal/${recentPost.id}`} key={recentPost.id} className="flex items-start gap-4 group cursor-pointer">
                        {recentPost.image ? (
                          <img src={recentPost.image} alt={recentPost.title} className="w-16 h-16 object-cover rounded-sm bg-surface-container" />
                        ) : (
                          <div className="w-16 h-16 bg-surface-container rounded-sm flex items-center justify-center text-[10px] text-outline-variant">No Img</div>
                        )}
                        <div className="flex-1">
                          <span className="text-[9px] tracking-[0.1em] font-bold text-secondary uppercase block mb-1">{recentPost.tag}</span>
                          <h4 className="font-display text-sm font-medium text-primary leading-tight group-hover:underline underline-offset-2">{recentPost.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-display text-xl font-medium text-primary mb-6">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-surface-container-low text-secondary text-xs rounded-full hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Post Navigation (Prev/Next) */}
          <div className="mt-20 pt-10 border-t border-outline-variant/20 flex items-center justify-between">
            <div className="w-1/2 pr-4 border-r border-outline-variant/20">
              {prevPost && (
                <Link to={`/style-journal/${prevPost.id}`} className="group flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-outline-variant/50 flex items-center justify-center group-hover:border-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </div>
                  <div className="flex-1 hidden md:block">
                    <span className="text-[10px] tracking-widest text-secondary uppercase block mb-1">Previous</span>
                    <h4 className="font-display text-sm font-medium text-primary line-clamp-1 group-hover:underline underline-offset-2">{prevPost.title}</h4>
                  </div>
                </Link>
              )}
            </div>
            <div className="w-1/2 pl-4 flex justify-end text-right">
              {nextPost && (
                <Link to={`/style-journal/${nextPost.id}`} className="group flex items-center justify-end gap-4">
                  <div className="flex-1 hidden md:block">
                    <span className="text-[10px] tracking-widest text-secondary uppercase block mb-1">Next</span>
                    <h4 className="font-display text-sm font-medium text-primary line-clamp-1 group-hover:underline underline-offset-2">{nextPost.title}</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-outline-variant/50 flex items-center justify-center group-hover:border-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h3 className="font-display text-3xl font-medium text-primary text-center mb-4">Leave a Comment</h3>
            <p className="text-sm text-secondary text-center mb-8">
              Logged in as Krish Panchal. <span className="text-primary hover:underline cursor-pointer">Edit your profile</span>. <span className="text-primary hover:underline cursor-pointer">Log out?</span> Required fields are marked *
            </p>
            
            <form className="flex flex-col gap-6">
              <textarea 
                placeholder="Comment" 
                rows={6}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-y"
              ></textarea>
              <div className="flex justify-center">
                <button type="button" className="bg-black text-white px-12 py-3 text-sm font-medium hover:bg-black/80 transition-colors">
                  Submit
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
