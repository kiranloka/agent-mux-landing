const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return res.status(500).json({
      error: "Supabase env vars are missing. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.",
    });
  }

  const body = typeof req.body === "object" && req.body !== null ? req.body : {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (name.length < 2) {
    return res.status(400).json({ error: "Please enter your name." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist_signups?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: supabasePublishableKey,
      "content-type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({
      name,
      email,
      source: "landing-page",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 409) {
      return res.status(200).json({ message: "You are already on the waitlist." });
    }
    return res.status(response.status).json({
      error: `Supabase insert failed: ${errorText}`,
    });
  }

  return res.status(200).json({ message: "You're on the waitlist." });
}
