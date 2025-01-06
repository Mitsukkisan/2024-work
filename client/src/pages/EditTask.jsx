import { IconButton, Snackbar, TextField, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '../components/Menu';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import SendIcon from '@mui/icons-material/Send';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [name, setName] = useState('');
  const [editSnackBar, setEditSnackbar] = useState(false);
  const [undoSnackBar, setUndoSnackbar] = useState(false);

  useEffect(() => {
    // タスクのデータを取得してフォームの初期値に設定
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/tasks/${id}`);
        setName(response.data.name);
        setDate(dayjs(response.data.deadline)); // 日付をdayjsオブジェクトに変換
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
      window.alert('タスク名を入力してください');
      return;
    }
    else if (name.length > 20) {
      window.alert('タスク名は20文字以内で入力してください');
      return;
    }
    if (!date) {
      window.alert('期限を設定してください');
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/api/v1/tasks/${id}`, {
        name: name,
        deadline: date.toISOString(), // 日付をISO文字列に変換
      });
      setEditSnackbar(true); // 成功時に編集スナックバーを開く
      navigate('/'); // 編集後にホームページに戻る
    } catch (error) {
      console.error('Error submitting form:', error);
      window.alert('タスクの編集に失敗しました。');
    }
  };

  const handleUndo = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/tasks/${id}`);
      console.log('Task deleted');
      setUndoSnackbar(true); // 取り消しスナックバーを開く
      setEditSnackbar(false); // 編集スナックバーを閉じる
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // タスク編集スナックバー閉じる
  const handleEditClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setEditSnackbar(false);
  };

  // タスク追加取り消しスナックバー閉じる
  const handleUndoClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setUndoSnackbar(false);
  };

  const editAction = (
    <>
      <Button color="secondary" size="small" onClick={handleUndo}>
        取り消す
      </Button>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleEditClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const undoAction = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleUndoClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Menu />
      <Paper style={{ padding: 16, margin: '16px auto', maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="タスク名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginBottom: 24 }} // マージンを増やす
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="期限"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 24 }} // マージンを増やす
            endIcon={<SendIcon />}
          >
            タスクを保存
            
          </Button>
        </form>
        <Snackbar
          open={editSnackBar}
          autoHideDuration={6000}
          onClose={handleEditClose}
          message="タスクが編集されました"
          action={editAction}
        />
        <Snackbar
          open={undoSnackBar}
          autoHideDuration={6000}
          onClose={handleUndoClose}
          message="タスクの編集が取り消されました"
          action={undoAction}
        />
      </Paper>
    </>
  );
};

export default EditTask;