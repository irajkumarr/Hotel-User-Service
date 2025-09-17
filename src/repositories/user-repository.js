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
    return response;
  }

  async clearExpiredVerificationToken(timestamp) {
    const response = await prisma.user.updateMany({
      where: {
        verificationTokenExpiry: { lt: timestamp },
        isVerified: false,
      },
      data: {
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });
    return response;
  }

  async clearExpiredResetToken(timestamp) {
    const response = await prisma.user.updateMany({
      where: {
        resetPasswordExpiry: { lt: timestamp },
      },
      data: {
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });
    return response;
  }

  async deleteUnverifiedAccounts(timestamp) {
    const response = await prisma.user.deleteMany({
      where: {
        isVerified: false,
        createdAt: { lt: timestamp },
      },
    });
    return response;
  }
}

module.exports = UserRepository;
