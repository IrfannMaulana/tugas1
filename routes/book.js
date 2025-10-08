const { PrismaClient } = require("../generated/prisma/client");

const router = require("express").Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    const where = {};

    if (search) {
      where.OR = [{ title: { contains: search } }];
    }

    const books = await prisma.book.findMany({
      where,
    }); // SELECT * FROM book
    return res.json({
      status: true,
      message: "Berhasil mengambil data buku",
      data: books,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, author, publisher, year } = req.body;

    const exist = await prisma.book.findFirst({
      where: {
        title: title,
      },
    });

    if (exist) {
      throw new Error("Buku sudah terdaftar");
    }

    const book = await prisma.book.create({
      data: {
        judul,
        author,
        publisher,
        year: Number(year),
      },
    });
    return res.json({
      status: true,
      message: "Berhasil menambahkan data buku",
      data: book,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
