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
import "./Books.css";


function Books() {
  const { register, handleSubmit, errors } = useForm();
  const [booksList, setBooksList] = useState([]);
  const [tempBooklist,setTempBookList] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'))
  // const [{books }, dispatch] = useStateValue();
  
  const history = useHistory();

  const fetchBooks = async () => {
    console.log("token..", user.token);
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
        setTempBookList(books);
        console.log("response in booksList..", booksList);
      })
      .catch((err) => {
        console.log("error in response..", err);
      });
  };

  useEffect(async () => {
    console.log('user from local storage: ',user)
    if (user === null){
      history.push('/sign-in')
    }
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

  const tableFilter = (search) => {
    console.log("search: ",search)
    // if(search === ""){
    //   setBooksList(tempBooklist)
    // } else {
    //   let tempBooks = booksList.filter(book => {
    //     return book.name === search || book.author === search || book.category === search
    //   })
    //   setBooksList(tempBooks)
    //   console.log('list',tempBooks)
    // }

    setBooksList(tempBooklist.filter(book => (book.name.includes(search) || book.author.includes(search) || book.category.includes(search))))
    
  }

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
            <div className='form-group'><input className='search__input' type="text" id="myInput"
             onChange={event => tableFilter(event.target.value)} placeholder="Filter books by name/author/category.."/></div>
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
                    <tr key={book._id}>
                      <td>1</td>
                      <td>{book.name}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.rating.toFixed(2)}</td>
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
                  <p className="text-center">
                    The book list in the Library is currently Empty!
                  </p>
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
