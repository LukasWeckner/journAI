import { useRouter } from "next/router";
import { trips } from "../../lib/data";
import TripDay from "../../components/TripDay";

export default function Trip() {
  const router = useRouter();
  const { slug } = router.query;

  const currentTrip = trips.find((trip) => trip.slug === slug);
  if (!currentTrip) {
    return null;
  }

  const { destination, startDate, endDate, dayDetails } = currentTrip;

  return (
    <>
      <h1>Trip details</h1>
      <h2>{`Destination: ${destination}`}</h2>
      <p>{`Start date: ${startDate}`}</p>
      <p>{`End date: ${endDate}`}</p>
      <ul>
        {dayDetails.titles.map((title, index) => (
          <TripDay
            key={index}
            title={title}
            activities={dayDetails.activities[index]}
          />
        ))}
      </ul>
    </>
  );
}