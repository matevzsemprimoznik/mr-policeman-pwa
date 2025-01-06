'use client';
import React, { ReactNode, useState } from 'react';
import Map, { GeolocateControl } from 'react-map-gl';
import AdvancedMarker from '@/components/ui/advanced-marker';
import Modal from '@/components/ui/modal';
import ControlForm from '@/components/ui/control-form';
import mapboxgl from 'mapbox-gl';
import { useControls } from '@/lib/hooks/control';
import { Control } from '@/lib/types/control-types';
import ControlInformation from '@/components/ui/control-information';
import { useRadars } from '@/lib/hooks/radars';
import { Radar } from '@/lib/types/radar-types';
import RadarInformation from '@/components/ui/radar-information';
import { useUserGeoLocation } from '@/lib/hooks/location';
import { haversineDistanceBetweenPoints } from '@/lib/utils';
import {Button} from "@/components/ui/button";
import InfoModal from "@/components/ui/info-modal";

const defaultCoordinatesValue = {
  latitude: 0,
  longitude: 0,
};

enum ModalContent {
  CONTRIBUTION_FORM = 'form',
  CONTRIBUTION_INFO = 'info',
  RADAR_INFO = 'radar',
}

export default function Home() {
  const { data: controls, isLoading } = useControls();
  const [isModalOpen, setModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState(defaultCoordinatesValue);
  const [content, setContent] = useState(ModalContent.CONTRIBUTION_FORM);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [selectedRadar, setSelectedRadar] = useState<Radar>({} as Radar);
  const { location: userLocation } = useUserGeoLocation();
  const { data: radars } = useRadars();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = async () => {
    setModalOpen(false);
  };

  const handleMarkerClick = (control: Control) => {
    setSelectedControl(control);
    setContent(ModalContent.CONTRIBUTION_INFO);
    handleOpenModal();
  };

  const handleRadarClick = (radar: Radar) => {
    setSelectedRadar(radar);
    setContent(ModalContent.RADAR_INFO);
    handleOpenModal();
  };

  const handleMapClick = (e: mapboxgl.MapLayerMouseEvent) => {
    setCoordinates({
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng,
    });

    setContent(ModalContent.CONTRIBUTION_FORM);
    handleOpenModal();
  };

  const getModalContent = (content: ModalContent): ReactNode => {
    switch (content) {
      case ModalContent.CONTRIBUTION_FORM:
        return <ControlForm latitude={coordinates.latitude} longitude={coordinates.longitude} />;
      case ModalContent.CONTRIBUTION_INFO:
        return <ControlInformation control={selectedControl} />;
      case ModalContent.RADAR_INFO:
        return <RadarInformation radar={selectedRadar} />;
      default:
        return null;
    }
  };

  const onPositionChange = (position: GeolocationPosition) => {
    controls?.forEach((control) => {
      const distance = haversineDistanceBetweenPoints(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        {
          latitude: control.latitude,
          longitude: control.longitude,
        },
      );
      if (distance < 500) {
        new Notification('Kontrola prometa v bližini');
      }
    });
  };

  return (
    <div className="w-full">
      <InfoModal />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {getModalContent(content)}
      </Modal>
      <Map
        reuseMaps
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: userLocation?.longitude || 15.6361,
          latitude: userLocation?.latitude || 46.0569,
          zoom: 9,
        }}
        style={{ height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={(e) => handleMapClick(e)}
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserLocation
          onGeolocate={onPositionChange}
        />
        {!isLoading &&
          controls?.map((control) => (
            <AdvancedMarker<Control>
              key={control.id}
              longitude={control.longitude}
              latitude={control.latitude}
              data={control}
              onClick={handleMarkerClick}
            />
          ))}
        {radars?.map((radar) => (
          <AdvancedMarker<Radar>
            key={radar.id}
            longitude={radar.longitude}
            latitude={radar.latitude}
            data={radar}
            onClick={handleRadarClick}
          />
        ))}
      </Map>
    </div>
  );
}
