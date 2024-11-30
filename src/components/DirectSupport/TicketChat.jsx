import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    height: '60vh',
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  messageBubble: {
    padding: '12px',
    borderRadius: '18px',
    maxWidth: '70%',
    position: 'relative',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  messageRight: {
    marginLeft: 'auto',
    backgroundColor: '#007bff',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  messageLeft: {
    marginRight: 'auto',
    backgroundColor: '#fff',
    color: '#000',
    borderBottomLeftRadius: '4px',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: '-20px',
    right: '0',
  },
  dateLabel: {
    textAlign: 'center',
    margin: '24px 0',
    fontWeight: 'bold',
    color: '#888',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(2),
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '24px',
    },
  },
  sendButton: {
    borderRadius: '50%',
    minWidth: '48px',
    width: '48px',
    height: '48px',
  },
}));

const TicketChat = ({ open, onClose, ticketId }) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = io('http://182.71.43.74:6001'); // Reuse socket connection

  useEffect(() => {
    if (ticketId) {
      socket.emit('joinRoom', { ticketId });
    }

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on('disconnect', () => {
      toast.warning('Disconnected from the server');
    });

    socket.on('connect', () => {
      toast.success('Reconnected to the server');
    });

    return () => {
      socket.emit('leaveRoom', { ticketId }); // Leave room when component unmounts
      socket.disconnect();
    };
  }, [ticketId]);

  useEffect(() => {
    if (open && ticketId) {
      fetchMessages();
    }
  }, [open, ticketId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://182.71.43.74:8080/api/messages?ticketId=${ticketId}`);
      if (response.data.status === 1) {
        setMessages(response.data.messages);
      } else {
        toast.error('Failed to fetch messages');
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = { message, created_at: new Date(), sender: 'user' };

    socket.emit('chatMessage', newMessage); // Use the existing socket connection

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  // Define the renderMessages function here
  const renderMessages = () => {
    let currentDate = '';

    return messages.map((msg, index) => {
      const messageDate = formatDate(new Date(msg.created_at));
      const showDateLabel = messageDate !== currentDate;
      currentDate = messageDate;

      return (
        <React.Fragment key={index}>
          {showDateLabel && <div className={classes.dateLabel}>{messageDate}</div>}
          <ListItem className={classes.messageContainer}>
            {msg.sender === 'support' && (
              <Avatar className={classes.avatar}>S</Avatar>
            )}
            <div
              className={`${classes.messageBubble} ${
                msg.sender === 'user' ? classes.messageRight : classes.messageLeft
              }`}
            >
              <div>{msg.message}</div>
              <div className={classes.timestamp}>{formatTime(new Date(msg.created_at))}</div>
            </div>
            {msg.sender === 'user' && (
              <Avatar className={classes.avatar}>U</Avatar>
            )}
          </ListItem>
        </React.Fragment>
      );
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      classes={{ paper: 'rounded-lg' }}
    >
      <DialogTitle className="relative bg-gray-100">
        <span className="font-bold">Ticket Chat</span>
        <IconButton
          aria-label="close"
          className="absolute right-4 top-4 text-gray-500"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={`${classes.dialogContent} scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>
        <List>{renderMessages()}</List>
      </DialogContent>
      <div className="flex p-4 bg-white items-center">
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          className={`${classes.input} flex-grow mr-4`}
        />
        <Button
          onClick={handleSendMessage}
          color="primary"
          variant="contained"
          className={classes.sendButton}
        >
          <SendIcon />
        </Button>
      </div>
    </Dialog>
  );
};

export default TicketChat;
