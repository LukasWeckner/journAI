// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import openAiConfig from "../../utils/openAiConfig.js";

export default async function handler(request, response) {
  try {
    const { destination, startDate, endDate, tripDuration } = request.body;

    //milliseconds till timeout
    const timeoutDuration = 28000;

    const chatCompletionPromise = openAiConfig.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Create a ${tripDuration} day schedule for a vacation in ${destination}. Display the trip as a json object. The object needs to have the following keys: slug, destination, startDate, endDate, dayDetails. The destination has a value of ${destination}. The slug has the same value as destination but is written in lowercase. Use the date of ${startDate} for the startDate and ${endDate} for the endDate. For both dates use the format DD/MM/YYYY. The dayDetails key contains another object with the keys titles and acitivities. The titles key contains an array with a title string for each day of the trip. The activities key contains an array with a string for each day which gives 3 activity suggestions in key words for the trip. Make sure that the activities are always seperated with a comma.`,
        },
      ],
    });

    //time out is needed because the API sometimes does not sent a response because it is overloaded with requests
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("OpenAI API request timed out"));
      }, timeoutDuration);
    });

    //checks what happens first: the response of the API or the timeout of 28 seconds
    const chatCompletion = await Promise.race([
      chatCompletionPromise,
      timeoutPromise,
    ]);

    const responseText = chatCompletion.data.choices[0].message.content;
    const responseObject = JSON.parse(responseText);

    response.status(200).json(responseObject);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
      response.status(503).json();
    }
  }
}
