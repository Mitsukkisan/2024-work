import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { CssBaseline, Box, Typography, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from '@mui/material/';
import Menu from '../components/Menu';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ja'; // 日本語ロケールをインポート
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Loading from '../components/Loading';


export const TaskContext = createContext();

const localizer = momentLocalizer(moment);

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/api/v1/tasks')
      .then(({ data: response }) => {
        setTasks(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedTask(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = async () => {
    if (selectedTask) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/tasks/${selectedTask._id}`);
        setTasks(tasks.filter(task => task._id !== selectedTask._id));
        handleClose();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const events = tasks.map(task => ({
    ...task,
    title: task.name,
    start: new Date(task.deadline),
    end: new Date(task.deadline),
    allDay: true,
  }));

  // momentのロケールを日本語に設定
  moment.locale('ja');

  return (
    <>
      <CssBaseline />
      <Menu />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ToDoカレンダー
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        {loading ? (
          <Loading/>
        ) : (
          <Paper sx={{ width: '80%', padding: 2 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectEvent={handleSelectEvent}
              messages={{
                allDay: '終日',
                previous: '先月',
                next: '翌月',
                today: '今日',
                month: '月',
                week: '週',
                day: '日',
                agenda: '予定',
                date: '日付',
                time: '時間',
                event: 'イベント',
                noEventsInRange: '現在の予定はありません',
                showMore: total => `+さらに表示 (${total})`
              }}
            />
          </Paper>
        )}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>タスクの詳細</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedTask && selectedTask.name}
          </DialogContentText>
          <DialogContentText>
            期限: {selectedTask && moment(selectedTask.deadline).format('YYYY-MM-DD')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit/${selectedTask._id}`)}
            color="primary"
          >
            編集
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            color="secondary"
          >
            削除
          </Button>
          <Button onClick={handleClose} color="default">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
      <Footer/>
    </>
  );
};

export default Home;