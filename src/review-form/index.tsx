import React, { useState } from "react";
import "./styles.css";
import useReview from "../use-review";

const ReviewForm = ({
  apiKey,
  multiple,
}: {
  apiKey: string;
  multiple?: boolean;
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { survey, error, loading, handleSubmit, validate } = useReview(apiKey);

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const isInvalid = validate({ rating, comment: review });
    if (isInvalid) {
      alert(isInvalid);
      return;
    }

    handleSubmit({ rating, comment: review }).then((data) => {
      if (data?.success) {
        setSubmitted(true);
      } else {
        alert("Failed to submit review. Please try again.");
      }
    });
  };

  const resetForm = () => {
    setRating(0);
    setReview("");
    setSubmitted(false);
  };

  if (loading) return <div className="review-container">Loading...</div>;
  if (error)
    return <div className="review-container">Error: {error.message}</div>;
  if (!survey) return <div className="review-container">No survey found</div>;
  return (
    <div className="review-container">
      {!submitted ? (
        <form onSubmit={onSubmit} className="review-form">
          <h3 className="form-title">{survey?.question}</h3>

          {/* Star Rating */}
          <div className="rating-container">
            <p className="rating-label">Rating:</p>
            <div className="stars">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;

                return (
                  <button
                    type="button"
                    key={starValue}
                    className={`star-btn ${
                      (hover || rating) >= starValue ? "active" : ""
                    }`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div className="textarea-container">
            <label htmlFor="review" className="textarea-label">
              Your Review:
            </label>
            <textarea
              id="review"
              rows={4}
              className="review-textarea"
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button type="submit" className="submit-btn">
              Submit Review
            </button>
          </div>
        </form>
      ) : (
        <div className="success-container">
          <h2 className="success-title">Thanks for your feedback!</h2>
          <div className="submitted-rating">
            <p>Your rating:</p>
            <div className="stars-display">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < rating ? "active" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {review && (
            <div className="submitted-review">
              <p>"{review}"</p>
            </div>
          )}

          {multiple && (
            <button onClick={resetForm} className="reset-btn">
              Write Another Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
