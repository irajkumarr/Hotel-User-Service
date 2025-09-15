const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");
const { AppError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

class UserRepository extends CrudRepository {
  constructor() {
    super(prisma.user);
  }

  async getByEmail(email) {
    const response = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (response) {
      throw new AppError(
        "User already exists with this email",
        StatusCodes.CONFLICT
      );
    }
    return response;
  }
}

module.exports = UserRepository;
