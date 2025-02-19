import {
  FeedbackData,
  fetchSurvey,
  postReview,
  SurveyType,
} from "quick-review";
import { useEffect, useState } from "react";

export default function useReview(apiKey?: string) {
  const [survey, setSurvey] = useState<SurveyType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initSurvey = async () => {
      setLoading(true);
      try {
        const survey = await fetchSurvey(apiKey);
        setSurvey(survey.data);
        setError(survey.error);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    if (apiKey) {
      initSurvey();
    }
  }, [apiKey]);

  const handleSubmit = async (props: Omit<FeedbackData, "apiKey">) => {
    if (!apiKey || !survey) {
      return;
    }
    const { rating, comment, params } = props;
    return postReview({ rating, comment, params, apiKey });
  };

  const validate = (props: Omit<FeedbackData, "apiKey">) => {
    if (!apiKey) {
      return "API key is required";
    }
    if (!props.rating) {
      return "Rating is required";
    }
  };
  return { survey, error, loading, handleSubmit, validate };
}
