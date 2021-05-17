import { Injectable } from '@nestjs/common';
import { DataTypes, Dialect, ModelCtor, Sequelize } from 'sequelize';
import { User, UserInfo, UserRole } from 'src/models/user';
import { hashPassword, comparePass } from './hasher';
import dbConfig from 'config/database.json';
import admin from 'config/adminCredentials.json';

@Injectable()
export class UserService {
  private sequelize: Sequelize;
  private User: ModelCtor<any>;

  constructor() {
    this.sequelize = new Sequelize(
      dbConfig.name,
      dbConfig.login,
      dbConfig.password,
      {
        host: dbConfig.host,
        dialect: dbConfig.dialect as Dialect,
      },
    );

    this.User = this.sequelize.define(dbConfig.tableName, {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    

    this.User.sync().then(() => UserService.ensureAdmin(this));
  }

  private static async ensureAdmin (service: UserService) {
    const user = await service.findByEmail(admin.id);
    if (!user) {
      await service.addUser(admin.id, admin.password, UserRole.Admin);
    }
  }

  async addUser(email: string, password: string, role: UserRole) {
    const hash = await hashPassword(password);
    await this.User.create({ email: email, password: hash, role: role });
  }

  async findByEmail(email: string): Promise<User> {
    return this.User.findByPk(email);
  }

  async comparePasswords(email: string, password: string): Promise<UserInfo> {
    const user = await this.findByEmail(email);
    if (user && await comparePass(password, user.password)) {
      return { email: user.email, role: user.role };
    }
    return null;
  }
}
