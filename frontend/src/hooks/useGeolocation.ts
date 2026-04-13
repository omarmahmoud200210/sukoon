import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("user_location");
    if (cached) {
      const { lat, lng, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
      if (!isExpired) {
        setCoords({ lat, lng });
        setIsLoading(false);
        return;
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem(
          "user_location",
          JSON.stringify({
            lat: latitude,
            lng: longitude,
            timestamp: Date.now(),
          }),
        );
        setCoords({ lat: latitude, lng: longitude });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    );
  }, []);

  return { coords, isLoading, error };
}
