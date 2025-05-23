import OpenAI from "openai";
import type { Dataset } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface GeneratedInsight {
  title: string;
  description: string;
  content: string;
  type: "trend" | "anomaly" | "recommendation" | "summary";
  confidence: number;
}

export async function generateInsights(dataset: Dataset): Promise<GeneratedInsight[]> {
  try {
    // Prepare dataset summary for analysis
    const datasetSummary = {
      name: dataset.name,
      description: dataset.description,
      rowCount: dataset.rowCount,
      columns: dataset.columns,
      fileType: dataset.fileType,
      sampleData: Array.isArray(dataset.data) ? dataset.data.slice(0, 10) : []
    };

    const prompt = `
You are an expert data analyst. Analyze the following dataset and generate actionable insights.

Dataset Information:
- Name: ${datasetSummary.name}
- Description: ${datasetSummary.description || 'No description provided'}
- Rows: ${datasetSummary.rowCount}
- Columns: ${datasetSummary.columns.join(', ')}
- File Type: ${datasetSummary.fileType}

Sample Data (first 10 rows):
${JSON.stringify(datasetSummary.sampleData, null, 2)}

Generate 3-5 insights about this data. For each insight, provide:
1. A clear, actionable title
2. A brief description (1-2 sentences)
3. Detailed content explaining the insight with specific findings
4. Type: one of "trend", "anomaly", "recommendation", or "summary"
5. Confidence score (1-100) based on data quality and sample size

Focus on:
- Patterns and trends in the data
- Anomalies or outliers
- Actionable recommendations for business decisions
- Statistical relationships between variables
- Data quality observations

Respond with a JSON object containing an array of insights.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional data analyst specializing in extracting meaningful insights from datasets. Always respond with valid JSON containing an array of insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    
    // Validate and format the insights
    const insights = result.insights || result.data || [];
    
    return insights.map((insight: any) => ({
      title: insight.title || "Data Insight",
      description: insight.description || "Analysis of dataset patterns",
      content: insight.content || insight.explanation || "No detailed analysis available",
      type: ["trend", "anomaly", "recommendation", "summary"].includes(insight.type) 
        ? insight.type 
        : "summary",
      confidence: Math.min(100, Math.max(1, parseInt(insight.confidence) || 75))
    }));

  } catch (error) {
    console.error("Error generating insights:", error);
    throw new Error("Failed to generate AI insights: " + error.message);
  }
}

export async function chatWithAI(message: string, dataset?: Dataset | null): Promise<string> {
  try {
    let systemPrompt = `
You are an AI data assistant for DataSync Pro, a data communication platform. You help users:
- Analyze their datasets
- Generate insights and recommendations
- Answer questions about data patterns
- Provide guidance on data visualization
- Assist with report creation and sharing

Always be helpful, professional, and provide actionable advice. Keep responses concise but informative.
`;

    let userMessage = message;

    // Add dataset context if available
    if (dataset) {
      const datasetContext = `
Current Dataset Context:
- Name: ${dataset.name}
- Description: ${dataset.description || 'No description'}
- Rows: ${dataset.rowCount}
- Columns: ${dataset.columns.join(', ')}
- File Type: ${dataset.fileType}

Sample Data:
${JSON.stringify(Array.isArray(dataset.data) ? dataset.data.slice(0, 5) : [], null, 2)}

User Question: ${message}
`;

      userMessage = datasetContext;
      systemPrompt += `\n\nYou have access to the user's current dataset. Use this context to provide specific, relevant answers about their data.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request right now. Please try again.";

  } catch (error) {
    console.error("Error in AI chat:", error);
    throw new Error("Failed to get AI response: " + error.message);
  }
}

export async function analyzeDataQuality(dataset: Dataset): Promise<{
  score: number;
  issues: string[];
  recommendations: string[];
}> {
  try {
    const datasetSummary = {
      name: dataset.name,
      rowCount: dataset.rowCount,
      columns: dataset.columns,
      sampleData: Array.isArray(dataset.data) ? dataset.data.slice(0, 20) : []
    };

    const prompt = `
Analyze the data quality of this dataset and provide:
1. A quality score (1-100)
2. List of identified issues
3. Recommendations for improvement

Dataset:
- Name: ${datasetSummary.name}
- Rows: ${datasetSummary.rowCount}
- Columns: ${datasetSummary.columns.join(', ')}

Sample Data:
${JSON.stringify(datasetSummary.sampleData, null, 2)}

Look for:
- Missing values
- Inconsistent formatting
- Duplicate records
- Data type inconsistencies
- Outliers or anomalies
- Column naming conventions
- Data completeness

Respond with JSON containing: score (number), issues (array of strings), recommendations (array of strings).
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a data quality expert. Analyze datasets and provide structured feedback on data quality issues and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      score: Math.min(100, Math.max(1, parseInt(result.score) || 75)),
      issues: Array.isArray(result.issues) ? result.issues : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };

  } catch (error) {
    console.error("Error analyzing data quality:", error);
    throw new Error("Failed to analyze data quality: " + error.message);
  }
}

export async function generateChartRecommendations(dataset: Dataset): Promise<{
  charts: Array<{
    type: string;
    title: string;
    description: string;
    xAxis: string;
    yAxis: string;
    rationale: string;
  }>;
}> {
  try {
    const datasetSummary = {
      name: dataset.name,
      columns: dataset.columns,
      rowCount: dataset.rowCount,
      sampleData: Array.isArray(dataset.data) ? dataset.data.slice(0, 10) : []
    };

    const prompt = `
Based on this dataset, recommend 3-5 appropriate data visualizations:

Dataset:
- Name: ${datasetSummary.name}
- Columns: ${datasetSummary.columns.join(', ')}
- Rows: ${datasetSummary.rowCount}

Sample Data:
${JSON.stringify(datasetSummary.sampleData, null, 2)}

For each recommended chart, provide:
- type: "line", "bar", "pie", "scatter", "area", or "histogram"
- title: descriptive chart title
- description: what the chart shows
- xAxis: column name for x-axis
- yAxis: column name for y-axis (if applicable)
- rationale: why this chart type is appropriate

Consider:
- Data types (numerical, categorical, temporal)
- Relationships between variables
- Distribution patterns
- Comparison needs
- Trend analysis opportunities

Respond with JSON containing a "charts" array.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a data visualization expert. Recommend appropriate chart types based on dataset characteristics and analytical goals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || '{"charts": []}');
    
    return {
      charts: Array.isArray(result.charts) ? result.charts : []
    };

  } catch (error) {
    console.error("Error generating chart recommendations:", error);
    throw new Error("Failed to generate chart recommendations: " + error.message);
  }
}

export async function generateNaturalLanguageSummary(dataset: Dataset): Promise<string> {
  try {
    const datasetSummary = {
      name: dataset.name,
      description: dataset.description,
      rowCount: dataset.rowCount,
      columns: dataset.columns,
      fileType: dataset.fileType,
      sampleData: Array.isArray(dataset.data) ? dataset.data.slice(0, 15) : []
    };

    const prompt = `
Write a comprehensive but concise natural language summary of this dataset for a business audience:

Dataset: ${datasetSummary.name}
Description: ${datasetSummary.description || 'No description provided'}
Format: ${datasetSummary.fileType.toUpperCase()}
Records: ${datasetSummary.rowCount}
Fields: ${datasetSummary.columns.join(', ')}

Sample Data:
${JSON.stringify(datasetSummary.sampleData, null, 2)}

Write a 2-3 paragraph summary that includes:
1. What the dataset contains and its purpose
2. Key characteristics and structure
3. Potential insights or business value
4. Any notable patterns in the sample data

Write in clear, professional language suitable for stakeholders who may not be technical.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a business analyst who excels at explaining technical data concepts in clear, accessible language for business stakeholders."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return response.choices[0].message.content || "Unable to generate summary for this dataset.";

  } catch (error) {
    console.error("Error generating natural language summary:", error);
    throw new Error("Failed to generate dataset summary: " + error.message);
  }
}
