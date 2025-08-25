import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { N8NChatMessage } from "@/types/chat";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.N8N_WEBHOOK_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      session_id,
      message_content,
      message_type = "ai",
      additional_kwargs = {},
      response_metadata = {},
    } = body;

    if (!session_id || !message_content) {
      return NextResponse.json(
        { error: "session_id and message_content are required" },
        { status: 400 }
      );
    }

    const n8nMessage: N8NChatMessage = {
      type: message_type as "human" | "ai",
      content: message_content,
      additional_kwargs,
      response_metadata,
      ...(message_type === "ai"
        ? { tool_calls: [], invalid_tool_calls: [] }
        : {}),
    };

    const { error } = await supabase.from("n8n_chat_histories").insert({
      session_id,
      message: n8nMessage,
    });

    if (error) {
      console.error("Erro ao salvar mensagem do N8N:", error);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message saved successfully",
    });
  } catch (error) {
    console.error("Erro no webhook N8N:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "N8N Chat Webhook is running",
    timestamp: new Date().toISOString(),
  });
}
