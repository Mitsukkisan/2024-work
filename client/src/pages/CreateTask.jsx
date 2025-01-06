import { IconButton, Snackbar, TextField, Paper, CssBaseline, FormControlLabel, Checkbox, Box } from '@mui/material';
import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '../components/Menu';


const CreateTask = () => {
  const [deadline, setDeadline] = useState(null);
  const [name, setName] = useState('');
  const [addSnackBar, setAddSnackbar] = useState(false);
  const [undoSnackBar, setUndoSnackbar] = useState(false);
  const [taskId, setTaskId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      window.alert('タスク名を入力してください');
      return;
    }
    else if(name.length>20){
      window.alert('タスク名は20文字以内で入力してください');
      return;
    }
    if (!deadline) {
      window.alert('期限を設定してください');
      return;
    }
    // Day.jsオブジェクトをDateオブジェクトに変換
    try {
      const response = await axios.post('http://localhost:3000/api/v1/tasks', {
        name: name,
        deadline: deadline,
      });
      setTaskId(response.data._id);
      console.log('Response:', response.data);
      setAddSnackbar(true); // 成功時に追加スナックバーを開く
      setName(''); // タスク名を空にする
      setDeadline(null); // DatePickerを空にする
    } catch (error) {
      console.error('Error submitting form:', error);
      window.alert('タスクの追加に失敗しました。');
    }
  };

  const handleUndo = async () => {
    if (taskId) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/tasks/${taskId}`);
        console.log('Task deleted');
        setUndoSnackbar(true); // 取り消しスナックバーを開く
        setAddSnackbar(false); // 追加スナックバーを閉じる
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // タスク追加スナックバー閉じる
  const handleAddClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAddSnackbar(false);
  };

  // タスク追加取り消しスナックバー閉じる
  const handleUndoClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setUndoSnackbar(false);
  };

  const addAction = (
    <>
      <Button color="primary" size="small" onClick={handleUndo}>
        取り消す
      </Button>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleAddClose}>
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
      <CssBaseline />
      <Menu />
      <Paper style={{ padding: 16, margin: '16px auto', maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="タスク名(必須)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginBottom: 24 }} // マージンを増やす
          />
          <Box sx={{ display: 'flex', gap: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="期限(必須)"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 24 }} // マージンを増やす
            endIcon={<SendIcon />}
          >
            タスクを追加
          </Button>
        </form>
        <Snackbar
          open={addSnackBar}
          autoHideDuration={6000}
          onClose={handleAddClose}
          message="タスクが追加されました"
          action={addAction}
        />
        <Snackbar
          open={undoSnackBar}
          autoHideDuration={6000}
          onClose={handleUndoClose}
          message="タスクの追加が取り消されました"
          action={undoAction}
        />
      </Paper>
    </>
  );
};

export default CreateTask;