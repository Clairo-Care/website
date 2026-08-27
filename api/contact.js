// Vercel serverless function — receives contact form submissions and
// opens a GitHub issue in the configured repository.
// Required env vars (set in your Vercel project settings):
//   GITHUB_TOKEN — a fine-grained or classic PAT with "Issues: Write" on the repo
//   GITHUB_REPO  — the repository in "owner/repo" form (e.g. "clairo-care/site")
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({
      ok: false,
      error: "Server is missing GITHUB_TOKEN or GITHUB_REPO configuration.",
    });
  }

  const data = req.body || {};
  const name = (data.name || "Unknown submitter").toString().trim();

  // Build the issue body from every submitted field.
  const fieldLines = Object.entries(data)
    .map(([key, value]) => `**${key}:** ${value}`)
    .join("\n\n");

  const issue = {
    title: name,
    body: fieldLines || "(no fields submitted)",
    labels: ["contact-form"],
  };

  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
      }
    );

    if (!ghRes.ok) {
      const detail = await ghRes.text();
      return res.status(502).json({
        ok: false,
        error: `GitHub API error (${ghRes.status}): ${detail}`,
      });
    }

    const created = await ghRes.json();
    return res.status(200).json({
      ok: true,
      issueUrl: created.html_url,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: `Failed to create issue: ${err.message}` });
  }
}
