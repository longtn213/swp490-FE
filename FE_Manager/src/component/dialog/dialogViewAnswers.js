import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material'

function DialogSCAAnswer(props) {
    const [open, setOpen] = useState(false); 
    const [answer, setAnswer] = useState([]);
    const [question, setQuestion] = useState([]);
    
    useEffect(() => {
        setOpen(props.open);
        if(props.answerSet.textAnswer && props.answerSet.textQuestion)
        {
            setAnswer(props.answerSet.textAnswer.split(','));
            setQuestion(props.answerSet.textQuestion.split(','));
        }        
    }, [props]);

    const handleOk = () => {
        if(props.callback && props.param){
            props.callback(props.param);
        }
        setOpen(false);
    };
  
    const handleCancel = () => {
        setOpen(false);
    };

    return (         
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>{props.title || 'Chú ý'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.message || 'Thông tin:'}
                </DialogContentText>
                {answer.length >0 && answer.map((ans, index) => {
                    return(
                        <Grid key={index} container spacing={12}>
                            <Grid item xs={6}>
                                {question[index]}
                            </Grid>
                            <Grid item xs={6}>
                                {ans}
                            </Grid>
                        </Grid>
                    )})
                }                
            </DialogContent>            
            <DialogActions>          
                <Button variant='outlined' onClick={handleOk}>{props.okLabel || 'OK'}</Button>
                <Button onClick={handleCancel}>{props.cancelLabel || 'Cancel'}</Button>
            </DialogActions>
        </Dialog>
    );
  }
  
  export default DialogSCAAnswer;