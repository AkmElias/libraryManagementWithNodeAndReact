// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import StarRatings from "react-star-ratings";
import { useForm } from "react-hook-form";
import { useStateValue } from "./globalState/StateProvider";
import Reviews from './Reviews';
import "./ViewBook.css";

function ViewBook(props) {
  const [{ user }] = useStateValue();
  const [id, setId] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [givenRating, setGivenRating] = useState(0);
  const [comment, setComment] = useState("");

  const [everythingAboutABook, setEverythingAoutABook] = useState({});

  const history = useHistory();

  const fetchInitialData = async () => {
    let response = await fetch(
      "http://localhost:8080/books/reviews/" +
        window.location.pathname.split("/")[2] +
        "/",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": user.token,
        },
      }
    ).then((response) => {
      return response.json();
    });

    setEverythingAoutABook(response);
    console.log("response..", response);
    let rate = 0.0;
    setReviews(response.reviews);
    reviews?.forEach((review) => {
      rate += review.rating;
      console.log("rating..", review.rating);
    });
    if (rate === 0.0) rate = 5;
    else rate = rate /  response.reviews?.length;

    setRating(rate);
    console.log("ratinf gor the book: ", response.reviews);
  };

  useEffect(async () => {
    if (!user) {
      history.push("/sign-up");
    } else {
      setId(window.location.pathname.split("/")[2]);
      console.log("id: ", window.location.pathname.split("/"));
      fetchInitialData();
    }
    return () => {};
  }, []);

  const ratingChanged = (newRating) => {
    setGivenRating(newRating);
  };

  const addReview = () => {
    if (givenRating !== 0  && comment) {
     
      fetch(
        "http://localhost:8080/books/reviews/" +
          window.location.pathname.split("/")[2] +
          "/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": user.token,
          },
          body: JSON.stringify({
            rating: givenRating,
            comment: comment,
            bookId: window.location.pathname.split("/")[2],
            userId: user._id,
          }),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("review added..", data);
          setGivenRating(0);
          setComment('')
          fetchInitialData();
          let book = {
            name: everythingAboutABook?.bookName,
            author: everythingAboutABook?.bookAuthor,
            category: everythingAboutABook?.bookCategory,
            price: everythingAboutABook?.bookPrice,
            paid: everythingAboutABook?.bookPaid,
            rating: rating
    
          }
          fetch(`http://localhost:8080/books/${ window.location.pathname.split("/")[2]}`, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "auth-token": user.token,
            },
            body: JSON.stringify({ book }),
          }).then(response => {
              return response.json()
          }).then(data => {
            console.log('update response..', data)
          });
         
          alert("review Added!");
          
        });
    } else {
      alert("Please Give comment with rating!");
    }
  };

  const goFoeward = (price) => {
     if(price != 0) {
       alert("You have to pay to read or buy this book")
     } else {
      alert("Well this is a dummy book which basically have no data!")
     }
  }

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="app-body text-center viewBook">
          <p className="viewBook__title">{everythingAboutABook?.bookName}</p>
          <hr></hr>
          <div className="vewBook__info">
            <h4>
              <span className="span">Author: </span>
              {everythingAboutABook?.bookAuthor}
            </h4>
            <h4>
              <span className="span">Category: </span>{" "}
              {everythingAboutABook?.bookCategory}
            </h4>
            <h4>
              <span className="span">Price: </span>{" "}
              {"$"+everythingAboutABook?.bookPrice}
            </h4>
            <p>
              <span className="span">Rating: </span>{" "}
              <StarRatings
                rating={rating}
                starRatedColor="yellow"
                starDimension="20px"
                numberOfStars={5}
                name="rating"
              />
            </p>
            <p>
              <span className="span">About: </span>{" "}
              <p>
                This is a bokk about Interesting things about his whole career
                and personal life moments that makes him who he is now
              </p>
            </p>
          </div>
          <hr></hr>
           <button className='btn btn-primary btn-block' onClick ={() => goFoeward(everythingAboutABook.bookPrice)}>Buy/Read</button>
          <hr></hr>
          <div className="viewBook__addReview">
            <h4>Give a review</h4>
            <div className="viewBook__addReview__reviewForm">
              <form>
                <div className="reviewComment">
                  <h4>Comment:</h4>
                  <textarea
                    name="message"
                    rows="4"
                    cols="80"
                    placeholder="Your message..."
                    onChange={(event) => setComment(event.target.value)}
                  ></textarea>
                </div>
                <div className="reviewRating">
                  <label>Rating: </label>
                  <p>
                    {" "}
                    <ReactStars
                      count={5}
                      onChange={ratingChanged}
                      size={40}
                      activeColor="#ffd700"
                    />
                  </p>
                </div>
              </form>
              <button className="btn btn-primary btn-block" onClick={addReview}>
                post
              </button>
            </div>
          </div>
          <hr></hr>
          <div className="viewBook__reviews">
            {reviews?.length === 0 && <p>No reviews yet!</p>}
            {reviews?.length && (
              <div>
                <h4>-- All reviews -- </h4>
                {/* {reviews.forEach((review) => (
                  <div>
                    <h5>
                      <span>Reviewd by: </span>
                      {review.userId}
                    </h5>
                    <span>Comment: </span> <p>{review.comment}</p>
                    <span>Rating: </span> <p>{review.rating}</p>
                  </div>
                ))} */}
                <Reviews reviews = {reviews}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBook;
