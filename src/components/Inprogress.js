import React from 'react';
import { useSelector } from 'react-redux';
import { selectInProgressTickets } from './../redux/ticketsSlices';
import Card from './Card';

export default function Inprogress() {
  const tickets = useSelector(selectInProgressTickets);

  return (
    <div>
      <h2>In Progress</h2>
      {tickets.map(ticket => (
        <Card key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
