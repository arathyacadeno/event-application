import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function purge() {
  console.log('--- PURGING UNWANTED TEST DATA FROM NEON DB ---');
  try {
    const notifs = await prisma.notificationLog.deleteMany({});
    console.log('? Cleared notifications:', notifs.count);

    const docs = await prisma.registrationDocument.deleteMany({});
    console.log('? Cleared registration documents:', docs.count);

    const payments = await prisma.payment.deleteMany({});
    console.log('? Cleared payments:', payments.count);

    const regs = await prisma.registration.deleteMany({});
    console.log('? Cleared registrations:', regs.count);

    const themes = await prisma.eventTheme.deleteMany({});
    console.log('? Cleared event themes:', themes.count);

    const forms = await prisma.eventForm.deleteMany({});
    console.log('? Cleared event forms:', forms.count);

    const audits = await prisma.auditLog.deleteMany({});
    console.log('? Cleared audit logs:', audits.count);

    const events = await prisma.event.deleteMany({});
    console.log('? Cleared events:', events.count);

    const users = await prisma.user.deleteMany({
      where: {
        email: { not: 'admin@acadeno.in' }
      }
    });
    console.log('? Cleared sample staff accounts:', users.count);

    const remainingOrgs = await prisma.organization.count();
    const remainingUsers = await prisma.user.findMany({ select: { email: true, name: true, role: true } });
    const remainingEvents = await prisma.event.count();
    const remainingRegs = await prisma.registration.count();

    console.log('--- PURGE REPORT ---');
    console.log('Organizations:', remainingOrgs);
    console.log('Remaining Users:', remainingUsers);
    console.log('Remaining Events:', remainingEvents);
    console.log('Remaining Registrations:', remainingRegs);
  } catch (err) {
    console.error('Error during purge:', err);
  } finally {
    await prisma.$disconnect();
  }
}

purge();
