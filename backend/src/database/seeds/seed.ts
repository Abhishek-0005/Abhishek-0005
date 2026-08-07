import 'reflect-metadata';
import 'dotenv/config';
import dataSource from '../../../data-source';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import * as bcrypt from 'bcrypt';

async function run() {
  await dataSource.initialize();
  const repo: Repository<User> = dataSource.getRepository(User);

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || 'Admin';
  const roles = (process.env.SEED_ADMIN_ROLES || 'admin').split(',').map((r) => r.trim());

  if (!email || !password) {
    console.log('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to seed admin. Skipping.');
    await dataSource.destroy();
    return;
  }

  let user = await repo.findOne({ where: { email: email.toLowerCase() } });
  if (!user) {
    user = repo.create({ email: email.toLowerCase(), name, roles });
    user.password = await bcrypt.hash(password, 10);
    await repo.save(user);
    console.log('Admin user created:', email);
  } else {
    console.log('Admin user already exists:', email);
  }

  await dataSource.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
