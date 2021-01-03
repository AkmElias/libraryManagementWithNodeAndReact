// @ts-nocheck
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useStateValue } from "./globalState/StateProvider";

function UpdateBook({book,close,fetchBooks,refreshList}) {
  const [{ user, books }, dispatch] = useStateValue();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      category: book.category,
      paid: book.paid === true ? "paid": "free",
      price: book.price,
    },
  });
  const [disable,setDisable] = useState(book.paid === true ? true : false);

  const onSubmit = ({category,paid,price}) => {

      if(paid === "free") {
          book.price = 0;
          book.paid = false;
      } else {
         book.price = price;
         book.paid = true;
      }
      book.category = category;
      
      fetch(`http://localhost:8080/books/${book._id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": user.token,
        },
        body: JSON.stringify({ book}),
      })
        .then((response) => {
          return response.json();
        })
        .then((data, e) => {
            console.log("updated book..", data);
          fetchBooks();
          e.target.reset();
          
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Update/Edit</h3>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              className="form-control"
              ref={register({
                required: true,
              })}
            />
          </div>

          <div className="form-group">
            <label>Make it paid/free</label>
            <input
              type="text"
              name="paid"
              className="form-control"
              placeholder="Enter Author name"
              ref={register({ required: true })}
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              className="form-control"
              disabled = {disable}
              ref={register({ required: true })}
            />
          </div>
         
          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
        </form>
        <button
          className="btn btn-warning btn-block padding-8 margin-top-8"
          onClick={() => {
            console.log("modal closed ");
            close()
          }}
        >
          close
        </button>
      </div>
    </div>
  );
}

export default UpdateBook;
