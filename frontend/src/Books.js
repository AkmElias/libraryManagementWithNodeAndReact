// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Table from "react-bootstrap/Table";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import UpdateIcon from "@material-ui/icons/Update";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UpdateBook from "./UpdateBook";
import ViewBook from "./ViewBook";
import "./Books.css";
import { useStateValue } from "./globalState/StateProvider";

function Books() {
  const { register, handleSubmit, errors } = useForm();
  const [booksList, setBooksList] = useState([]);
  const [ucategory, setUcategory] = useState("");
  const [uprice, setUprice] = useState(0);
  const [upaid, setUpaid] = useState("");
  const [book, setBook] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [{ user, books }, dispatch] = useStateValue();
  const history = useHistory();

  const fetchBooks = () => {
    console.log("token..", user);
    fetch("http://localhost:8080/books/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": user.token,
      },
    })
      .then(async (response) => {
        return response.json();
      })
      .then((books) => {
        setBooksList(books);
        console.log("response in booksList..", booksList);
      })
      .catch((err) => {
        console.log("error in response..", err);
      });
  };

  useEffect(() => {
    if (user == null) history.push("/sign-in");
    else {
      fetchBooks();
    }
    return () => {};
  }, []);

  //   const refreshList = () => {
  //       setBooksList(booksList)
  //   }

  const onSubmit = async ({ name, author, category }, e) => {
    // event.preventDefault();
    console.log(`${name} ${author} ${category}`);
    let newBook = {
      name: name,
      author: author,
      category: category,
      price: 0.0,
      paid: false,
      rating: 5,
    };
    let newBookList = booksList.slice();
    newBookList.push(newBook);
    setBooksList(newBookList);

    fetch("http://localhost:8080/books/addBook", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": user.token,
      },
      body: JSON.stringify({ name: name, author: author, category: category }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        fetchBooks();
        e.target.reset();
        console.log("new book..", data);
      })
      .catch((err) => {
        console.log(err);
      });

    setTrigger(false);
  };

  const goToViewBook = (id) => {
    history.push(`/book/${id}`);
  };

  const deleteBook = (id) => {
    if (window.confirm("Are you sure to delete this Book")) {
      let newBookList = booksList.filter((book) => book._id != id);
      setBooksList(newBookList);
      //   fetch(`http://localhost:8080/books/${id}`, {
      //     method: "DELETE",
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //       "auth-token": user.token,
      //     },
      //   })
      //     .then((response) => {
      //       return response.json();
      //     })
      //     .then((data) => {
      //       console.log("deleted book: ", data);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
    } else {
      return;
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="app-body container books">
          <div className="books__table text-center">
            <div className="text-center">
              {user?.role === "admin" && (
                // <button className="btn btn-primary">Add Book</button>
                <Popup
                  trigger={
                    <button className="btn btn-primary">Add Book</button>
                  }
                  position="center center"
                >
                  {(close) => (
                    <div className="auth-wrapper">
                      <div className="auth-inner">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <h3>Add a Book</h3>

                          <div className="form-group">
                            <label>name</label>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              placeholder="Enter the book name:"
                              ref={register({
                                required: true,
                              })}
                            />
                            {errors.name?.type === "required" && (
                              <p className="error-message"> Name is required</p>
                            )}
                          </div>

                          <div className="form-group">
                            <label>Author</label>
                            <input
                              type="text"
                              name="author"
                              className="form-control"
                              placeholder="Enter Author name"
                              ref={register({ required: true })}
                            />
                            {errors.author && (
                              <p className="error-message">
                                {" "}
                                Author is required
                              </p>
                            )}
                          </div>
                          <div className="form-group">
                            <label>Category</label>
                            <input
                              type="text"
                              name="category"
                              className="form-control"
                              placeholder="Enter category sdjfksldc"
                              ref={register({ required: true })}
                            />
                            {errors.category && (
                              <p className="error-message">
                                {" "}
                                Category is required
                              </p>
                            )}
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                          >
                            Submit
                          </button>
                        </form>
                        <button
                          className="btn btn-warning btn-block padding-8 margin-top-8"
                          onClick={() => {
                            console.log("modal closed ");
                            close();
                          }}
                        >
                          close
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
              )}{" "}
              <h4 className="books__tableTitle">Books List</h4>{" "}
            </div>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Price</th>
                  {user?.role === "admin" && <th>Update</th>}
                  <th>View</th>
                  {user?.role === "admin" && <th>Delete</th>}
                </tr>
              </thead>
              <tbody>
                {booksList.length > 0 ? (
                  booksList.map((book, key) => (
                    <tr>
                      <td>1</td>
                      <td>{book.name}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.rating}</td>
                      <td>${book.paid === true ? book.price : 0}</td>
                      {user?.role === "admin" && (
                        <td>
                          <Popup
                            trigger={
                              <button className="btn">
                                <UpdateIcon />
                              </button>
                            }
                            closeOnDocumentClick="bool | true"
                            position="center left"
                          >
                            {(close) => (
                              <UpdateBook
                                book={book}
                                close={close}
                                fetchBooks={fetchBooks}
                              />
                            )}
                          </Popup>
                        </td>
                      )}

                      <td>
                        {/* <button className='btn' onClick = {() => goToViewBook(book._id)}>
                          <ViewCompactIcon />
                         </button>
                        */}

                        <Link to={`/book/${book._id}`}>
                          <ViewCompactIcon />
                        </Link>
                      </td>

                      {user?.role === "admin" && (
                        <td>
                          <button
                            className="btn"
                            onClick={() => deleteBook(book._id)}
                          >
                            <DeleteForeverIcon />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <h4 className="text-center">
                    The book list in the Library is currently Empty!
                  </h4>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Books;
