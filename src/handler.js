const { nanoid } = require("nanoid");
const bookshelf = require("./books");

const saveBookHandler = (Request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = Request.payload;

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = pageCount === readPage;

	if (!name) {
		const response1 = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
		response1.code(400);
		return response1;
	}

	if (readPage > pageCount) {
		const response2 = h.response({
			status: "fail",
			message:
				"Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response2.code(400);
		return response2;
	}

	//memasukkan data dengan push
	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};
	bookshelf.push(newBook);

	//cek apakah sudah masuk ke array?
	const isSucces = bookshelf.filter((book) => book.id === id).length > 0;

	if (isSucces) {
		const response3 = h.response({
			status: "success",
			message: "Buku berhasil ditambahkan",
			data: {
				bookId: id,
			},
		});
		response3.code(201);
		return response3;
	}

	const response = h.response({
		status: "fail",
		message: "Buku gagal ditambahkan",
	});
	response.code(500);
	return response;
};

const getAllBooksHandler = (Request, h) => {
	const { name, finished, reading } = Request.query;

	let filterBooks = bookshelf;

	if (name) {
		filterBooks = filteredBooks.filter((book) =>
			book.name.toLowerCase().includes(name.toLowerCase())
		);
	}
	if (finished) {
		filterBooks = filteredBooks.filter(
			(book) => book.finished === !!Number(finished)
		);
	}
	if (reading) {
		filterBooks = filteredBooks.filter(
			(book) => book.reading === !!Number(reading)
		);
	}

	const response = h.response({
		status: "success",
		data: {
			books: filterBooks.map((book) => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			})),
		},
	});
	response.code(200);

	return response;
};

const getBookByIdHAndler = (Request, h) => {
	const { bookId } = Request.params;

	//mendapatkan objek bukunya dengan id
	const book = bookshelf.filter((n) => n.id === bookId)[0];

	//memastikan objek !undefined
	if (book) {
		return {
			status: "success",
			data: {
				book,
			},
		};
	}

	const response = h.response({
		status: "fail",
		message: "Buku tidak ditemukan",
	});
	response.code(404);
	return response;
};

const editBookByIdHandler = (Request, h) => {
	const { bookId } = Request.params;

	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = Request.payload;

	const index = bookshelf.findIndex((n) => n.id === bookId);
	if (index !== -1) {
		if (!name) {
			const response5 = h.response({
				status: "fail",
				message: "Gagal memperbarui buku. Mohon isi nama buku",
			});
			response5.code(400);
			return response5;
		}

		if (readPage > pageCount) {
			const response4 = h.response({
				status: "fail",
				message:
					"Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
			});
			response4.code(400);
			return response4;
		}
		const finished = pageCount === readPage;
		const updatedAt = new Date().toISOString();

		bookshelf[index] = {
			...bookshelf[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			finished,
			updatedAt,
		};
		const response7 = h.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		});
		response7.code(200);
		return response7;
	}

	const response = h.response({
		status: "fail",
		message: "Gagal memperbarui buku. Id tidak ditemukan",
	});
	response.code(404);
	return response;
};

const deleteBookByIdHandler = (Request, h) => {
	//mendapatkan nilai id yang dikirim melalui parameter
	const { bookId } = Request.params;

	//mendapatkan index dari id yang didapat
	const index = bookshelf.findIndex((n) => n.id === bookId);
	if (index !== -1) {
		bookshelf.splice(index, 1);
		const response = h.response({
			status: "success",
			message: "Buku berhasil dihapus",
		});
		response.code(200);
		return response;
	}
	const response6 = h.response({
		status: "fail",
		message: "Buku gagal dihapus. Id tidak ditemukan",
	});
	response6.code(404);
	return response6;
};
module.exports = {
	saveBookHandler,
	getAllBooksHandler,
	getBookByIdHAndler,
	editBookByIdHandler,
	deleteBookByIdHandler,
};
