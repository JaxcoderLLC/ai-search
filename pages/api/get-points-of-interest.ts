// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, CreateCompletionResponseChoicesInner, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-VYP4dsBVeMphbNLt3fReuuhY",
  apiKey: process.env.GPT_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Data = {
  pointsOfInterest: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { pointsOfInterestPrompt } = JSON.parse(req.body);
  const completionData = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: pointsOfInterestPrompt,
    temperature: 0,
    max_tokens: 550,
  });

  console.log("Points of Interest: ", { completionData: completionData.data.choices });
  let pointsOfInterest: CreateCompletionResponseChoicesInner[] = completionData.data.choices ?? [];
  console.log({ pointsOfInterest });
  
  let returnData = pointsOfInterest[0].text?.split(",");
  returnData = returnData?.map((i) => i.trim());
  const pointsOfInterestArray = returnData; // = pointsOfInterest.map((i) => i.trim());
  console.log({ pointsOfInterestArray });

  res.status(200).json({
    pointsOfInterest: JSON.stringify(pointsOfInterestArray),
  });
}
