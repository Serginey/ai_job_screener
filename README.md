# AI Job Screener

Upload résumés, get a ranked shortlist with reasons.

Recruiters spend hours reading résumés by hand. This app automates the first pass: it reads each PDF résumé with AI, turns it into structured candidate data, and ranks every applicant against the job, explaining each ranking with a score, strengths, gaps and a recommendation. A human still makes the final decision.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · MongoDB + Mongoose · Google Gemini 2.5 Flash

## How it works

```
Create job ──► Upload PDF résumés ──► Gemini extracts candidate data ──► MongoDB
                                                                          │
              Ranked shortlist ◄── Gemini scores against weighted rubric ◄┘
```

1. **Create a job** with a title, description, required skills and years of experience.
2. **Add applicants**, either by uploading a PDF résumé or by entering them manually.
3. **Run the AI shortlist.** Every candidate is ranked with:
   - a score from 0 to 100 and a match level (Strong / Good / Partial / Poor)
   - strengths, gaps and a recommendation

## Key decisions

| Decision | Why |
| --- | --- |
| **Weighted rubric in the prompt.** Skills 40%, experience 30%, education 20%, availability and fit 10% | Rankings stay consistent between runs and can be explained to a recruiter. |
| **Strengths and gaps, not just a score** | A number alone isn't trustworthy. Showing the reasoning lets a human check it. |
| **Schema-enforced JSON output** (`responseMimeType` + `responseSchema`) | The model must return data in the exact shape the database and UI expect, so there's no fragile text cleanup. Responses are validated before saving, and failures show a clear retry message. |
| **PDFs sent to the model directly** | Gemini reads the PDF itself, so layout, tables and columns survive. A separate text-extraction step would lose them. |
| **Cached database connection** | Avoids opening a new MongoDB connection on every serverless request. |

## API

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/jobs` | GET, POST | List and create jobs |
| `/api/applicants?jobId=` | GET, POST | List and add applicants for a job |
| `/api/parse-resume` | POST | Send a base64 PDF to Gemini and save the extracted applicant |
| `/api/screen` | POST | Rank all applicants for a job |

## Run locally

```bash
npm install
```

Create a `.env.local` file:

```
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your-key
```

```bash
npm run dev
```

Then open http://localhost:3000.

## Next steps

- Recruiter authentication and per-company workspaces
- An audit trail storing every AI ranking alongside the prompt version that produced it
- Bias checks: re-run rankings with names removed and compare the results

---

Built by [Iyamuremye Sergine](https://sergine-portfolio.vercel.app) · [GitHub](https://github.com/Serginey)
