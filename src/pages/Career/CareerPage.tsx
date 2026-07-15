import { useState, useEffect } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  cv: File | null;
  consent: boolean;
}

interface ApplyModalProps {
  jobTitle: string;
  onClose: () => void;
}

function ApplyModal({ jobTitle, onClose }: ApplyModalProps) {
  const { user, token } = useAuth();
  const [form, setForm] = useState<ApplicationForm>({
    fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "",
    cv: null,
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [cvError, setCvError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, consent: e.target.checked }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "doc", "docx"].includes(ext || "")) {
        setCvError("Only PDF, DOC, DOCX files allowed.");
        setForm((prev) => ({ ...prev, cv: null }));
        e.target.value = "";
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setCvError("File size must be under 10 MB.");
        setForm((prev) => ({ ...prev, cv: null }));
        e.target.value = "";
        return;
      }
      setCvError("");
      setForm((prev) => ({ ...prev, cv: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.consent) {
      setError("Please agree to the data storage consent.");
      return;
    }
    if (!form.cv) {
      setError("Please upload your CV/Resume.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("jobTitle", jobTitle);
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("bio", form.bio);
      formData.append("cv", form.cv);

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/job-applications", {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-outline-variant">
          <h2 className="text-[18px] font-semibold text-primary tracking-tight">
            Apply for this position
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="px-8 py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-green-500 mb-4 block">
              check_circle
            </span>
            <h3 className="text-[18px] font-semibold text-primary mb-2">
              Application Submitted!
            </h3>
            <p className="text-[13px] text-secondary mb-6 max-w-xs mx-auto leading-relaxed">
              Thank you for applying for <strong>{jobTitle}</strong>. We'll review your application and get back to you soon.
            </p>
            <button
              onClick={onClose}
              className="bg-primary text-on-primary text-[12px] font-semibold tracking-widest uppercase px-8 py-3 hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            <p className="text-[12px] text-secondary">
              <span className="font-semibold text-primary">Position:</span> {jobTitle}
            </p>

            {/* Full Name */}
            <div>
              <label className="block text-[12px] font-medium text-primary mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full border border-outline-variant px-4 py-2.5 text-[13px] text-primary focus:outline-none focus:border-primary transition-colors"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-medium text-primary mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-outline-variant px-4 py-2.5 text-[13px] text-primary focus:outline-none focus:border-primary transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[12px] font-medium text-primary mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-outline-variant px-4 py-2.5 text-[13px] text-primary focus:outline-none focus:border-primary transition-colors"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[12px] font-medium text-primary mb-1.5">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                required
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="w-full border border-outline-variant px-4 py-2.5 text-[13px] text-primary focus:outline-none focus:border-primary transition-colors resize-y"
                placeholder="Tell us about yourself, your experience and why you'd like to join Tobeque..."
              />
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-[12px] font-medium text-primary mb-1.5">
                Upload CV/Resume <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFile}
                className="block w-full text-[12px] text-secondary file:mr-4 file:py-2 file:px-4 file:border file:border-outline-variant file:text-[11px] file:font-semibold file:text-primary file:bg-white hover:file:bg-neutral-50 file:cursor-pointer file:transition-colors"
              />
              <p className="text-[10px] text-secondary mt-1">
                Allowed Type(s): .pdf, .doc, .docx — max 10 MB
              </p>
              {cvError && <p className="text-[11px] text-red-500 mt-1">{cvError}</p>}
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={form.consent}
                onChange={handleCheckbox}
                className="mt-0.5 cursor-pointer accent-primary"
              />
              <label htmlFor="consent" className="text-[12px] text-secondary leading-relaxed cursor-pointer">
                By using this form you agree with the storage and handling of your data by this website.{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[12px] text-red-500 font-medium">{error}</p>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-primary text-on-primary text-[12px] font-semibold tracking-widest uppercase px-8 py-3 hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function CareerPage() {
  const [jobOpenings, setJobOpenings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("All Job Type");
  const [locationFilter, setLocationFilter] = useState("All Job Location");
  const [applyingForJob, setApplyingForJob] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/api/job-postings/public');
        setJobOpenings(response.data.data);
      } catch (error) {
        console.error("Failed to load job postings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const jobTypes = ["All Job Type", "Full-time", "Part-time", "Contract", "Internship"];
  const locations = ["All Job Location", ...Array.from(new Set(jobOpenings.map(j => j.location)))];

  const filtered = jobOpenings.filter((job) => {
    const typeMatch = typeFilter === "All Job Type" || job.type === typeFilter;
    const locationMatch =
      locationFilter === "All Job Location" || job.location === locationFilter;
    return typeMatch && locationMatch;
  });

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />

      {applyingForJob && (
        <ApplyModal
          jobTitle={applyingForJob}
          onClose={() => setApplyingForJob(null)}
        />
      )}

      <main className="flex-1 mt-[64px] pt-10 pb-20 px-6 md:px-12 max-w-[900px] mx-auto w-full">
        <h1 className="text-3xl font-semibold text-primary mb-8 tracking-tight">
          Job Openings
        </h1>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-outline-variant bg-white text-[13px] text-secondary px-4 py-2 pr-8 focus:outline-none focus:border-primary cursor-pointer appearance-none rounded-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            {jobTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-outline-variant bg-white text-[13px] text-secondary px-4 py-2 pr-8 focus:outline-none focus:border-primary cursor-pointer appearance-none rounded-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Job Listings */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="text-secondary text-sm italic">
              No job openings match your filters.
            </p>
          )}
          {filtered.map((job) => (
            <div
              key={job.id}
              className="border border-outline-variant bg-white"
            >
              {/* Job Row */}
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                onClick={() =>
                  setExpandedJob(expandedJob === job.id ? null : job.id)
                }
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-[14px] text-primary">
                    {job.title}
                  </span>
                  <span className="text-[11px] text-secondary border border-outline-variant px-2 py-0.5 rounded-sm">
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[13px] text-secondary hidden sm:block">
                    {job.location}
                  </span>
                  <button
                    className="text-[13px] text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedJob(expandedJob === job.id ? null : job.id);
                    }}
                  >
                    {expandedJob === job.id ? "Close" : "More Details"}
                    <span
                      className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${expandedJob === job.id ? "rotate-180" : ""}`}
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedJob === job.id && (
                <div className="px-6 pb-8 pt-2 border-t border-outline-variant/40 bg-neutral-50/50">
                  <div className="flex items-center gap-6 mb-4 mt-4 text-[12px] text-secondary">
                    <span><span className="font-semibold">Job Type:</span> {job.type}</span>
                    <span><span className="font-semibold">Job Location:</span> {job.location}</span>
                  </div>
                  <p className="text-[13px] text-secondary leading-relaxed mb-6">
                    {job.description}
                  </p>

                  <div className="grid md:grid-cols-1 gap-8">
                    <div>
                      <h3 className="text-[12px] font-bold uppercase tracking-widest text-primary mb-3">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {job.requirements && job.requirements.map((r: string, i: number) => (
                          <li
                            key={i}
                            className="text-[13px] text-secondary flex gap-2"
                          >
                            <span className="text-primary mt-0.5">–</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => setApplyingForJob(job.title)}
                      className="inline-block bg-primary text-on-primary text-[12px] font-semibold tracking-widest uppercase px-8 py-3 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Apply Now
                    </button>
                    <p className="text-[11px] text-secondary mt-3">
                      Or send your resume to{" "}
                      <a
                        href="mailto:care@tobeque.com"
                        className="underline hover:text-primary"
                      >
                        care@tobeque.com
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No openings callout */}
        <div className="mt-12 border border-outline-variant p-8 text-center">
          <p className="text-[13px] text-secondary leading-relaxed">
            Don't see a role for you?{" "}
            <a
              href="mailto:care@tobeque.com"
              className="text-primary underline hover:no-underline"
            >
              Send us your portfolio
            </a>{" "}
            and we'll keep you in mind for future opportunities.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
