import type { APIRoute } from "astro";

const service_id = import.meta.env.EMAIL_SERVICE_ID;
const template_id = import.meta.env.EMAIL_TEMPLATE_ID;
const user_id = import.meta.env.EMAIL_KEY;

export const POST: APIRoute = async ({ request }) => {
  const { user, email, message } = (await request.json()) as {
    user: string;
    email: string;
    message: string;
  };

  const data = {
    service_id,
    template_id,
    user_id,
    template_params: {
      from_name: user,
      email,
      message,
    },
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http//localhost",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return new Response(JSON.stringify({ status: "success" }));
  }
  return new Response(JSON.stringify({ status: "error" }));
};
