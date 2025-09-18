import React from 'react';
import { TargetElement } from './types';

export const TARGET_ELEMENTS: TargetElement[] = [
  { id: '1', name: 'nih_record_id', type: 'string' },
  { id: '2', name: 'nih_age', type: 'integer' },
  { id: '3', name: 'nih_consent', type: 'date' },
  { id: '4', name: 'nih_education', type: 'string' },
  { id: '5', name: 'nih_height', type: 'integer' },
  { id: '6', name: 'nih_weight', type: 'integer' },
  { id: '7', name: 'nih_gender', type: 'boolean' },
  { id: '8', name: 'nih_birth_date', type: 'date' },
  { id: '9', name: 'nih_ethnicity', type: 'string' },
  { id: '10', name: 'BEST', type: 'integer' }
];

export const HARMONIZATION_PRIMITIVES = {
  'ConvertUnits': { 
    name: 'ConvertUnits', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        <path d="M8 8h8v8H8z" opacity="0.3"/>
      </svg>
    )
  },
  'Truncate': { 
    name: 'Truncate', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6h12v2H6V6zm0 4h8v2H6v-2zm0 4h6v2H6v-2z"/>
        <path d="M19 14l-3-3v2H8v2h8v2l3-3z"/>
      </svg>
    )
  },
  'Cast': { 
    name: 'Cast', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6z"/>
        <path d="M14 12l4 4-4 4v-2.5H8v-3h6V12z"/>
      </svg>
    )
  },
  'EnumToEnum': { 
    name: 'EnumToEnum', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 0h6v6h-6v-6z"/>
        <path d="M10 6h4v2h-4V6zm0 10h4v2h-4v-2z"/>
      </svg>
    )
  },
  'Bin': { 
    name: 'Bin', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16v4H4V4zm0 6h6v10H4V10zm8 0h8v4h-8v-4zm0 6h6v4h-6v-4z"/>
      </svg>
    )
  },
  'Reduce': { 
    name: 'Reduce', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3 3h-2v4h-2V5h-2l3-3zm0 20l-3-3h2v-4h2v4h2l-3 3z"/>
        <path d="M2 12l3-3v2h4v2H5v2l-3-3zm20 0l-3 3v-2h-4v-2h4v-2l3 3z"/>
      </svg>
    )
  },
  'ConvertDate': { 
    name: 'ConvertDate', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
    )
  },
  'Round': { 
    name: 'Round', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  'Threshold': { 
    name: 'Threshold', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v2H3V3zm0 16h18v2H3v-2z"/>
        <path d="M5 7h14v10H5V7zm2 2v6h10V9H7z"/>
        <path d="M9 11h6v2H9v-2z"/>
      </svg>
    )
  }
};

export const PRIMITIVES = [
  'ConvertUnits',
  'Truncate', 
  'Cast',
  'EnumToEnum',
  'Bin',
  'Reduce',
  'ConvertDate',
  'Round',
  'Threshold'
] as const;

export const DATA_TYPES = ['string', 'integer', 'float', 'bool', 'date'];
export const REDUCE_OPERATIONS = ['sum', 'any', 'none', 'all', 'one-hot'];