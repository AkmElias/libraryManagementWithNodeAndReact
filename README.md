A library management app with MERN stack with payment integration.

Project setup: 
	1. cd backend -> npm  install -> npm start (used npm for third part package managing). 
	2. cd frontend -> yarn install -> yarn start (used yarn as npm is not doing good with react for some weird reason)

to go through thw whole prjoect:
	As the database of the project is accessable from remote(basically connected to mongodb atlas) so it is possible to check with this cardentials.
	admin cardential: 
		email: email: akmelias11@gmail.com
		password: 12345678
	normal user cardential:
		email: imran@gmail.com
		password: 12345678
	--------------------------------------------------------------------------------------------
Project descriptions: 
 	backend:
		1. Mainly build with express which is NodeJs framework divided with models,routes and controllers
		2. Authentication with 'jsonwebtoken'
		3. Social authentication with 'google'
		4. 'JOI' library used for model validation
		5. POSTMAN used for api testing
	frontend:
		1. Build with reactjs .. index.js is the main file and whole app routing is in app.js
		2. third party packages used: 
			1. react-bootstrap, @material-ui/icons, react-router-dom, 
			2. react-hook-form form form validation
			3. react-stripe-checkout for payment with stripe
			4. reactjs-popup for using popup compnents such as update/add books and few littile packages
		3. Payment needed when a user try to buy/read a book which has a price/ everything works fine so far.
