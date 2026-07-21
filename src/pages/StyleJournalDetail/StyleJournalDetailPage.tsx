import { useParams, Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

export function StyleJournalDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/blogs/${id}`);
        setPost(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [id]);

  // Fetch recent posts
  useEffect(() => {
    api.get('/api/blogs?status=published')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const all = res.data.data;
          setRecentPosts(all.filter((p: any) => p._id !== id && p.slug !== id).slice(0, 3));
        }
      })
      .catch(() => {});
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

  if (loading) {
    return (
      <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
          <Link to="/style-journal" className="text-primary hover:underline">Back to Journal</Link>
        </div>
      </div>
    );
  }

  // Not implemented next/prev for dynamic yet, can be added later
  const prevPost: any = null;
  const nextPost: any = null;

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased min-h-screen flex flex-col font-body-md selection:bg-primary selection:text-on-primary">
      <Navbar />
      
      <main className="flex-grow w-full pb-20">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          
          {/* Post Header */}
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.2em] font-bold text-primary uppercase mb-4 block">
              Editorial
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-primary leading-tight mb-6 max-w-4xl mx-auto">
              {post.title}
            </h1>
            <p className="text-secondary font-body-md text-sm">
              By <span className="text-primary font-medium">{post.author || 'Admin'}</span> on {new Date(post.createdAt).toLocaleDateString()}
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
              
              <div 
                className="prose prose-lg prose-neutral max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-secondary prose-p:leading-relaxed prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
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
                      <Link to={`/style-journal/${recentPost.slug}`} key={recentPost._id} className="flex items-start gap-4 group cursor-pointer">
                        {recentPost.image ? (
                          <img src={recentPost.image} alt={recentPost.title} className="w-16 h-16 object-cover rounded-sm bg-surface-container" />
                        ) : (
                          <div className="w-16 h-16 bg-surface-container rounded-sm flex items-center justify-center text-[10px] text-outline-variant">No Img</div>
                        )}
                        <div className="flex-1">
                          <span className="text-[9px] tracking-[0.1em] font-bold text-secondary uppercase block mb-1">Editorial</span>
                          <h4 className="font-display text-sm font-medium text-primary leading-tight group-hover:underline underline-offset-2">{recentPost.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tags functionality could be added later */}
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
