import React, { useState, Component } from 'react';
/**
 * Page: Global Header
 * Type: CSR
 * Mockdata: ON
 * Description: Persistent header across all pages with location-aware community selector
 * Components: LocationSelector, GlobalSearch, NotificationBell, ProfileDropdown
 */
import { MainHeader } from './MainHeader';
export const Header = () => {
  return <MainHeader />;
};