// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-VYP4dsBVeMphbNLt3fReuuhY",
  apiKey: process.env.GPT_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Data = {
  message: string;
  pointsOfInterestPrompt: any;
  itinerary: any;
};

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  let days = 4,
    city = "Rio";
  if (req.body) {
    let body = JSON.parse(req.body);
    days = body.days;
    city = body.city;
  }

  const parts = city.split(" ");

  if (parts.length > 5) {
    throw new Error("please reduce size of request");
  }

  if (days > 10) {
    days = 10;
  }

  let basePrompt = `what is an ideal itinerary for ${days} days in ${city}?`;

  console.log({ basePrompt, days, city });

  try {
    const completionData = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: basePrompt,
      temperature: 0,
      max_tokens: 550,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    })
    console.log("Itinerary:", { completionData: completionData.data });
    const itinerary = completionData.data.choices;
    const pointsOfInterestPrompt =
      "Extract the points of interest out of this text, with no additional words, separated by commas: " +
      itinerary.map((i) => i.text).join(" ").split("\n");

    console.log("pointsOfInterestPrompt", { pointsOfInterestPrompt });

    res.status(200).json({
      message: "success",
      pointsOfInterestPrompt,
      itinerary: itinerary,
    });
  } catch (err) {
    console.log("error: ", err);
  }
}
