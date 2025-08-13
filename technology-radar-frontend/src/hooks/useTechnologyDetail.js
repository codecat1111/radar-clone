import { useEffect, useState } from "react";
import { technologyService } from "../services/technologyService";
import useAppStore from "../store/useAppStore";

export const useTechnologyDetail = (technologyId) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { selectedTechnology, setSelectedTechnology } = useAppStore();

  useEffect(() => {
    if (!technologyId) {
      setDetailData(null);
      return;
    }

    const fetchTechnologyDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await technologyService.getTechnologyById(
          technologyId,
          true
        );

        if (response.success) {
          setDetailData(response.data.technology);
          setSelectedTechnology(response.data.technology);
        } else {
          setError("Failed to fetch technology details");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch technology details");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologyDetail();
  }, [technologyId, setSelectedTechnology]);

  return {
    technology: detailData || selectedTechnology,
    loading,
    error,
  };
};
