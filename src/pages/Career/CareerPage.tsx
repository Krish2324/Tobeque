import { useState } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";

const jobOpenings = [
  {
    id: 1,
    title: "Digital Marketing Executive",
    location: "Gurgaon",
    type: "Full-Time",
    department: "Marketing",
    description:
      "We are looking for a creative and data-driven Digital Marketing Executive to help us grow our online presence, manage campaigns, and engage with our community across social media platforms.",
    responsibilities: [
      "Plan and execute digital marketing campaigns across social media, email, and search",
      "Manage and grow social media accounts (Instagram, Facebook, Pinterest)",
      "Create compelling content that resonates with our teen audience",
      "Analyze campaign performance and report key metrics",
      "Collaborate with the design team for creative assets",
    ],
    requirements: [
      "1-3 years of experience in digital marketing",
      "Proficiency in social media platforms and analytics tools",
      "Excellent written communication skills",
      "Knowledge of SEO/SEM and Google Analytics",
      "Passion for fashion and youth culture",
    ],
  },
];

export function CareerPage() {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState("All Job Type");
  const [locationFilter, setLocationFilter] = useState("All Job Location");

  const jobTypes = ["All Job Type", "Full-Time", "Part-Time", "Internship"];
  const locations = ["All Job Location", "Gurgaon", "Delhi", "Remote"];

  const filtered = jobOpenings.filter((job) => {
    const typeMatch = typeFilter === "All Job Type" || job.type === typeFilter;
    const locationMatch =
      locationFilter === "All Job Location" || job.location === locationFilter;
    return typeMatch && locationMatch;
  });

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 mt-[64px] pt-10 pb-20 px-6 md:px-12 max-w-[900px] mx-auto w-full">
        <h1 className="text-3xl font-semibold text-primary mb-8 tracking-tight">
          Job Openings
        </h1>

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
                  <p className="text-[13px] text-secondary leading-relaxed mb-6 mt-4">
                    {job.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-[12px] font-bold uppercase tracking-widest text-primary mb-3">
                        Responsibilities
                      </h3>
                      <ul className="space-y-2">
                        {job.responsibilities.map((r, i) => (
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
                    <div>
                      <h3 className="text-[12px] font-bold uppercase tracking-widest text-primary mb-3">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {job.requirements.map((r, i) => (
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
                    <a
                      href="mailto:care@tobeque.com?subject=Application for Digital Marketing Executive"
                      className="inline-block bg-primary text-on-primary text-[12px] font-semibold tracking-widest uppercase px-8 py-3 hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Apply Now
                    </a>
                    <p className="text-[11px] text-secondary mt-3">
                      Send your resume to{" "}
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
