'use client';

import dynamic from 'next/dynamic';

const StudentApp = dynamic(() => import('../../components/StudentApp'), {
  ssr: false,
});

export default function StudentDashboard() {
  return <StudentApp />;
}
