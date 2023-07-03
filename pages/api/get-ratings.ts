import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, CreateCompletionResponseChoicesInner, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-VYP4dsBVeMphbNLt3fReuuhY",
    apiKey: process.env.GPT_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Rating = {
    name: string;
    rating: string;
}

type RatingsData = {
    ratings: Rating[];
}

type Error = {
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | Error>
) {
    let name = "contractor",
        city = "jacksonville, Florida";
    if (req.body) {
        let body = JSON.parse(req.body);
        name = body.category.name;
        city = body.city;
    }
    let basePrompt = `what are the latest ratings for ${name} in ${city} for the last two years?`;
    const completionData = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550,
    });

    console.log("Contractor rating: ", { completionData: completionData.data.choices });
    let ratings: CreateCompletionResponseChoicesInner[] = completionData.data.choices ?? [];
    console.log({ ratings });

    let returnData = ratings[0].text?.split(",");
    returnData = returnData?.map((i) => i.trim());

    res.status(200).json({
        ratings: returnData,
    });
}