import { Resend } from "resend";

export async function sendPasswordResetEmail({ to, url }: { to: string; url: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Password reset delivery is not configured.");
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to,
    subject: "Reset your Planora password",
    text: `Use this link to set a new password. It expires in one hour: ${url}`,
  });
}
