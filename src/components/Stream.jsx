import React, { useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { LuMic2 } from "react-icons/lu";


const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 0,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));


const Stream = () => {
  const theme = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [micAccess, setMicAccess] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isLive, setIsLive] = useState(localStorage.getItem('live') === 'true');
  const [streamName, setStreamname] = useState('');
  const [tag, setTag] = useState();
  const [streamNameError, setStreamNameError] = useState(false);
  const [tagError, setTagError] = useState(false);



  const handleStart = () => {
    if (!streamName || !tag) {
      setStreamNameError(!streamName);
      setTagError(!tag);
      return;
    }
    const initializeMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);
        setMicAccess(true);
      } catch (err) {
        console.error(err);
        setMicAccess(false);
      }
    };
  
    const checkMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        // If the getUserMedia call succeeds, the user already has permission
        setMicAccess(true);
      } catch (err) {
        // If the getUserMedia call fails, prompt the user for permission
        initializeMediaRecorder();
      }
    };
  
    if (!micAccess) {
      checkMicPermission();
    } else {
      initializeMediaRecorder();
    }

    setIsLive(true);
    localStorage.setItem('live', true);
    setStreamname('')
    setTag('')
    alert('The stream has started');
  }

  const handleStop = () => {
    if (mediaRecorder) {
      // Stop the media recorder
      mediaRecorder.stop();

      // Release the microphone resources
      const stream = mediaRecorder.stream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }

    // Update state to reflect that the stream is no longer live
    setIsLive(false);
    localStorage.setItem('live', false);
  }

  const handleMute = () => {
    if (mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    } else {
      mediaRecorder.start();
    }
    setIsMuted(!isMuted);
  };

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  return (
    <>
      {!isLive && <div className='text-5xl flex justify-center text-white font-semibold my-8 font-live'>
        Go Live !
      </div>}
      {isLive && <div className='text-5xl flex justify-center text-white font-semibold my-8 font-live'>
        You are Live !
      </div>}
      <div className='flex h-auto items-center justify-center white-glassmorphism mx-auto w-min my-10'>
        {!isLive && <div className=''>
          <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginX: 'auto' }}>
            <Widget>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center', // Center text horizontally
                  mx: 'auto', // Center the box horizontally
                }}
              >
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    name="streamName"
                    fullWidth
                    id="streamName"
                    label="Stream Name"
                    autoFocus
                    variant='standard'
                    onChange={(e) => {
                      setStreamname(e.target.value);
                      setStreamNameError(false);
                    }}
                    InputLabelProps={{
                      style: { color: 'black' },
                    }}
                    error={streamNameError}
                    helperText={streamNameError && 'Stream Name is required'}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& > fieldset": { borderColor: "gray", borderWidth: "2px" },
                      },
                      "& .MuiInputBase-root": {
                        color: 'black'
                      },
                      "& .MuiOutlinedInput-root:hover": {
                        "& > fieldset": {
                          borderColor: "black"
                        }
                      },
                      mb: 2,
                      mt: 2,
                      mr: 7,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    name="tag"
                    fullWidth
                    id="tag"
                    label="Tag"
                    variant='standard'
                    onChange={(e) => {
                      setTag(e.target.value);
                      setTagError(false);
                    }}
                    autoFocus
                    InputLabelProps={{
                      style: { color: 'black' },
                    }}
                    error={tagError}
                    helperText={tagError && 'Tag is required'}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& > fieldset": { borderColor: "gray", borderWidth: "2px" },
                      },
                      "& .MuiInputBase-root": {
                        color: 'black'
                      },
                      "& .MuiOutlinedInput-root:hover": {
                        "& > fieldset": {
                          borderColor: "black"
                        }
                      },
                      mb: 2,
                      mr: 7
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 2,
                  mb: 2
                }}>
                  <Button variant="contained" onClick={handleStart} endIcon={<LuMic2 />}>Start</Button>
                </Grid>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 1,
                }}
              >
              </Box>
            </Widget>
          </Box>
        </div >}
        {
          isLive &&
          <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden', flexDirection: 'column' }}>
            <Widget>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ ml: 1.5, minWidth: 0 }}>
                  <Typography variant="caption" color="black" fontWeight={500}>
                    Artist
                  </Typography>
                  <Typography noWrap>
                    <b>Stream name</b>
                  </Typography>
                  <Typography noWrap letterSpacing={-0.25}>
                    Tag
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mt: 2, mb: -1 }}>
                <span className='h-3 w-3 bg-red-600 rounded-full animate-blink'></span>
                <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ ml: 1 }}>
                  Live
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 1,
                }}
              >
              </Box>
              <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1, mt: 1 }} alignItems="center">
                {micAccess ? (
                  <>
                    {isMuted ? (
                      <MicOffIcon htmlColor={lightIconColor} onClick={handleMute} className='cursor-pointer' />
                    ) : (
                      <MicNoneIcon htmlColor={lightIconColor} onClick={handleMute} className='cursor-pointer' />
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Microphone access denied
                  </Typography>
                )}

              </Stack>
              <Grid sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center', // Center text horizontally
                mx: 'auto', // Center the box horizontally
                mt: 4,
                mb: 1
              }}>
                <Button variant='contained' onClick={handleStop}
                  sx={{
                    backgroundColor: '#F44336',
                    ':hover': {
                      bgcolor: 'red',
                    }
                  }}>End stream</Button>
              </Grid>
            </Widget>
          </Box>
        }
      </div >
    </>
  )
}
export default Stream
