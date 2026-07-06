import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    n: "1",
    title: "Post Your Event",
    desc: "Create a listing with Gold, Silver, Bronze tiers — each with a price and benefit list.",
  },
  {
    n: "2",
    title: "Receive Proposals",
    desc: "Sponsors submit proposals with their budget. Review all of them in your dashboard.",
  },
  {
    n: "3",
    title: "Negotiate Budget",
    desc: "Not satisfied? Send a counter-offer. Sponsor accepts or rejects with one click.",
  },
  {
    n: "4",
    title: "Confirm the Deal",
    desc: "Approve and it's done. Both sides get an automatic email confirmation via Brevo.",
  },
];

const Home = () => {
  return (
    <>
      {/* ── Hero Section ── */}
      <section className="min-h-[calc(100vh-58px)] bg-base-200 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden border-b border-base-300">
        {/* background glow */}
        <div className="absolute pointer-events-none -top-50 left-1/2 -translate-x-1/2 w-160 h-160 rounded-full bg-primary/10 blur-3xl" />

        {/* Chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold mb-5 border z-10 bg-primary/10 text-primary border-primary/20">
          ✦ Sponsorship Marketplace
        </div>

        <h1 className="font-extrabold text-5xl mb-4 z-10 text-[color-mix(in_srgb,var(--color-secondary)_15%,#fff)]">
          The smarter way to <br />
          <span className="text-primary">fund your events</span>
        </h1>

        <p className="text-base-content/60 max-w-115 mx-auto mb-8 text-md z-10">
          Post events, collect sponsor proposals, negotiate budgets, and confirm
          deals — without a single email chain.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 z-10">
          <Link
            to="/"
            className="btn btn-primary font-semibold btn-md text-amber-50"
          >
            Post Your Event →
          </Link>
          <Link
            to="/"
            className="btn btn-md bg-transparent font-medium border border-primary text-primary hover:bg-primary/20"
          >
            Browse Events
          </Link>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="bg-base-100 py-14 px-6 border-b border-b-base-300">
        <div className="max-w-290 mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-extrabold text-3xl mb-2 text-[color-mix(in_srgb,var(--color-secondary)15%,#fff)]">
              How It Works
            </h2>
            <p className="text-base-content/50 text-sm">
              From event listing to confirmed sponsor in 4 steps
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="card border-2 border-base-300  shadow-sm "
              >
                <div className="card-body items-center text-center gap-3 p-5">
                  <div className="flex items-center justify-center bg-primary text-amber-50 font-bold rounded-[9px] shrink-0 text-md w-9 h-9 font-mono">
                    {s.n}
                  </div>

                  <h3 className="card-title text-base font-bold text-base-content justify-center">
                    {s.title}
                  </h3>
                  <p className="text-base-content/50 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 px-6 text-center bg-base-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-extrabold mb-3 text-3xl text-[color-mix(in_srgb,var(--color-secondary)_15%,#fff)]">
            Tailored for the <span className="text-primary">Ecosystem</span>
          </h2>
          <p className="text-base-content/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            Whether you're organizing a boutique tech summit or a global
            festival, SponsorSync provides the tools to succeed.
          </p>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1: For Event Organizers */}
            <div className="bg-primary/10 border border-base-300 rounded-2xl p-8 flex flex-col justify-between text-left h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <svg
                    xmlns="http://w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.34 15.84c-.68-.34-1.44-.2-1.95.34l-2.05 2.18A1 1 0 0 1 4.7 17.5V6.5a1 1 0 0 1 .5-.86l8-4.62a1 1 0 0 1 1 0l8 4.62a1 1 0 0 1 .5.86v4.75a1 1 0 0 1-.22.62l-2.5 3.07a1.5 1.5 0 0 1-2.12.22l-1.02-.8a.5.5 0 0 0-.52 0l-3 2a.5.5 0 0 0-.52 0Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  For Event Organizers
                </h3>
                <p className="text-base-content/50 text-sm mb-6 leading-relaxed">
                  Maximize your event's potential by reaching a curated network
                  of corporate sponsors looking for high-impact visibility.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                    <span className="text-primary/80">✔</span> Dynamic
                    Sponsorship Tiers & Benefits
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                    <span className="text-primary/80">✔</span> Real-time
                    Negotiation Dashboard
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                    <span className="text-primary/80">✔</span> Automated
                    Contracts & Invoicing
                  </li>
                </ul>
              </div>
              <Link to="/create-event" className="w-full bg-primary/40 text-base-content  text-center font-semibold py-3 px-4 rounded-xl text-sm transition-colors mt-auto  hover:bg-primary  hover:text-base-100/70">
                Create Your Event
              </Link>
            </div>

            {/* Card 2: For Corporate Sponsors */}
            <div className="bg-secondary/10 border border-base-300 rounded-2xl p-8 flex flex-col justify-between text-left h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)] mb-6">
                  <svg
                    xmlns="http://w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18 9 11.25l4.306 4.306a1.194 1.194 0 0 0 1.698 0L21.75 6.5m0 0H17.25m4.5 0v4.5"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)] mb-3">
                  For Corporate Sponsors
                </h3>
                <p className="text-base-content/50 text-sm mb-6 leading-relaxed">
                  Deploy your marketing budget with precision. Discover events
                  that align perfectly with your brand identity and target
                  audience.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                    <span className="text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]">
                      ✔
                    </span>{" "}
                    Audience Matching Algorithms
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                    <span className="text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]">
                      ✔
                    </span>{" "}
                    ROI Tracking & Performance Data
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                    <span className="text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]">
                      ✔
                    </span>{" "}
                    Direct Line to Decision Makers
                  </li>
                </ul>
              </div>
              
              <Link to='/events' className="w-full bg-secondary/20 text-base-content text-center hover:bg-[color-mix(in_srgb,var(--color-secondary)_30%,#fff)] hover:text-secondary font-semibold py-3 px-4 rounded-xl text-sm transition-colors mt-auto">
                Browse Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
