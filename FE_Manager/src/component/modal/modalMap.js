import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import MapGL, { Marker, NavigationControl, GeolocateControl } from '@goongmaps/goong-map-react'
import { GOONG_API_KEY, GOONG_MAPTILES_KEY } from 'public/constant'
import Pin from './pin'
import { useEffect } from 'react'
import { Button } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
}

const geolocateControlStyle = {
  right: -19,
  top: 110
}

export default function ModalMap(props) {
  const { open, setOpen, latitude, setLatitude, longitude, setLongitude } = props

  const [viewport, setViewport] = useState({
    width: 600,
    height: 400,
    zoom: 14,
    latitude: 21.0278,
    longitude: 105.8342
  })

  const handleClose = () => setOpen(false)

  // Handle marker event

  const [marker, setMarker] = useState({
    latitude: 21.0278,
    longitude: 105.8342
  })

  // Relocate marker when move the map
  useEffect(() => {
    setMarker({
      longitude: viewport.longitude,
      latitude: viewport.latitude
    })
  }, [viewport])

  useEffect(() => {
    if(latitude && longitude && !isNaN(latitude) && !isNaN(longitude) && isFinite(latitude) && isFinite(longitude)) {
      setMarker({
        longitude: longitude,
        latitude: latitude
      })
      setViewport({
        ...viewport,
        latitude: latitude,
        longitude: longitude
      })
    }
  }, [latitude, longitude])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <MapGL
          {...viewport}
          mapStyle='https://tiles.goong.io/assets/goong_map_web.json'
          onViewportChange={nextViewport => {
            setViewport(nextViewport)
            setLatitude(nextViewport.latitude)
            setLongitude(nextViewport.longitude)
          }}
          goongApiAccessToken={GOONG_MAPTILES_KEY}
        >
          <Marker longitude={marker.longitude} latitude={marker.latitude} offsetTop={-30} offsetLeft={-15}>
            <Pin size={30} />
          </Marker>

          <div className='nav' style={navStyle}>
            <NavigationControl />
            <GeolocateControl
              style={geolocateControlStyle}
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
            />
          </div>
        </MapGL>
        <div className='control-panel'>
          <strong>Kinh độ:</strong> {marker.longitude} <br />
          <strong>Vĩ độ:</strong> {marker.latitude}
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose}>Đóng</Button>
        </Box>
      </Box>
    </Modal>
  )
}
