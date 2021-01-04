import React, { useState , useEffect} from "react";
import StarRatings from "react-star-ratings";
import "./Reviews.css";

function Reviews({ reviews }) {
   
 useEffect(() => {
     console.log('reviews.. in com',reviews)
     return () => {
        
     }
 }, [])

  return (
    <div className="reviews">
      {reviews.map((review) => (
        <div className="reviews__review">
          <h4>Reviewd by user - {review.userId}</h4>
          <p>
            <span>Comment: </span>
            {review.comment}
          </p>
          <p>
            <span className="span">Rating: </span>{" "}
            <StarRatings
              rating={review.rating}
              starRatedColor="yellow"
              starDimension="20px"
              numberOfStars={5}
              name="rating"
            />
          </p>
        </div>
      ))}
    </div>
  );
}

export default Reviews;
