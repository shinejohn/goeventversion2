import React, { Component } from 'react';
/**
 * Component: Venue Map
 * Type: CSR
 * Mockdata: OFF
 * Description: Interactive map display for venue location
 * Components: None
 */
type VenueMapProps = {
  latitude: number;
  longitude: number;
  venueName: string;
};
export const VenueMap = ({
  latitude,
  longitude,
  venueName
}: VenueMapProps) => {
  return <iframe title={`Map of ${venueName}`} width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}></iframe>;
};