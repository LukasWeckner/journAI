export default async function fetchData(
  // variables with form data from idea-generator page
  destinationData,
  startDateData,
  endDateData,
  tripDurationInDays
) {
  try {
    const response = await fetch("/api/openai", {
      // make POST request to make variables of form data available in backend route where it can be used for the prompts of the AI
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination: destinationData,
        startDate: startDateData,
        endDate: endDateData,
        tripDuration: tripDurationInDays,
      }),
    });

    if (response.status === 503) {
      throw new Error("API is overloaded");
    }
    if (response.ok) {
      const aiData = await response.json();
      return aiData;
    } else {
      throw new Error("Bad Response");
    }
  } catch (error) {
    console.error("An Error occured");
    throw error;
  }
}
