'use client';

import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LichHenForm from './form';

const localizer = momentLocalizer(moment);

export default function LichHenCalendar({ data, onReload }: { data: ILichHen[], onReload: () => void }) {
  const events = data.map((appt) => ({
    id: appt.ma_lich_hen,
    title: appt.khach_hang.ten_khach_hang,
    start: new Date(appt.ngay_hen),
    end: new Date(appt.ngay_hen),
  }));

  return (
    <div className="w-full">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg overflow-hidden">
        <div>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: '50px' }}
            views={['week', 'day']}
            defaultView="week"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <LichHenForm onSuccess={onReload} />
      </div>
    </div>
  );
}
