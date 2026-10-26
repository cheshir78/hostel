import { useState } from 'react';
import DatePicker from 'react-datepicker';

// Імпорт стилів (ОБОВ'ЯЗКОВО, інакше календар розповзеться)
import "react-datepicker/dist/react-datepicker.css";


interface MyDatePickerProps {
  id?: string;
  onDateSelect?: (date: string) => void;
}

function MyDatePicker({ id, onDateSelect }: MyDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    let formattedDate = '';

    if (date) {
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;

      console.log("Дата для .NET:", formattedDate); 
      
      }

      if (onDateSelect) {
        onDateSelect(formattedDate);
    }
  };

  return (
    <div >
      <label htmlFor={id} className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Select date:
      </label>
      
      <DatePicker
        id={id}
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"           
        placeholderText="click to select"
        className="form-input" 
        isClearable                       
        todayButton="Today"            
      />
    </div>
  );
}

export default MyDatePicker;