const { compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor({
    adminService,

    Error,
  }) {
    this.adminService = adminService;
    this.error = Error;
  }

  async login(body) {
    const admin = await this.adminService.findByEmail(body.email);

    if (!admin) {
      throw new this.error('User does not exist', 400);
    }

    const isPasswordCorrect = await compare(body.password, admin.authToken);

    if (!isPasswordCorrect) {
      throw new this.error('Incorrect password', 403);
    }

    const { token, expiresIn } = this.generateToken(admin);

    await this.adminService.updateLastLogin(admin.id);

    return {
      token,
      expiresIn,
    };
  }

  generateToken(user) {
    const expiresIn = 2400;

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn,
      },
    );

    return {
      token,
      expiresIn,
    };
  }

}

module.exports.default = AuthService;
