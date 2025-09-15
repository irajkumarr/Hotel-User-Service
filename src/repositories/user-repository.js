const CrudRepository = require("./crud-repository");
const { prisma } = require("../config");

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
    if (!response) {
      throw new AppError(
        "Not able to find the resource",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }
}

module.exports = UserRepository;
