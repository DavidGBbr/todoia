import { NextRequest, NextResponse } from "next/server";

interface N8NRequest {
  data: {
    message: {
      conversation: string;
    };
  };
}

interface N8NResponse {
  output: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("N8N_CHAT_WEBHOOK_URL não configurada");
      return NextResponse.json(
        { error: "N8N webhook not configured" },
        { status: 500 }
      );
    }

    const requestBody: N8NRequest = {
      data: {
        message: {
          conversation: message,
        },
      },
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_TOKEN && {
          Authorization: `Bearer ${process.env.N8N_WEBHOOK_TOKEN}`,
        }),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(
        "Erro na resposta do N8N:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: `N8N error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: N8NResponse = await response.json();

    if (!data.output) {
      console.error("Resposta do N8N não contém output:", data);
      return NextResponse.json(
        { error: "Invalid N8N response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: data.output,
    });
  } catch (error) {
    console.error("Erro no proxy N8N:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;

  return NextResponse.json({
    status: "N8N Chat Proxy is running",
    configured: !!webhookUrl,
    timestamp: new Date().toISOString(),
  });
}
