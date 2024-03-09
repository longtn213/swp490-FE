import React, { useState, 
    useEffect,
   } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from "axios";
import { Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";




export default function PopupEditEqui(props) {
    const {callFilterFromParent} = props;

    const [open, setOpen] = useState(false);
    const [ id, setId] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState(""); 
    
    useEffect(() => {        
        setId(props.item.id);
        setName(props.item.name);
        setCode(props.item.code);
        setDescription(props.item.description);
    }, [props.item])

    const hanldeUpdate =() => {
        let payload =  {
            id: id,
            code: code,
            name: name ,
            description: description
        }
        axios({
            url: 'http://localhost:8088/api/web/v1/equipment-type',
            method: 'post',
            data: payload,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(function (response) {
            //console.log(response);
            props.editDataUI(payload);
            callFilterFromParent();
        })
        .catch(function (error) {
            console.log(error);
        });
        handleClose();
    };

    const handleClickOpen = () => {
        setOpen(true);
       

    };


    const handleClose = () => {
        setOpen(false);
        popupState.close()
    };

    var popupState = props.popupState

   return (
       <div>
           {/* <Button variant="contained" onClick={handleClickOpen} >
               Sửa
           </Button> */}
           <Box  onClick={handleClickOpen}>
                <EditIcon sx={{ mr: 1 }} />
                Sửa
           </Box>
           <Dialog style={{ maxWidth: "100%", maxHeight: "80vh" }} open={open} onClose={handleClose} fullWidth maxWidth="md">
               <DialogTitle>Cập nhật các loại Thiết bị</DialogTitle>
               <DialogContent>
                   <DialogContentText>
                       Cập nhật Thiết bị cho hệ thống
                   </DialogContentText>
                   <TextField
                       autoFocus
                       margin="dense"
                       id="id"
                       label="số thứ tự"
                       type="text"
                       fullWidth
                       variant="standard"
                       value={id}
                       disabled={true}

                   />
                   <TextField
                       autoFocus
                       margin="dense"
                       id="name"
                       label="Tên Thiết bị"
                       type="text"
                       fullWidth
                       variant="standard"
                       value = {name}
                       onChange={e => setName(e.target.value)}
                   />
                   <TextField
                       autoFocus
                       margin="dense"
                       id="code"
                       label="Mã Thiết bị"
                       type="text"
                       fullWidth
                       variant="standard"
                       value={code}
                       onChange={e => setCode(e.target.value)}
                   />
                   <TextField
                       autoFocus
                       margin="dense"
                       id="description"
                       label="Miêu tả"
                       type="text"
                       fullWidth
                       variant="standard"
                       value={description}
                       onChange={e => setDescription(e.target.value)}
                   />
               </DialogContent>
               <DialogActions>
                   <Button onClick={handleClose}>Cancel</Button>
                   <Button onClick={hanldeUpdate}>Update</Button>
               </DialogActions>
           </Dialog>
       </div>
   );
}