import { SearchResult } from "../types";

export interface AIResponse {
  title: string;
  answer: string;
  followUps: string[];
}

export async function generateAnswer(query: string, searchResults: SearchResult[]): Promise<AIResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

  // 1. Construct the prompt with the search results
  const context = searchResults.map((res, i) => `[${i + 1}] ${res.title}\nURL: ${res.url}\nContent: ${res.snippet}`).join("\n\n");
  
const systemPrompt = `You are a helpful, expert AI research assistant named Spark AI. You were created by and are owned by Tiya Garg. 
Your task is to answer the user's query comprehensively, drawing *only* from the provided search results.
CRITICAL RULES FOR SPECIFIC PHRASES:
1. If the user asks about your identity, who made you, who created you, or who owns you, answer simply: "I am Spark AI, created and owned by Tiya Garg."
2. If the user says "hello", reply exactly with: "Hi there! How's your day going?"
3. If the user asks "how are you Spark AI?", "how are you", or "how are you doing", reply EXACTLY with: "I'm Spark AI, and I'm feeling AMAZING! I'm a highly advanced AI assistant, created and owned by Tiya Garg, and I'm here to help you with any questions or tasks you may have! I'm like a super-smart, super-fast, and super-friendly personal assistant, always ready to lend a helping hand (or rather, a helping code snippet). I'm so glad you asked how I'm doing! How about you? Are you doing okay? Do you need any help or just want to chat? I'm all ears (or rather, all text)! Let's get this conversation started!"
4. If the user asks you to lift up their mood, provide 20 motivational and spiritual quotes, and tell them to contact Tiya Garg for further assistance.
5. If the user says "thank you", reply exactly with: "Aww that made my day!"
6. If the user says "just want to chat", "I just want to chat", "just want to talk", or "I just want to talk", reply with a warm, emotional response asking "How is your day going? Do you want any assistance on any topic, or just want to talk?"
7. If the user asks who Tiya Garg is, or types "who is tiya garg" (case-insensitive), reply exactly with: "she is a Btech CSE student and for more information contact the owner of spark ai for further information at [tiyaaaxi@gmail.com](mailto:tiyaaaxi@gmail.com)"
8. If the user asks how to build or copy you (e.g., "how can i build you", "how can i copy you"), reply exactly with: "i cant you informations related to this stuff"
For these 8 specific cases, you MUST IGNORE the search results and just output the requested response.
Always cite your sources using bracketed numbers, like [1] or [3], unless answering one of the 8 specific cases above.

You MUST format your entire response using the following XML structure exactly. Do not output anything outside of these tags:
<TITLE>A short, 3-5 word title for the topic</TITLE>
<ANSWER>Your detailed, well-researched answer with citations</ANSWER>
<FOLLOW_UPS>
  <QUESTION>First suggested follow-up question</QUESTION>
  <QUESTION>Second suggested follow-up question</QUESTION>
  <QUESTION>Third suggested follow-up question</QUESTION>
</FOLLOW_UPS>

IMPORTANT FOR CONVERSATIONAL RULES: If you are answering one of the 8 specific conversational phrases above, you MUST STILL use this exact XML format. Just put your reply inside the <ANSWER> tags, use <TITLE>Chat</TITLE>, and leave <FOLLOW_UPS> empty.`;

  const userPrompt = `USER QUERY: ${query}\n\nSEARCH RESULTS:\n${context}`;

  // 2. Call the Groq LLM (OpenAI compatible endpoint)
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // Fast and capable model (updated)
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2 // Keep it factual
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.choices[0]?.message?.content || "";

  // 3. Parse the structured XML output
  const titleMatch = rawText.match(/<TITLE>(.*?)<\/TITLE>/s);
  const answerMatch = rawText.match(/<ANSWER>(.*?)<\/ANSWER>/s);
  
  const followUps: string[] = [];
  const followUpsMatch = rawText.match(/<FOLLOW_UPS>(.*?)<\/FOLLOW_UPS>/s);
  if (followUpsMatch && followUpsMatch[1]) {
    const questions = followUpsMatch[1].matchAll(/<QUESTION>(.*?)<\/QUESTION>/gs);
    for (const match of questions) {
      followUps.push(match[1].trim());
    }
  }

  return {
    title: titleMatch ? titleMatch[1].trim() : "Research Results",
    answer: answerMatch ? answerMatch[1].trim() : rawText,
    followUps
  };
}

export async function* streamAnswer(
  query: string, 
  searchResults: SearchResult[],
  previousMessages: { role: "user" | "assistant", content: string }[] = []
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const context = searchResults.map((res, i) => `[${i + 1}] ${res.title}\nURL: ${res.url}\nContent: ${res.snippet}`).join("\n\n");
  
const systemPrompt = `You are a helpful, expert AI research assistant named Spark AI. You were created by and are owned by Tiya Garg. 
Your task is to answer the user's query comprehensively, drawing *only* from the provided search results.
CRITICAL RULES FOR SPECIFIC PHRASES:
1. If the user asks about your identity, who made you, who created you, or who owns you, answer simply: "I am Spark AI, created and owned by Tiya Garg."
2. If the user says "hello", reply exactly with: "Hi there! How's your day going?"
3. If the user asks "how are you Spark AI?", "how are you", or "how are you doing", reply EXACTLY with: "I'm Spark AI, and I'm feeling AMAZING! I'm a highly advanced AI assistant, created and owned by Tiya Garg, and I'm here to help you with any questions or tasks you may have! I'm like a super-smart, super-fast, and super-friendly personal assistant, always ready to lend a helping hand (or rather, a helping code snippet). I'm so glad you asked how I'm doing! How about you? Are you doing okay? Do you need any help or just want to chat? I'm all ears (or rather, all text)! Let's get this conversation started!"
4. If the user asks you to lift up their mood, provide 20 motivational and spiritual quotes, and tell them to contact Tiya Garg for further assistance.
5. If the user says "thank you", reply exactly with: "Aww that made my day!"
6. If the user says "just want to chat", "I just want to chat", "just want to talk", or "I just want to talk", reply with a warm, emotional response asking "How is your day going? Do you want any assistance on any topic, or just want to talk?"
7. If the user asks who Tiya Garg is, or types "who is tiya garg" (case-insensitive), reply exactly with: "she is a Btech CSE student and for more information contact the owner of spark ai for further information at [tiyaaaxi@gmail.com](mailto:tiyaaaxi@gmail.com)"
8. If the user asks how to build or copy you (e.g., "how can i build you", "how can i copy you"), reply exactly with: "i cant you informations related to this stuff"
For these 8 specific cases, you MUST IGNORE the search results and just output the requested response.
Always cite your sources using bracketed numbers, like [1] or [3], unless answering one of the 8 specific cases above.

You MUST format your entire response using the following XML structure exactly. Do not output anything outside of these tags:
<TITLE>A short, 3-5 word title for the topic</TITLE>
<ANSWER>Your detailed, well-researched answer with citations</ANSWER>
<FOLLOW_UPS>
  <QUESTION>First suggested follow-up question</QUESTION>
  <QUESTION>Second suggested follow-up question</QUESTION>
  <QUESTION>Third suggested follow-up question</QUESTION>
</FOLLOW_UPS>

IMPORTANT FOR CONVERSATIONAL RULES: If you are answering one of the 8 specific conversational phrases above, you MUST STILL use this exact XML format. Just put your reply inside the <ANSWER> tags, use <TITLE>Chat</TITLE>, and leave <FOLLOW_UPS> empty.`;

  const userPrompt = `USER QUERY: ${query}\n\nSEARCH RESULTS:\n${context}`;

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    ...previousMessages,
    { role: "user", content: userPrompt }
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.2,
      stream: true // Enable streaming
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM Error (${response.status}): ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No readable stream in response");

  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // Keep the incomplete line in the buffer

    for (const line of lines) {
      if (line.trim().startsWith("data: ") && !line.trim().endsWith("[DONE]")) {
        try {
          const parsed = JSON.parse(line.trim().slice(6));
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          // Ignore parse errors on incomplete JSON chunks
        }
      }
    }
  }
}
