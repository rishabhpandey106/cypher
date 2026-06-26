import { ImageResponse } from 'next/og';
import dbConnect from "@/utils/dbConfig";
import PollModel from "@/models/Poll";
import mongoose from "mongoose";

export const revalidate = 86400; // Cache for 24 hours

export async function GET(
  request: Request,
  context: { params: Promise<{ pollId: string }> | { pollId: string } }
) {
  try {
    await dbConnect();

    // Support Next.js 15 params promise
    const resolvedParams = await context.params;
    const pollId = resolvedParams.pollId;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return new Response('Invalid Poll ID', { status: 400 });
    }

    const poll = await PollModel.findById(pollId);

    if (!poll) {
      return new Response('Poll not found', { status: 404 });
    }

    const question = poll.question;
    const options = poll.options.map((opt: any) => opt.text);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            padding: "60px",
            boxSizing: "border-box",
            color: "#fff",
          }}
        >
          {/* Background Circle */}
          <div
            style={{
              position: "absolute",
              right: "-120px",
              top: "-120px",
              width: "420px",
              height: "420px",
              borderRadius: "9999px",
              background: "rgba(250,204,21,0.12)",
              display: "flex",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                background: "#FACC15",
                color: "#111827",
                padding: "12px 24px",
                borderRadius: "999px",
                fontSize: "28px",
                fontWeight: 800,
              }}
            >
              ⚡ CYPHER POLL
            </div>

            <div
              style={{
                display: "flex",
                color: "#CBD5E1",
                fontSize: "26px",
                fontWeight: 700,
              }}
            >
              Vote Now
            </div>
          </div>

          {/* Question */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              zIndex: 1,
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#94A3B8",
                fontSize: "22px",
                marginBottom: "18px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Today's Question
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "68px",
                lineHeight: 1.1,
                fontWeight: 900,
                color: "#fff",
                maxWidth: "100%",
              }}
            >
              {question.length > 100
                ? question.substring(0, 100) + "..."
                : question}
            </div>
          </div>

          {/* Options */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              rowGap: "18px",
              zIndex: 1,
            }}
          >
            {options.slice(0, 4).map((opt: string, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "48%",
                  background: "#1E293B",
                  border: "2px solid #334155",
                  borderRadius: "18px",
                  padding: "18px 22px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "42px",
                    height: "42px",
                    borderRadius: "999px",
                    background: "#FACC15",
                    color: "#111827",
                    fontWeight: 900,
                    fontSize: "24px",
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>

                <div
                  style={{
                    display: "flex",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#F8FAFC",
                  }}
                >
                  {opt.length > 28 ? opt.substring(0, 28) + "..." : opt}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#94A3B8",
              fontSize: "22px",
              marginTop: "40px",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex" }}>🗳️ Create • Share • Vote</div>

            <div
              style={{
                display: "flex",
                color: "#FACC15",
                fontWeight: 700,
              }}
            >
              cypher.itsrishabh.tech
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error("OG Image Error:", e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
