export interface ContentBrief {
    intent: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    competitorHeadings: string[];
    paaQuestions: string[];
    entities: string[];
}

export interface OutlineSection {
    heading: string;
    level: number;
    description: string;
    subheadings?: string[];
}

export interface Outline {
    title: string;
    outline: OutlineSection[];
}

export interface SeoMetadata {
    seoTitle: string;
    seoDescription: string;
    excerpt: string;
    tags: string[];
    faqs?: { question: string; answer: string }[];
}

// Helper for rate-limiting retry backoff
export async function callGroqWithRetry(
    modelName: string,
    prompt: string,
    responseJson: boolean = false,
    maxRetries: number = 5
): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY || "";
    if (!apiKey) {
        throw new Error("GROQ_API_KEY environment variable is not defined.");
    }

    let attempt = 0;
    const delay = 2000; // Start with 2 seconds

    while (attempt < maxRetries) {
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    response_format: responseJson ? { type: "json_object" } : undefined,
                    temperature: 0.2
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Groq API error (status ${res.status}): ${errText}`);
            }

            const data = await res.json();
            const text = data.choices?.[0]?.message?.content;
            if (!text) {
                throw new Error("Empty response received from Groq API.");
            }
            return text;
        } catch (error: unknown) {
            attempt++;
            console.warn(`[GROQ API] Attempt ${attempt} failed for model ${modelName}. Error: ${(error as Error).message || error}`);
            
            if (attempt >= maxRetries) {
                throw error;
            }

            // Exponential backoff with jitter
            const jitter = Math.random() * 1000;
            let sleepTime = delay * Math.pow(2, attempt - 1) + jitter;
            
            const errStr = String(error).toLowerCase();
            if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("too many requests") || errStr.includes("503") || errStr.includes("rate limit")) {
                console.log(`[GROQ API] Rate limit or server overload (429/503) encountered. Waiting 30 seconds for quota/load window reset...`);
                sleepTime = 30000;
            }

            console.log(`[GROQ API] Sleeping for ${Math.round(sleepTime)}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, sleepTime));
        }
    }

    throw new Error("Failed to contact Groq API after maximum retries.");
}

/**
 * Stage 1: Analyze keyword and generate an SEO Content Brief
 */
export async function generateContentBrief(keyword: string): Promise<ContentBrief> {
    const prompt = `You are a professional SEO research assistant.
Generate a structured SEO Content Brief for the primary keyword: "${keyword}".
Analyze the search intent, target audience, typical top-ranking headings, standard semantic entities (topics/concepts to cover), and People Also Ask (PAA) questions.

Return a JSON object matching this structure exactly (do not output any markdown code blocks, just raw JSON):
{
  "intent": "informational | commercial | transactional | navigational",
  "primaryKeyword": "${keyword}",
  "secondaryKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "competitorHeadings": ["heading 1", "heading 2", "heading 3"],
  "paaQuestions": ["question 1", "question 2"],
  "entities": ["entity 1", "entity 2", "entity 3"]
}`;

    // Use llama-3.3-70b-versatile
    const rawJson = await callGroqWithRetry("llama-3.3-70b-versatile", prompt, true);
    return JSON.parse(rawJson) as ContentBrief;
}

/**
 * Stage 2: Generate heading outline based on content brief
 */
export async function generateOutline(brief: ContentBrief): Promise<Outline> {
    const prompt = `You are a professional SEO editor.
Generate a comprehensive, logically sequenced heading outline (H2 and H3 structures) for an article based on this Content Brief:
${JSON.stringify(brief, null, 2)}

The article must be a comprehensive guide targeting 3,000 to 3,500 words. Therefore, create a deep outline with at least 6 to 8 main H2 sections, each containing relevant H3 subsections where appropriate.

Return a JSON object matching this structure exactly (do not output any markdown code blocks, just raw JSON):
{
  "title": "Optimized Blog Post Title",
  "outline": [
    {
      "heading": "Heading Text (e.g. 1. Introduction to...)",
      "level": 2,
      "description": "What this section should cover in detail",
      "subheadings": [
        "Subheading 1",
        "Subheading 2"
      ]
    }
  ]
}`;

    const rawJson = await callGroqWithRetry("llama-3.3-70b-versatile", prompt, true);
    return JSON.parse(rawJson) as Outline;
}

/**
 * Stage 3: Write a specific heading section (Part of multi-step compiler)
 */
export async function generateSection(
    brief: ContentBrief,
    outline: Outline,
    section: OutlineSection,
    previousContentSnippet: string
): Promise<string> {
    const headingLevel = section.level;
    const subheadingsText = section.subheadings && section.subheadings.length > 0
        ? `Subheadings to include under this section:\n- ${section.subheadings.join("\n- ")}`
        : "";

    const prompt = `You are an expert copywriter writing a detailed section for a comprehensive 3,000+ word article on "${brief.primaryKeyword}".
We are writing section by section.

Current Section to write:
Heading: ${section.heading}
Heading Level: H${headingLevel}
Description of what to cover: ${section.description}
${subheadingsText}

Guidelines:
1. Write extremely thorough, deep content. Target 400 to 600 words for this section alone.
2. Use clean HTML structure (paragraphs, bullet points, bold text). Do not use H1 tags. Use H${headingLevel} for the section heading, and H${headingLevel + 1} for subheadings if relevant.
3. Integrate these secondary keywords naturally where appropriate: ${brief.secondaryKeywords.join(", ")}.
4. Focus on professional, authoritative, and engaging tone. Avoid generic filler.
5. Here is the context of what has been written in the article so far to prevent repetitive transitions and ensure a seamless flow:
---
${previousContentSnippet}
---

Write the content for this section now. Start directly with the H${headingLevel} heading and its body text. Do not output markdown code blocks. Return clean HTML only:`;

    return await callGroqWithRetry("llama-3.3-70b-versatile", prompt, false);
}

/**
 * Stage 4: Humanize and polish a specific heading section (part of multi-step compiler)
 */
export async function humanizeSection(sectionContent: string, primaryKeyword: string): Promise<string> {
    const prompt = `You are an expert copyeditor specializing in humanizing AI content.
Review the following HTML section of an article on "${primaryKeyword}" and apply a thorough editing pass:
1. Eliminate repetitive AI vocabulary and phrases (e.g. "in today's digital landscape", "furthermore", "delve", "testament", "not only... but also", "crucial role", "vital").
2. Vary sentence structures to sound natural, conversational, and written by a human expert.
3. Keep the HTML tags exactly intact, only modifying the prose inside them. Do not change the heading structures or insert new elements.

Section Content:
${sectionContent}

Return the edited HTML content directly:`;

    // Use llama-3.3-70b-versatile for completions
    return await callGroqWithRetry("llama-3.3-70b-versatile", prompt, false);
}

/**
 * Stage 5: Generate optimized SEO metadata and tags using key sections and outline
 */
export async function generateSeoMetadata(
    title: string,
    outline: Outline,
    intro: string,
    outro: string,
    brief: ContentBrief
): Promise<SeoMetadata> {
    const prompt = `Analyze the details of this drafted article and generate optimized SEO metadata and 3-5 Frequently Asked Questions (FAQs) matching the search intent.

Article Title: "${title}"
Outline: ${JSON.stringify(outline, null, 2)}
Introduction Content: ${intro.substring(0, 1500)}
Conclusion Content: ${outro.substring(0, 1500)}

Keep in mind:
- Meta Title must be between 50 and 60 characters.
- Meta Description must be between 140 and 160 characters.
- FAQs should directly answer People Also Ask queries or core questions from the content.

Return a JSON object matching this structure exactly (do not output any markdown code blocks or extra text, just raw JSON):
{
  "seoTitle": "Optimized title (50-60 chars)",
  "seoDescription": "Optimized description (140-160 chars)",
  "excerpt": "A short 1-2 sentence hook for the blog index listing (max 120 chars)",
  "tags": ["tag1", "tag2", "tag3"],
  "faqs": [
    { "question": "Question text here?", "answer": "Detailed answer text here." }
  ]
}

People Also Ask Questions for Context:
${(brief.paaQuestions || []).join("\n")}`;

    const rawJson = await callGroqWithRetry("llama-3.3-70b-versatile", prompt, true);
    return JSON.parse(rawJson) as SeoMetadata;
}
