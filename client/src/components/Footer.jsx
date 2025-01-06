import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
        Sumimoto Sho.All rights are reserved.
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Copyright />
    </Box>
  );
}

export default Footer;