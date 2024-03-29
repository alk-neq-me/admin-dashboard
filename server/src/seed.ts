import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import _ from "lodash";
import {
  customerUserAccessResources,
  guestUserAccessResources,
  shopownerAccessResources,
} from "./type";

const prisma = new PrismaClient();

async function getHashedPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
}

async function permissionsSeed() {
  const data = _.uniqWith(
    [
      ...guestUserAccessResources,
      ...customerUserAccessResources,
      ...shopownerAccessResources,
    ],
    _.isEqual,
  );

  const permission = await prisma.permission.createMany({
    data,
  });

  console.log("Creatred build-in permissions", permission.count);
}

async function rolesSeed() {
  const customerRole = await prisma.role.upsert({
    where: {
      name: "Customer",
    },
    create: {
      name: "Customer",
      remark: "Build-in role",
      permissions: {
        connect: customerUserAccessResources.map((
          { action, resource },
        ) => ({
          action_resource: { action, resource },
        })),
      },
    },
    update: {
      permissions: {
        connect: customerUserAccessResources.map((
          { action, resource },
        ) => ({
          action_resource: { action, resource },
        })),
      },
    },
  });
  const shopowneRole = await prisma.role.upsert({
    where: {
      name: "Shopowner",
    },
    create: {
      name: "Shopowner",
      remark: "Build-in role",
      permissions: {
        connect: shopownerAccessResources.map(({ action, resource }) => ({
          action_resource: { action, resource },
        })),
      },
    },
    update: {
      permissions: {
        connect: shopownerAccessResources.map(({ action, resource }) => ({
          action_resource: { action, resource },
        })),
      },
    },
  });

  console.log(`Created: ${customerRole.name}`);
  console.log(`Created: ${shopowneRole.name}`);
}

async function brandsSeed() {
  const samsung = await prisma.brand.upsert({
    where: {
      name: "Samsung",
    },
    create: {
      name: "Samsung",
    },
    update: {},
  });

  console.log(`Created: ${samsung.name}`);
}

async function shopownersSeed() {
  const rangoonDiscountShopowner = await prisma.shopownerProvider.upsert({
    where: {
      name: "Rangoon discount",
    },
    create: {
      name: "Rangoon discount",
      remark: "Build-in shopowner",
    },
    update: {},
  });

  console.log(`Created: ${rangoonDiscountShopowner.name}`);
}

async function usersSeed() {
  const marco = await prisma.user.upsert({
    where: {
      email: "marco@admin.com",
    },
    create: {
      name: "Marco",
      username: "@marco",
      email: "marco@admin.com",
      password: await getHashedPassword("12345678@Abc"),
      verified: true,
      reward: {
        create: {
          points: 0,
        },
      },
      image:
        "https://avatars.githubusercontent.com/u/103842280?s=400&u=9fe6bb21b1133980e96384942c66aca35bc9e06d&v=4",
      isSuperuser: true,
    },
    update: {},
  });

  const boo = await prisma.user.upsert({
    where: {
      email: "boo@shopowner.com",
    },
    create: {
      name: "Boo",
      username: "@boo",
      email: "boo@shopowner.com",
      password: await getHashedPassword("12345678@Abc"),
      verified: true,
      reward: {
        create: {
          points: 0,
        },
      },
      role: {
        connect: {
          name: "Shopowner",
        },
      },
      shopownerProvider: {
        connect: {
          name: "Rangoon discount",
        },
      },
      image:
        "https://ca-times.brightspotcdn.com/dims4/default/b54bc8c/2147483647/strip/true/crop/6240x4160+0+0/resize/1200x800!/format/webp/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F87%2F81%2F24ca9c1948318fba6fd573e36f52%2Fbrd-106-04261-r-crop.jpg",
    },
    update: {},
  });

  const bob = await prisma.user.upsert({
    where: {
      email: "bob@user.com",
    },
    create: {
      name: "Bob",
      username: "@bob",
      email: "bob@user.com",
      password: await getHashedPassword("12345678@Abc"),
      verified: true,
      reward: {
        create: {
          points: 0,
        },
      },
      role: {
        connect: {
          name: "Customer",
        },
      },
      image:
        "https://resizing.flixster.com/vK77TbbXQYgkJ2HpvPp1p_W0tj4=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2FkNDZiMzU2LTFmYTQtNDgwMS1iOWM5LTgxNTg2NDMxNjBmNi53ZWJw",
    },
    update: {},
  });

  console.log(`Created: ${marco.name}`);
  console.log(`Created: ${boo.name}`);
  console.log(`Created: ${bob.name}`);
}

async function main() {
  await permissionsSeed();
  await rolesSeed();
  await shopownersSeed();
  await usersSeed();

  await brandsSeed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
