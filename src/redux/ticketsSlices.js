import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async () => {
    const response = await axios.get(
      'https://api.quicksell.co/v1/internal/frontend-assignment'
    );

    const { tickets, users } = response.data;

    const ticketsWithUserData = tickets.map(ticket => {
      const user = users.find(user => user.id === ticket.userId);
      return { ...ticket, userName: user ? user.name : 'Unknown' };
    });

    return ticketsWithUserData;
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTickets.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ticketsSlice.reducer;

const sortTickets = (tickets, ordering) => {
  return [...tickets].sort((a, b) => {
    if (ordering === 'priority') {
      return a.priority - b.priority;
    }
    if (ordering === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
};

export const selectGroupedTickets = (state, grouping, ordering) => {
  const { tickets } = state.tickets;
  const sortedTickets = sortTickets(tickets, ordering);

  const groups = {
    status: {
      Todo: sortedTickets.filter(ticket => ticket.status === 'Todo'),
      'In progress': sortedTickets.filter(
        ticket => ticket.status === 'In progress'
      ),
      Backlog: sortedTickets.filter(ticket => ticket.status === 'Backlog'),
    },
    user: sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.userName]) acc[ticket.userName] = [];
      acc[ticket.userName].push(ticket);
      return acc;
    }, {}),
    priority: sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.priority]) acc[ticket.priority] = [];
      acc[ticket.priority].push(ticket);
      return acc;
    }, {}),
  };

  return groups[grouping];
};
