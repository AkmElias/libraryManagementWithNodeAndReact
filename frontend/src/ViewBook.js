// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import StarRatings from "react-star-ratings";
// import FavoriteIcon from "@material-ui/icons/Favorite";
// import { useForm } from "react-hook-form";
import StripeCheckout from "react-stripe-checkout";
// import { useStateValue } from "./globalState/StateProvider";
import Reviews from "./Reviews";
import "./ViewBook.css";



function ViewBook(props) {
  const user = JSON.parse(localStorage.getItem('user'))
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
    console.log("pbkey:", process.env.REACT_APP_STRIPE_KEY);
    setRating(response.bookRating);
    setReviews(response.reviews);
    console.log("rating gor the book: ", response.reviews);
  };

  useEffect(async () => {
    if (user === null) {
      history.push("/sign-in");
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
    if (givenRating !== 0 && comment !== "") {
      let rate = givenRating;
      reviews.map((review) => (rate += review.rating));
      rate = rate / reviews.length;
      rate = rate.toFixed(2);
      console.log("latest rating: after devide: ", rate);

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
          setComment("");
          fetchInitialData();
          let book = {
            name: everythingAboutABook?.bookName,
            author: everythingAboutABook?.bookAuthor,
            category: everythingAboutABook?.bookCategory,
            price: everythingAboutABook?.bookPrice,
            paid: everythingAboutABook?.bookPaid,
            rating: rate,
          };
          fetch(
            `http://localhost:8080/books/${
              window.location.pathname.split("/")[2]
            }`,
            {
              method: "PATCH",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "auth-token": user.token,
              },
              body: JSON.stringify({ book }),
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              console.log("update response..", data);
            });

          alert("review Added!");
        });
    } else {
      alert("Please Give comment with rating!");
    }
  };

  const goFoeward = (price) => {
    if (price != 0) {
      alert("You have to pay to read or buy this book");
    } else {
      alert("Well this is a dummy book which basically have no data!");
    }
  };

  const bookMarkBook = (id) => {
    alert("book marked!");
  };

  const makePayment = async (token) => {
    const product = {
      name: everythingAboutABook.bookName,
      price: everythingAboutABook.bookPrice,
      productBy: "AkmElias",
    };

    const body = {
      token,
      product,
    };

    fetch("http://localhost:8080/books/payment/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": user.token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("payment response: ", response);
        alert('You successfuly purchased the Book.')
      })
      .catch((err) => console.log(err));
  };

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
              {"$" + everythingAboutABook?.bookPrice}
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
          {everythingAboutABook.bookPrice === 0 && (
            <button
              className="btn btn-primary btn-block"
              onClick={() => goFoeward(everythingAboutABook.bookPrice)}
            >
              Buy/Read for free
            </button>
          )}

          {everythingAboutABook.bookPrice != 0 && (
            <StripeCheckout
              stripeKey="pk_test_51HQ95EGDqSRH3V7uHcrv6POGL8R5XXq4JrBeVVj26o2M6MfoaKaWIMwOytJfg1nZE3F2UENDu3i8j9nH8PxOYsQ400FJPCZHx4"
              name="Buy/Read"
              token={makePayment}
              amount={everythingAboutABook.bookPrice * 100}
            >
              <button className="btn btn-primary btn-block">
                Buy/Read with ${everythingAboutABook.bookPrice}
              </button>
            </StripeCheckout>
            // <button className='btn btn-primary btn-block'>Buy/Read</button>
          )}

          <hr></hr>
          <div className="viewBook__addReview">
            <h4>Give a review</h4>
            <div className="viewBook__addReview__reviewForm">
              <form>
                <div className="reviewComment">
                  <h4>Comment:</h4>
                  <textarea
                    name={comment}
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
                <Reviews reviews={reviews} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBook;
