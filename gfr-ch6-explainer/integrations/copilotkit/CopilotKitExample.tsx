"use client";
/* CopilotKit — GFR 2017 Chapter 6 copilot.
   The runtime is already served by gfr-ch6-explainer/server.js at /api/copilotkit,
   which speaks the AG-UI event protocol over SSE.

   1.  cd gfr-ch6-explainer && node server.js 8080
   2.  npm install @copilotkit/react-core @copilotkit/react-ui
   3.  paste this component into your app
*/
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function GfrChapter6Copilot() {
  return (
    <CopilotKit
      /* the deployed runtime — no API key, no model call */
      runtimeUrl="/api/copilotkit"
      /* if the server runs on another origin, use the absolute URL and make sure
         it sends CORS headers (it sends access-control-allow-origin: *):
         runtimeUrl="http://localhost:8080/api/copilotkit" */
      publicApiKey={undefined}
    >
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1>GFR 2017 · Chapter 6</h1>
        <p>
          Procurement of Goods and Services, Rules 142–206. Har rule, sub-rule, clause,
          proviso, explanation, exception aur amendment footnote — verbatim, plus Hinglish.
        </p>
        <p>
          Ask about a rule number or a topic: <em>“Rule 155”, “bid security kitne din valid”,
          “single tender enquiry kab”, “performance security %”.</em>
        </p>
      </main>

      <CopilotSidebar
        defaultOpen
        labels={{
          title: "GFR Chapter 6 copilot",
          initial: "Chapter 6 mein kya poochna hai? Rule number bolo ya topic.",
        }}
        suggestions={[
          { title: "Purchase Committee", message: "Rule 155 Local Purchase Committee" },
          { title: "Bid Security", message: "bid security amount aur validity" },
          { title: "GeM ladder", message: "Rule 149 GeM thresholds" },
          { title: "Advance payment", message: "advance payment ceiling private firm" },
          { title: "Land border", message: "Rule 144 land border restriction" },
        ]}
      />
    </CopilotKit>
  );
}
