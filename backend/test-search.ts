import "dotenv/config";
import { searchTavily } from "./services/search";

async function main() {
  console.log("Testing Tavily Search Integration...");
  try {
    const results = await searchTavily("What is the latest iteration of OpenAI's GPT model?");
    console.log("✅ Success! Retrieved", results.length, "results:");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("❌ Search failed:", error);
    process.exit(1);
  }
}

main();
