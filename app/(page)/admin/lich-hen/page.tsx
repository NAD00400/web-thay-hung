"use client";
import LichHenCalendar from '@/app/components/lichhen/lichhen.table';
import { useEffect, useState } from 'react';

export default function LichHenPage() {
  const [data, setData] = useState<ILichHen[]>([]);

  const fetchAppointments = async () => {
    const response = await fetch('/api/lich-hen');
    const appointments = await response.json();
    setData(appointments);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return <LichHenCalendar data={data} onReload={fetchAppointments} />;
}
