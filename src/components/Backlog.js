import React from 'react';
import { useSelector } from 'react-redux';
import { selectBacklogTickets } from './../redux/ticketsSlices.js';
import Card from './Card.js';

export default function Backlog() {
  const tickets = useSelector(selectBacklogTickets);

  return (
    <div>
      <h2>Backlog</h2>
      {tickets.map(ticket => (
        <Card key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
