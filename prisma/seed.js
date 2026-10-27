try {
  process.loadEnvFile?.();
} catch {}

import { PrismaClient } from '@prisma/client';
import { DEFAULT_ORG_ID, DEFAULT_USER_ID, ensureNeonSeed } from '../server/seedDefaults.js';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING FULL DATASET TO NEON POSTGRESQL ---');

  // 1. Ensure Default Organization and Super Admin exist
  await ensureNeonSeed(prisma);

  const org = await prisma.organization.findUnique({ where: { id: DEFAULT_ORG_ID } });
  const adminUser = await prisma.user.findUnique({ where: { id: DEFAULT_USER_ID } });

  console.log(`✓ Organization verified: ${org?.name} (${org?.id})`);
  console.log(`✓ Super Admin verified: ${adminUser?.name} (${adminUser?.id})`);

  // 2. Additional Staff / Team Members
  const managerId = 'a1111111-2222-4333-8444-555555555551';
  await prisma.user.upsert({
    where: { email: 'rahul.nair@acadeno.in' },
    update: {
      name: 'Rahul Nair',
      role: 'event_manager',
      status: 'active',
      org_id: DEFAULT_ORG_ID,
    },
    create: {
      id: managerId,
      org_id: DEFAULT_ORG_ID,
      name: 'Rahul Nair',
      email: 'rahul.nair@acadeno.in',
      password_hash: 'Acadeno2026!',
      role: 'event_manager',
      status: 'active',
    },
  });

  const staffId = 'a1111111-2222-4333-8444-555555555552';
  await prisma.user.upsert({
    where: { email: 'sneha.menon@acadeno.in' },
    update: {
      name: 'Sneha Menon',
      role: 'staff',
      status: 'active',
      org_id: DEFAULT_ORG_ID,
    },
    create: {
      id: staffId,
      org_id: DEFAULT_ORG_ID,
      name: 'Sneha Menon',
      email: 'sneha.menon@acadeno.in',
      password_hash: 'Acadeno2026!',
      role: 'staff',
      status: 'active',
    },
  });
  console.log('✓ Staff members created / updated');

  // 3. EVENT 1: Ai Workshop (The live event matching screen 09)
  const event1Id = 'e1111111-1111-4111-8111-111111111111';
  const event1 = await prisma.event.upsert({
    where: { id: event1Id },
    update: {
      name: 'Ai Workshop',
      slug: 'ai-workshop',
      short_description: 'Comprehensive hands-on AI & Machine Learning Workshop covering GenAI, Agentic Workflows, and Neural Architectures at Acadeno Research & Innovation Centre.',
      banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      venue: 'Acadeno Office',
      start_date: new Date('2026-09-11'),
      end_date: new Date('2026-09-11'),
      start_time: '10:00 AM',
      end_time: '1:00 PM',
      status: 'active',
      max_registrations: 100,
      require_payment: false,
    },
    create: {
      id: event1Id,
      org_id: DEFAULT_ORG_ID,
      created_by: DEFAULT_USER_ID,
      name: 'Ai Workshop',
      slug: 'ai-workshop',
      short_description: 'Comprehensive hands-on AI & Machine Learning Workshop covering GenAI, Agentic Workflows, and Neural Architectures at Acadeno Research & Innovation Centre.',
      banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      venue: 'Acadeno Office',
      start_date: new Date('2026-09-11'),
      end_date: new Date('2026-09-11'),
      start_time: '10:00 AM',
      end_time: '1:00 PM',
      status: 'active',
      max_registrations: 100,
      require_payment: false,
    },
  });

  // Event 1 Form Schema
  await prisma.eventForm.upsert({
    where: { event_id: event1Id },
    update: {
      schema: [
        { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1, placeholder: 'Enter full name' },
        { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2, placeholder: 'name@example.com' },
        { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3, placeholder: '+91 98765 43210' },
        { id: 'f_org', type: 'text', label: 'College / Organization', required: false, order: 4, placeholder: 'Your institution' },
        { id: 'f_role', type: 'dropdown', label: 'Designation / Status', required: true, order: 5, options: ['Student', 'Faculty', 'Software Engineer', 'Researcher'] },
      ],
      version: 1,
    },
    create: {
      event_id: event1Id,
      schema: [
        { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1, placeholder: 'Enter full name' },
        { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2, placeholder: 'name@example.com' },
        { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3, placeholder: '+91 98765 43210' },
        { id: 'f_org', type: 'text', label: 'College / Organization', required: false, order: 4, placeholder: 'Your institution' },
        { id: 'f_role', type: 'dropdown', label: 'Designation / Status', required: true, order: 5, options: ['Student', 'Faculty', 'Software Engineer', 'Researcher'] },
      ],
      version: 1,
    },
  });

  // Event 1 Theme
  await prisma.eventTheme.upsert({
    where: { event_id: event1Id },
    update: {
      template: 'workshop',
      colors: {
        primary: '#2563EB',
        secondary: '#4F46E5',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        button: '#FF7A00',
        buttonText: '#FFFFFF',
        accent: '#06B6D4',
      },
      typography: { fontFamily: 'Plus Jakarta Sans', headingSize: 'lg', bodySize: 'md' },
      layout: 'centered',
      banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
    create: {
      event_id: event1Id,
      template: 'workshop',
      colors: {
        primary: '#2563EB',
        secondary: '#4F46E5',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        button: '#FF7A00',
        buttonText: '#FFFFFF',
        accent: '#06B6D4',
      },
      typography: { fontFamily: 'Plus Jakarta Sans', headingSize: 'lg', bodySize: 'md' },
      layout: 'centered',
      banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
  });

  // Event 1 Registrations
  const e1Regs = [
    {
      id: 'c1111111-1111-4111-8111-111111111101',
      code: 'ACAD-AI-9021',
      responses: {
        name: 'Arjun Das',
        f_name: 'Arjun Das',
        email: 'arjun.das@gmail.com',
        f_email: 'arjun.das@gmail.com',
        phone: '+91 94471 23456',
        f_phone: '+91 94471 23456',
        f_org: 'National Institute of Technology Calicut',
        f_role: 'Student',
      },
      status: 'confirmed',
      attendance: 'present',
      source: 'qr_scan',
    },
    {
      id: 'c1111111-1111-4111-8111-111111111102',
      code: 'ACAD-AI-9022',
      responses: {
        name: 'Deepa Varma',
        f_name: 'Deepa Varma',
        email: 'deepa.varma@techsolutions.in',
        f_email: 'deepa.varma@techsolutions.in',
        phone: '+91 98460 67890',
        f_phone: '+91 98460 67890',
        f_org: 'Tech Solutions Kerala',
        f_role: 'Software Engineer',
      },
      status: 'confirmed',
      attendance: 'not_marked',
      source: 'whatsapp',
    },
    {
      id: 'c1111111-1111-4111-8111-111111111103',
      code: 'ACAD-AI-9023',
      responses: {
        name: 'Muhammed Fayis',
        f_name: 'Muhammed Fayis',
        email: 'fayis.m@uoc.ac.in',
        f_email: 'fayis.m@uoc.ac.in',
        phone: '+91 97455 11223',
        f_phone: '+91 97455 11223',
        f_org: 'University of Calicut',
        f_role: 'Researcher',
      },
      status: 'confirmed',
      attendance: 'present',
      source: 'direct',
    },
    {
      id: 'c1111111-1111-4111-8111-111111111104',
      code: 'ACAD-AI-9024',
      responses: {
        name: 'Ananya Krishnan',
        f_name: 'Ananya Krishnan',
        email: 'ananya.k@iiitmk.ac.in',
        f_email: 'ananya.k@iiitmk.ac.in',
        phone: '+91 95678 99887',
        f_phone: '+91 95678 99887',
        f_org: 'Digital University Kerala',
        f_role: 'Student',
      },
      status: 'confirmed',
      attendance: 'not_marked',
      source: 'whatsapp',
    },
  ];

  for (const reg of e1Regs) {
    await prisma.registration.upsert({
      where: { registration_code: reg.code },
      update: {
        responses: reg.responses,
        status: reg.status,
        attendance_status: reg.attendance,
      },
      create: {
        id: reg.id,
        event_id: event1Id,
        registration_code: reg.code,
        responses: reg.responses,
        status: reg.status,
        attendance_status: reg.attendance,
        source: reg.source,
      },
    });
  }
  console.log(`✓ Event 1 created: "${event1.name}" with 4 confirmed participant registrations`);

  // 4. EVENT 2: Tech Leadership Summit 2026
  const event2Id = 'e2222222-2222-4222-8222-222222222222';
  const event2 = await prisma.event.upsert({
    where: { id: event2Id },
    update: {
      name: 'Tech Leadership Summit 2026',
      slug: 'tech-leadership-summit-2026',
      short_description: 'Annual gathering of technology pioneers, engineering managers, and startup founders discussing the future of AI & Enterprise Software.',
      banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
      venue: 'Acadeno Innovation Hall, Palayam, Kozhikode',
      start_date: new Date('2026-11-20'),
      end_date: new Date('2026-11-21'),
      start_time: '09:30 AM',
      end_time: '05:30 PM',
      status: 'active',
      max_registrations: 250,
      require_payment: false,
    },
    create: {
      id: event2Id,
      org_id: DEFAULT_ORG_ID,
      created_by: DEFAULT_USER_ID,
      name: 'Tech Leadership Summit 2026',
      slug: 'tech-leadership-summit-2026',
      short_description: 'Annual gathering of technology pioneers, engineering managers, and startup founders discussing the future of AI & Enterprise Software.',
      banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
      venue: 'Acadeno Innovation Hall, Palayam, Kozhikode',
      start_date: new Date('2026-11-20'),
      end_date: new Date('2026-11-21'),
      start_time: '09:30 AM',
      end_time: '05:30 PM',
      status: 'active',
      max_registrations: 250,
      require_payment: false,
    },
  });

  await prisma.eventForm.upsert({
    where: { event_id: event2Id },
    update: {
      schema: [
        { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1 },
        { id: 'f_email', type: 'email', label: 'Work Email', required: true, order: 2 },
        { id: 'f_phone', type: 'phone', label: 'Phone Number', required: true, order: 3 },
        { id: 'f_company', type: 'text', label: 'Company Name', required: true, order: 4 },
        { id: 'f_role', type: 'text', label: 'Job Title', required: true, order: 5 },
      ],
      version: 1,
    },
    create: {
      event_id: event2Id,
      schema: [
        { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1 },
        { id: 'f_email', type: 'email', label: 'Work Email', required: true, order: 2 },
        { id: 'f_phone', type: 'phone', label: 'Phone Number', required: true, order: 3 },
        { id: 'f_company', type: 'text', label: 'Company Name', required: true, order: 4 },
        { id: 'f_role', type: 'text', label: 'Job Title', required: true, order: 5 },
      ],
      version: 1,
    },
  });

  await prisma.eventTheme.upsert({
    where: { event_id: event2Id },
    update: {
      template: 'corporate',
      colors: {
        primary: '#0F172A',
        secondary: '#334155',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        button: '#2563EB',
        buttonText: '#FFFFFF',
        accent: '#FF7A00',
      },
      typography: { fontFamily: 'Inter', headingSize: 'md', bodySize: 'md' },
      layout: 'centered',
      banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    },
    create: {
      event_id: event2Id,
      template: 'corporate',
      colors: {
        primary: '#0F172A',
        secondary: '#334155',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        button: '#2563EB',
        buttonText: '#FFFFFF',
        accent: '#FF7A00',
      },
      typography: { fontFamily: 'Inter', headingSize: 'md', bodySize: 'md' },
      layout: 'centered',
      banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    },
  });

  const e2Regs = [
    {
      id: 'c2222222-2222-4222-8222-222222222201',
      code: 'ACAD-TLS-7701',
      responses: {
        name: 'Kavitha Pillai',
        f_name: 'Kavitha Pillai',
        email: 'kavitha.p@cognizant.com',
        f_email: 'kavitha.p@cognizant.com',
        phone: '+91 98951 33445',
        f_phone: '+91 98951 33445',
        f_company: 'Cognizant Technology Solutions',
        f_role: 'Engineering Lead',
      },
      status: 'confirmed',
      attendance: 'present',
      source: 'direct',
    },
    {
      id: 'c2222222-2222-4222-8222-222222222202',
      code: 'ACAD-TLS-7702',
      responses: {
        name: 'Rohit K. George',
        f_name: 'Rohit K. George',
        email: 'rohit@startuphub.in',
        f_email: 'rohit@startuphub.in',
        phone: '+91 94960 77889',
        f_phone: '+91 94960 77889',
        f_company: 'Kerala Startup Mission',
        f_role: 'Founder & CEO',
      },
      status: 'confirmed',
      attendance: 'not_marked',
      source: 'qr_scan',
    },
  ];

  for (const reg of e2Regs) {
    await prisma.registration.upsert({
      where: { registration_code: reg.code },
      update: {
        responses: reg.responses,
        status: reg.status,
        attendance_status: reg.attendance,
      },
      create: {
        id: reg.id,
        event_id: event2Id,
        registration_code: reg.code,
        responses: reg.responses,
        status: reg.status,
        attendance_status: reg.attendance,
        source: reg.source,
      },
    });
  }
  console.log(`✓ Event 2 created: "${event2.name}" with 2 confirmed participants`);

  // 5. EVENT 3: Full Stack Boot Camp
  const event3Id = 'e3333333-3333-4333-8333-333333333333';
  const event3 = await prisma.event.upsert({
    where: { id: event3Id },
    update: {
      name: 'Full Stack Web Development Boot Camp',
      slug: 'full-stack-bootcamp',
      short_description: 'Intensive 4-week coding bootcamp on modern web engineering with React 19, TypeScript, Node.js, and Cloud Databases.',
      banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      venue: 'Acadeno Innovation Lab, Palayam, Kozhikode',
      start_date: new Date('2026-12-01'),
      end_date: new Date('2026-12-28'),
      start_time: '02:00 PM',
      end_time: '05:00 PM',
      status: 'active',
      max_registrations: 50,
      require_payment: false,
    },
    create: {
      id: event3Id,
      org_id: DEFAULT_ORG_ID,
      created_by: DEFAULT_USER_ID,
      name: 'Full Stack Web Development Boot Camp',
      slug: 'full-stack-bootcamp',
      short_description: 'Intensive 4-week coding bootcamp on modern web engineering with React 19, TypeScript, Node.js, and Cloud Databases.',
      banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      venue: 'Acadeno Innovation Lab, Palayam, Kozhikode',
      start_date: new Date('2026-12-01'),
      end_date: new Date('2026-12-28'),
      start_time: '02:00 PM',
      end_time: '05:00 PM',
      status: 'active',
      max_registrations: 50,
      require_payment: false,
    },
  });

  await prisma.eventForm.upsert({
    where: { event_id: event3Id },
    update: {
      schema: [
        { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1 },
        { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2 },
        { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3 },
      ],
      version: 1,
    },
    create: {
      event_id: event3Id,
      schema: [
        { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1 },
        { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2 },
        { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3 },
      ],
      version: 1,
    },
  });

  await prisma.eventTheme.upsert({
    where: { event_id: event3Id },
    update: {
      template: 'minimal',
      colors: {
        primary: '#18181B',
        secondary: '#52525B',
        background: '#FFFFFF',
        surface: '#FAFAFA',
        text: '#09090B',
        button: '#18181B',
        buttonText: '#FFFFFF',
        accent: '#2563EB',
      },
      typography: { fontFamily: 'Plus Jakarta Sans', headingSize: 'md', bodySize: 'sm' },
      layout: 'minimal',
      banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    },
    create: {
      event_id: event3Id,
      template: 'minimal',
      colors: {
        primary: '#18181B',
        secondary: '#52525B',
        background: '#FFFFFF',
        surface: '#FAFAFA',
        text: '#09090B',
        button: '#18181B',
        buttonText: '#FFFFFF',
        accent: '#2563EB',
      },
      typography: { fontFamily: 'Plus Jakarta Sans', headingSize: 'md', bodySize: 'sm' },
      layout: 'minimal',
      banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    },
  });

  console.log(`✓ Event 3 created: "${event3.name}"`);

  // 6. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        org_id: DEFAULT_ORG_ID,
        user_id: DEFAULT_USER_ID,
        action: 'event.published',
        entity_type: 'event',
        entity_id: event1Id,
        metadata: { name: 'Ai Workshop', slug: 'ai-workshop' },
      },
      {
        org_id: DEFAULT_ORG_ID,
        user_id: DEFAULT_USER_ID,
        action: 'event.published',
        entity_type: 'event',
        entity_id: event2Id,
        metadata: { name: 'Tech Leadership Summit 2026', slug: 'tech-leadership-summit-2026' },
      },
    ],
    skipDuplicates: true,
  });
  console.log('✓ Audit logs generated');

  console.log('--- ALL DATA SUCCESSFULLY SEEDED INTO NEON POSTGRESQL ---');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
