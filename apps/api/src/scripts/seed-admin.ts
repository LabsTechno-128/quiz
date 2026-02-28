import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { Roles } from '../user/enums/user-roles.enum';

async function main() {
  const DS = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  });

  try {
    await DS.initialize();
    console.log('Database connected for seeding');

    const userRepo = DS.getRepository(User);

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.SEED_ADMIN_NAME || 'Admin';

    const existing = await userRepo.findOne({ where: { email: adminEmail } });
    if (existing) {
      process.exit(0);
    }

    const hashed = await bcrypt.hash(adminPassword, 10);

    const admin = userRepo.create({
      name: adminName,
      email: adminEmail,
      password: hashed,
      roles: [Roles.SUPER_ADMIN],
      isActive: true,
      availToSetPassword: false,
    });

    await userRepo.save(admin);

    console.log(`Admin user created: ${adminEmail}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

main();
