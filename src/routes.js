const {
	saveBookHandler,
	getAllBooksHandler,
	getBookByIdHAndler,
	editBookByIdHandler,
	deleteBookByIdHandler,
} = require("./handler");

const routes = [
	{
		method: "POST",
		path: "/books",
		handler: saveBookHandler,
	},
	{
		method: "GET",
		path: "/books",
		handler: getAllBooksHandler,
	},
	{
		method: "GET",
		path: "/books/{bookId}",
		handler: getBookByIdHAndler,
	},
	{
		method: "PUT",
		path: "/books/{bookId}",
		handler: editBookByIdHandler,
	},
	{
		method: "DELETE",
		path: "/books/{bookId}",
		handler: deleteBookByIdHandler,
	},
];

module.exports = routes;
