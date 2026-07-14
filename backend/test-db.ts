import prisma from './db';

async function main() {
  console.log('Starting sanity check...');

  // 1. Create a user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: 'fake_hash_123',
    },
  });
  console.log('✅ Created User:', user);

  // 2. Create a conversation for that user
  const conversation = await prisma.conversation.create({
    data: {
      title: 'First AI Search',
      userId: user.id,
    },
  });
  console.log('✅ Created Conversation:', conversation);

  // 3. Query the user back with their conversations
  const fetchedUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { conversations: true },
  });
  console.log('✅ Fetched User with Conversations:', fetchedUser);
}

main()
  .catch((e) => {
    console.error('❌ Error during sanity check:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('✅ Disconnected.');
  });
