import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { ref } from 'firebase/database'
import { database } from '../../config/firebase'
import { useDatabaseUpdateMutation } from '@react-query-firebase/database'

const styleForm = {
  bgcolor: '#E0C097',
  borderRadius: '8px',
  border: '4px solid #000',

}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#B85C38',
  border: '4px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const styleSubmit = {
  bgcolor:'#5C3D2E',
  p:1,
  m: '10px 20px 0px 0px',
  color:'#E0C097'

}

export default function BasicModal({open, handleClose, onSubmit, id}) {
  const [nama, setNama] = useState('')

  const onChangeNama = (event) => {
    setNama(event.target.value)
  }
  
  const mutationEdit = useDatabaseUpdateMutation(ref(database, `userId/${id}`))

  const editNode = (event) => {
    event.stopPropagation()
    const result = mutationEdit.mutate({
      nama: nama,
    })
    setNama('')
    return result
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h2 style={{'color': '#312118'}} >Ubah nama</h2>
            <form onSubmit={onSubmit}>
              <TextField autoFocus sx={styleForm}
                fullWidth 
                label='Masukkan nama' 
                value={nama} 
                onChange={onChangeNama}
                margin='dense'
                variant='filled'
                InputLabelProps={{style: {color: '#5C3D2E',}}}
                InputProps={{style: {color:'#5C3D2E'}}}
              />
              <Button sx={styleSubmit}
                size='large' 
                fullWidth 
                onClick={editNode} 
                type='Submit' 
                margin='dense'
                variant='contained'
                >
                  Submit
              </Button>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}