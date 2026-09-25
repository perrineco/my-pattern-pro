import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY is not set");

    const sendEmail = (payload: Record<string, unknown>) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify(payload),
      });

    const confirmationRes = await sendEmail({
      from: "Petit Citron Studio <noreply@petitcitron.com>",
      to: [email],
      subject: "Bienvenue chez Petit Citron Studio !",
      html: `
        <h2>Merci de votre inscription !</h2>
        <p>Petit Citron Studio est en cours de finalisation. Vous recevrez un email dès que l'application sera prête, avec les nouveautés en avant-première.</p>
        <p>À très vite,<br>L'équipe Petit Citron</p>
      `,
    });

    if (!confirmationRes.ok) {
      const error = await confirmationRes.text();
      throw new Error(`Resend error: ${error}`);
    }

    sendEmail({
      from: "Petit Citron Studio <noreply@petitcitron.com>",
      to: ["perrine.cc@gmail.com"],
      subject: "[Newsletter] Nouvelle inscription",
      html: `<p>Nouvelle inscription à la newsletter : <a href="mailto:${email}">${email}</a></p>`,
    }).catch(console.error);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
